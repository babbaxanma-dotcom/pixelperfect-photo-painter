#!/usr/bin/env node
/**
 * flux-kontext.cjs — Transform a real photo via BFL FLUX Kontext.
 *
 * Usage:
 *   node scripts/flux-kontext.cjs --input <jpg> --prompt-file <txt> --out <jpg>
 *
 * Cost: ~$0.05 per call (kontext-pro) or ~$0.08 (kontext-max).
 */

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const ENDPOINT = "https://api.bfl.ai/v1/flux-kontext-pro";

function loadKey() {
  if (process.env.BFL_API_KEY) return process.env.BFL_API_KEY.trim();
  const keyFile = path.join(os.homedir(), ".bfl_key");
  if (fs.existsSync(keyFile)) return fs.readFileSync(keyFile, "utf8").trim();
  throw new Error("No API key");
}

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { aspect: "3:2", seed: null };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--input") o.input = a[++i];
    else if (a[i] === "--prompt-file") o.promptFile = a[++i];
    else if (a[i] === "--prompt") o.prompt = a[++i];
    else if (a[i] === "--out") o.out = a[++i];
    else if (a[i] === "--aspect") o.aspect = a[++i];
    else if (a[i] === "--seed") o.seed = parseInt(a[++i], 10);
    else if (a[i] === "--max") o.endpoint = "https://api.bfl.ai/v1/flux-kontext-max";
  }
  if (!o.input) throw new Error("--input <jpg> required");
  if (!o.out) throw new Error("--out <jpg> required");
  if (o.promptFile) o.prompt = fs.readFileSync(o.promptFile, "utf8");
  if (!o.prompt) throw new Error("--prompt or --prompt-file required");
  return o;
}

(async () => {
  const t0 = Date.now();
  const opts = parseArgs();
  const key = loadKey();

  const inputB64 = fs.readFileSync(opts.input).toString("base64");
  console.log(`→ Kontext-transforming: ${opts.input}`);
  console.log(`  out=${opts.out}  aspect=${opts.aspect}  prompt=${opts.prompt.length}ch`);

  const body = {
    prompt: opts.prompt,
    input_image: inputB64,
    aspect_ratio: opts.aspect,
    safety_tolerance: 2,
    output_format: "jpeg",
    prompt_upsampling: false,
  };
  if (opts.seed != null) body.seed = opts.seed;

  const submitRes = await fetch(opts.endpoint || ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-key": key },
    body: JSON.stringify(body),
  });
  if (!submitRes.ok) throw new Error(`POST ${submitRes.status}: ${await submitRes.text()}`);
  const submit = await submitRes.json();
  const pollUrl = submit.polling_url || `https://api.bfl.ai/v1/get_result?id=${submit.id}`;
  console.log(`  id=${submit.id}  polling ${new URL(pollUrl).host}...`);

  for (let i = 0; i < 80; i++) {
    await new Promise((r) => setTimeout(r, 1500));
    const pr = await fetch(pollUrl, { headers: { "x-key": key } });
    if (!pr.ok) throw new Error(`POLL ${pr.status}`);
    const data = await pr.json();
    if (data.status === "Ready") {
      const imgUrl = data.result?.sample;
      if (!imgUrl) throw new Error(`No image in result`);
      const imgRes = await fetch(imgUrl);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.mkdirSync(path.dirname(opts.out), { recursive: true });
      fs.writeFileSync(opts.out, buf);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`✓ saved ${opts.out}  (${dt}s, ~$0.05)`);
      return;
    }
    if (
      data.status === "Error" ||
      data.status === "Request Moderated" ||
      data.status === "Content Moderated"
    ) {
      throw new Error(`BFL: ${data.status} — ${JSON.stringify(data).slice(0, 200)}`);
    }
  }
  throw new Error("Timeout 120s");
})().catch((e) => {
  console.error("✗", e.message);
  process.exit(1);
});
