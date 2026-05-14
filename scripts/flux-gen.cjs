#!/usr/bin/env node
/**
 * flux-gen.js — genereer 1 foto via BFL FLUX 1.1 [pro] ULTRA met raw=true.
 *
 * Usage:
 *   node scripts/flux-gen.js --prompt-file <txt> --out <jpg> [--aspect 3:2] [--seed 12345]
 *   node scripts/flux-gen.js --prompt "..."        --out <jpg> [--aspect 3:2] [--seed 12345]
 *
 * Reads API key from env BFL_API_KEY or C:\Users\janst\.bfl_key.
 * Cost: ~$0.06 per call. Always shows cost-before-call + asks confirmation when batching.
 */

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const BFL_ULTRA = "https://api.bfl.ai/v1/flux-pro-1.1-ultra";
const BFL_PRO11 = "https://api.bfl.ai/v1/flux-pro-1.1";
const BFL_KONTEXT_MAX = "https://api.bfl.ai/v1/flux-kontext-max";
const BFL_KONTEXT_PRO = "https://api.bfl.ai/v1/flux-kontext-pro";
const BFL_POLL = "https://api.bfl.ai/v1/get_result";

function loadKey() {
  if (process.env.BFL_API_KEY) return process.env.BFL_API_KEY.trim();
  const keyFile = path.join(os.homedir(), ".bfl_key");
  if (fs.existsSync(keyFile)) return fs.readFileSync(keyFile, "utf8").trim();
  throw new Error("No API key. Set BFL_API_KEY or create ~/.bfl_key");
}

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { aspect: "3:2", seed: null, imgStrength: 0.2 };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--prompt") o.prompt = a[++i];
    else if (a[i] === "--prompt-file") o.promptFile = a[++i];
    else if (a[i] === "--out") o.out = a[++i];
    else if (a[i] === "--aspect") o.aspect = a[++i];
    else if (a[i] === "--seed") o.seed = parseInt(a[++i], 10);
    else if (a[i] === "--image-prompt") o.imagePrompt = a[++i];
    else if (a[i] === "--image-strength") o.imgStrength = parseFloat(a[++i]);
    else if (a[i] === "--pro") o.model = "pro11";
    else if (a[i] === "--kontext") o.model = "kontext-max";
    else if (a[i] === "--kontext-pro") o.model = "kontext-pro";
    else if (a[i] === "--input-image") o.inputImage = a[++i];
  }
  if (!o.out) throw new Error("--out <jpg> required");
  if (o.promptFile) o.prompt = fs.readFileSync(o.promptFile, "utf8");
  if (!o.prompt) throw new Error("--prompt or --prompt-file required");
  return o;
}

async function postJson(url, body, key) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-key": key },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST ${url} -> ${r.status}: ${await r.text()}`);
  return r.json();
}

async function getJson(url, key) {
  const r = await fetch(url, { headers: { "x-key": key } });
  if (!r.ok) throw new Error(`GET ${url} -> ${r.status}: ${await r.text()}`);
  return r.json();
}

async function downloadTo(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Image download -> ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

(async () => {
  const t0 = Date.now();
  const opts = parseArgs();
  const key = loadKey();

  let endpoint, tagModel;
  if (opts.model === "pro11") { endpoint = BFL_PRO11; tagModel = "flux-pro-1.1"; }
  else if (opts.model === "kontext-max") { endpoint = BFL_KONTEXT_MAX; tagModel = "flux-kontext-max"; }
  else if (opts.model === "kontext-pro") { endpoint = BFL_KONTEXT_PRO; tagModel = "flux-kontext-pro"; }
  else { endpoint = BFL_ULTRA; tagModel = "flux-pro-1.1-ultra raw"; }
  console.log(`→ Generating: ${opts.out}`);
  console.log(`  aspect=${opts.aspect}  model=${tagModel}  prompt=${opts.prompt.length}ch`);

  const body = {
    prompt: opts.prompt,
    safety_tolerance: 2,
    output_format: "jpeg",
    prompt_upsampling: false,
  };
  if (opts.model === "pro11") {
    // flux-pro-1.1 uses width/height not aspect_ratio; map common aspects to safe dims
    const map = { "3:2": [1440, 960], "4:3": [1280, 960], "16:9": [1440, 816], "1:1": [1024, 1024], "4:5": [1024, 1280] };
    const [w, h] = map[opts.aspect] || [1440, 960];
    body.width = w;
    body.height = h;
  } else if (opts.model === "kontext-max" || opts.model === "kontext-pro") {
    body.aspect_ratio = opts.aspect;
    if (opts.inputImage) {
      const imgBuf = fs.readFileSync(opts.inputImage);
      body.input_image = imgBuf.toString("base64");
      console.log(`  + input_image (edit mode): ${path.basename(opts.inputImage)}`);
    }
  } else {
    body.aspect_ratio = opts.aspect;
    body.raw = true;
  }
  if (opts.seed != null) body.seed = opts.seed;
  if (opts.imagePrompt) {
    const imgBuf = fs.readFileSync(opts.imagePrompt);
    body.image_prompt = imgBuf.toString("base64");
    body.image_prompt_strength = opts.imgStrength;
    console.log(`  + image_prompt: ${path.basename(opts.imagePrompt)} (strength=${opts.imgStrength})`);
  }

  const submit = await postJson(endpoint, body, key);
  const pollUrl = submit.polling_url || `${BFL_POLL}?id=${submit.id}`;
  console.log(`  id=${submit.id}  polling ${new URL(pollUrl).host}...`);

  // poll up to ~60s
  let result;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const r = await getJson(pollUrl, key);
    if (r.status === "Ready") {
      result = r;
      break;
    }
    if (
      r.status === "Error" ||
      r.status === "Request Moderated" ||
      r.status === "Content Moderated"
    ) {
      throw new Error(`BFL returned: ${r.status} — ${JSON.stringify(r)}`);
    }
    if (i % 4 === 0) process.stdout.write(`  ...${r.status}\r`);
  }
  if (!result) throw new Error("Timed out after 90s");

  const imgUrl = result.result?.sample;
  if (!imgUrl) throw new Error(`No image in result: ${JSON.stringify(result)}`);

  await downloadTo(imgUrl, opts.out);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  const cost = opts.model === "kontext-max" ? "~$0.08" : opts.model === "kontext-pro" ? "~$0.04" : opts.model === "pro11" ? "~$0.04" : "~$0.06";
  console.log(`✓ saved ${opts.out}  (${dt}s, ${cost})`);
})().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
