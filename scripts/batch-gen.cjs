#!/usr/bin/env node
/**
 * batch-gen.cjs — Generate AB Bouw realisaties via BFL FLUX 1.1 [pro] ULTRA.
 *
 * Per photo: TWO seeds (_a.jpg / _b.jpg). Image-prompt anchor for Vlaamse style.
 * Skip if both already exist. Cost: 18 photos × 2 seeds × $0.06 = $2.16
 */

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const BFL_ENDPOINT = "https://api.bfl.ai/v1/flux-pro-1.1-ultra";
const IMG_PROMPT_PATH = "C:\\Users\\janst\\Downloads\\asdasdasdasdasdasd.PNG";
const IMG_STRENGTH = 0.2;

const AVOID = "Avoid: ornate Dutch lamps, Amsterdam canal architecture, brass plaques, terracotta tiles, Mediterranean villa, palm trees, drone perspective, 3D render, cartoon, illustration, AI sheen, stock-photo composition, magazine staging, sunny cloudless deep-blue sky.";

const PHOTOS = [
  {
    name: "04_extra_stadswoning-brussel",
    aspect: "3:2",
    prompt: `A finished restored narrow 1900 Belgian maison de maître townhouse facade — original cream stucco facade with carefully restored mouldings, a sgraffito decorative panel above the door, a tall panelled wooden front door painted matte deep-green with simple flat hardware, slim new black steel-framed windows in the original tall openings, an original Belgian blue-stone step. A wrought-iron balconnet on the first floor. Adjacent older townhouses on both sides clearly less restored. Soft Vlaamse March overcast daylight, sky a flat soft warm-grey. Eye-level straight-on view from across the street, slightly off-centre, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "05_extra_burgerwoning",
    aspect: "3:2",
    prompt: `A finished restored Belgian burgerwoning facade — original red-orange brick cleanly repointed with light-grey mortar, restored white natural-stone window sills and lintels with subtle ezelsrug brick detail, slim new anthracite-painted WOODEN windows matching the original profile (NOT plastic, NOT alu), a high panelled wooden front door painted matte dark-blue with simple flat hardware, a small original Belgian blue-stone step. Adjacent older burgerwoningen on both sides clearly un-restored — faded brick, old white PVC. Soft Vlaamse April overcast daylight, mature trees behind the building. Three-quarter view from the pavement, eye-level, ONE door, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "06_extra_halfopen-1970",
    aspect: "3:2",
    prompt: `A finished facade renovation of a typical 1970s Belgian halfopen woning (HOB) — the entire facade re-skinned with hand-moulded brick slips in warm grey-brown over exterior insulation (deep window reveals visible), slim anthracite aluminium windows with the ground-floor living-room opening enlarged to a 3 m picture window, a flush flat smoked-oak front door, a new zinc bakgoot. A Boomse-klinker driveway in herringbone with ornamental grasses and a clipped boxwood. An adjacent older HOB visible on the right with original red brick and old white PVC for clear contrast. Soft Vlaamse July late-afternoon overcast daylight. Three-quarter view from the front garden, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "07_extra_bel-etage",
    aspect: "3:2",
    prompt: `A finished facade transformation of a typical 1960s Belgian bel-étage — the original ground-floor garage door replaced by a solid panel of matte light-grey mineral crepi with a hidden flush service door integrated, the upper bel-étage volume now reads as a clean modern volume in matching matte light-grey crepi with a 3.6 m horizontal landscape window in slim matte-black aluminium, a small black louvred Renson ventilation grille, a flush smoked-oak front door, a new white-stone entrance step. Adjacent un-renovated bel-étages on both sides with their original brown-brick facades and old garage doors for instant contrast. Soft Vlaamse January overcast daylight, dry cold air. Three-quarter view from the street, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "08_extra_dakopbouw",
    aspect: "3:2",
    prompt: `A finished added third-floor dakopbouw on a Belgian rijwoning, three-quarter view from the opposite sidewalk. The new top volume fully clad in standing-seam anthracite zinc with a flat roof, a horizontal 2.4 m matte-black aluminium window facing the street, set back slightly from the existing facade. The lower two floors also renovated: matte light-grey mineral crepi, slim black aluminium windows, a flush smoked-oak front door. Adjacent rijwoningen on both sides clearly un-renovated with original red brick and old white PVC. Soft Vlaamse March overcast daylight with broken cumulus. Eye-level from the pavement opposite, ONE door, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "09_extra_keuken-walnoot",
    aspect: "3:2",
    prompt: `A finished open-plan kitchen in a renovated Vlaamse rijwoning — handgreeploos walnut-veneer cabinets running to the ceiling on the left wall, a 3.2 m central island in matte clay-coloured lacquer with a 6 cm thick warm beige composite worktop and a single under-mount sink, a brushed-nickel mixer, a black Bora induction hob with integrated downdraft, two small black pendant lights above the island, a warm 2700K LED strip under the wall units. Soft Vlaamse April daylight from a tall window on the right, the central pendants ON providing warm 2700K pool over the island, the back of the room sitting in cool blue-grey fall-off. Three-quarter view from the dining area, eye-level. ${AVOID}`,
  },
  {
    name: "10_extra_keuken-groen",
    aspect: "3:2",
    prompt: `A finished kitchen in a renovated Vlaamse villa — handgreeploos cabinets in matte deep forest-green running to the ceiling, a 3.5 m central island in warm light oak veneer with a thick honed Belgian blue-stone (arduin) worktop and a butler-style ceramic sink, a brushed-brass mixer, a Quooker tap, an integrated extractor in the ceiling, a stainless-steel oven flush built-in. Soft Vlaamse May early morning daylight through a 4 m sliding garden door on the right, the green cabinetry reading slightly cool on the unlit side with warm reflection off the oak island. Three-quarter view from the breakfast nook, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "11_extra_woonkamer-parket",
    aspect: "3:2",
    prompt: `A finished living room in a renovated Vlaamse herenhuis — re-sanded original oak chevron parquet, warm white smoothly plastered walls with the KEPT original moulded cornice and ceiling rose, a flush LED tape concealed in the cornice, a 3.5 m deep boucle sofa in soft beige with two linen cushions, a low travertine coffee table, a tall brushed-brass floor lamp, a large fiddle-leaf fig in a terracotta pot, a tall window with slim BLACK steel profiles, an original cast-iron radiator beneath painted matching the wall. Soft Vlaamse February afternoon, low west sun pouring hard horizontal through the tall window painting a warm-gold stripe across the parquet, the chevron pattern catching the side-light. Three-quarter view, eye-level. ${AVOID}`,
  },
  {
    name: "12_extra_slaapkamer-suite",
    aspect: "3:2",
    prompt: `A finished master bedroom in a renovated Vlaamse rijwoning — warm light oak floor, soft warm white plastered walls, a low platform bed in oak veneer with natural matte linen bedding, two simple wall-mounted brushed-nickel reading lights, a long floating oak shelf above the bed with two ceramic vases, a tall narrow window with slim matte-black aluminium on the right, a small ZZ-plant in a terracotta pot. Soft Vlaamse July early-morning warm light pouring sideways through a thin gauze curtain, the bedding catching warm tones on the lit side and cool blue in the troughs. Three-quarter view from the corner of the bed, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "13_extra_inkomhal",
    aspect: "3:2",
    prompt: `A finished inkomhal/entryway in a renovated Vlaamse rijwoning — greige porcelain floor tiles 60×120, soft warm white plastered walls, an oak tongue-and-groove half-height wall-cladding to 1.4 m, a slim oak bench with a single linen cushion, three black wall hooks, a long floating walnut shelf with a small terracotta dish for keys, a tall slim mirror in a thin black frame, a small olive tree in a terracotta pot by the door. Soft Vlaamse October overcast daylight through a tall side window, a single warm 2700K wall sconce ON above the coat hooks providing a tight warm pool. Three-quarter view, eye-level. ${AVOID}`,
  },
  {
    name: "14_extra_dakkapel-zink",
    aspect: "3:2",
    prompt: `A finished new zinc-clad dakkapel on the front slope of a Belgian rijwoning, eye-level three-quarter from the pavement across the street. Standing-seam anthracite zinc cladding on the cheeks and flat top, a horizontal 2 m matte-black aluminium window, a clean lead flashing meeting the new matte donker-grijze keramische pannen, a slim zinc bakgoot below. The facade beneath also renovated: light-grey mineral crepi, slim black aluminium windows. The adjacent rijwoning roof on the right is OLD: faded keramische pannen, original red brick, sagging gutter. Soft Vlaamse March bright clear daylight. Eye-level from the opposite pavement, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "15_extra_garage-renovatie",
    aspect: "3:2",
    prompt: `A finished garage-conversion-and-facade transformation on a Belgian rijwoning — the old garage door replaced by a 3 m fixed picture window with a low solid panel beneath in matte light-grey mineral crepi, the rest of the facade re-clad in matching crepi, slim matte-black aluminium windows on the upper floor, a flush smoked-oak front door, a new zinc bakgoot, a polished concrete entrance strip. Adjacent rijwoningen on both sides still with old garage doors and original brick for instant contrast. Soft Vlaamse April daylight, the concrete strip and pavement slightly damp. Three-quarter view from the pavement opposite, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "16_extra_loft-stalen-ramen",
    aspect: "3:2",
    prompt: `A finished loft-style living space in a converted Belgian warehouse — a wall of slim black steel crittall windows on the right, an exposed cleaned red-brown brick wall on the left (original, kept), a polished concrete floor, an open kitchen across the back in matte off-white handgreeploos cabinets with a stainless-steel worktop, a long oak dining table with six simple black metal chairs, a black pendant cluster above the table, a worn caramel-leather sofa. Soft Vlaamse March mid-morning, low east sun pouring hard through the crittall windows projecting a grid of warm-gold parallelograms across the polished concrete floor and onto the exposed brick wall opposite, every grout line in sharp side-light. Three-quarter view, eye-level. ${AVOID}`,
  },
  {
    name: "17_extra_houtskelet-thermowood",
    aspect: "3:2",
    prompt: `A finished Belgian timber-frame new-build — vertical Thermowood cladding in warm honey-brown on the upper volume, a matte light-grey mineral crepi plinth on the ground floor, a flat warm EPDM roof with a hidden gutter, slim anthracite aluminium windows in deep reveals (driedubbel glas visibly thicker), a flush larch front door, a 4 m sliding door at the side, a gravel driveway, a clipped taxus hedge, a multi-stem amelanchier, mature beech trees behind. Soft Vlaamse November overcast daylight, the honey-brown Thermowood reading warm against the cool blue-grey sky. Three-quarter view from the front garden, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "18_extra_pastorij",
    aspect: "3:2",
    prompt: `A finished restoration of a Belgian pastorij-style detached house — original whitewashed brick facade carefully kept and freshened, original small-pane wooden shutters painted matte deep-green, slim new black steel windows replacing old wooden ones, a high panelled wooden front door painted matte deep-green with a simple brass knocker, a new zinc bakgoot, an original Belgian blue-stone step. A discreet modern flat-roofed brick extension just visible at the side in dark grey handvorm brick. A gravel driveway, hortensia bushes, a clipped taxus hedge, a mature lime tree casting soft shadow on the whitewash. Soft Vlaamse July daylight. Three-quarter view from the gravel driveway, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "19_extra_kantoor-aan-huis",
    aspect: "3:2",
    prompt: `A finished home-office in a renovated Belgian rijwoning — a long warm light oak desk against a wall of soft warm white plaster with a built-in oak shelving niche above, a black simple task chair, a slim matte-black desk lamp ON, a small terracotta pot with a trailing pothos, a black-framed simple line-drawing on the wall, a tall slim window with slim matte-black aluminium on the left. Soft Vlaamse March cloudy daylight through the tall narrow window, the slim desk lamp providing a small warm 2700K pool on the oak desk, the far side of the room dropping into noticeably deeper cool grey shade. Three-quarter view, eye-level, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "20_extra_tuingevel-schuifraam",
    aspect: "3:2",
    prompt: `A finished garden-side facade of a renovated Belgian villa, three-quarter view from the lawn. A 6 m wide three-panel anthracite aluminium sliding door dominates the ground floor, set in a matte light-grey mineral crepi facade with a dark handvorm brick plinth, a flat warm EPDM roof with a hidden gutter, a small vertical strip of standing-seam anthracite zinc beside the sliding door for volume articulation, a warm interior glow visible through the glass (light oak floor, hint of a kitchen island). A large kandla-stone terrace, a single low rusted corten planter holding ornamental grasses and lavender, a multi-stem Japanese maple, a clipped hornbeam hedge at the back. Soft Vlaamse September early evening overcast daylight. Eye-level from the lawn, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
  {
    name: "21_extra_aanbouw-modern",
    aspect: "3:2",
    prompt: `A finished modern flat-roofed extension built onto the back of an older Belgian fermette — the contrast between the original whitewashed brick of the fermette (kept) and the new dark-grey handvorm brick volume is the subject. The new volume has a 4 m wide two-panel anthracite aluminium sliding door opening onto a kandla-stone terrace, a flat warm EPDM roof with a hidden gutter, a single small vertical strip of standing-seam anthracite zinc beside the sliding door, a warm interior glow softly visible through the glass. The terrace with a single low rusted corten planter with grasses, a multi-stem Japanese maple in autumn red, a clipped taxus hedge at the back. The witgekalkt brick of the old fermette visible on the left as a clear before-after contrast. Soft Vlaamse September overcast daylight. Eye-level three-quarter view from the lawn, clean Vlaamse aannemer portfolio composition. ${AVOID}`,
  },
];

const SEEDS = [42, 777];

function loadKey() {
  if (process.env.BFL_API_KEY) return process.env.BFL_API_KEY.trim();
  const keyFile = path.join(os.homedir(), ".bfl_key");
  if (fs.existsSync(keyFile)) return fs.readFileSync(keyFile, "utf8").trim();
  throw new Error("No API key");
}

async function generateOne(photo, seed, suffix, key, refImgB64) {
  const outPath = path.join(
    __dirname,
    "..",
    "src/assets/realisaties",
    `${photo.name}_${suffix}.jpg`
  );
  if (fs.existsSync(outPath)) {
    return { skipped: true, path: outPath };
  }
  const body = {
    prompt: photo.prompt,
    aspect_ratio: photo.aspect,
    raw: true,
    safety_tolerance: 2,
    output_format: "jpeg",
    prompt_upsampling: false,
    seed,
    image_prompt: refImgB64,
    image_prompt_strength: IMG_STRENGTH,
  };
  const r = await fetch(BFL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-key": key },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`POST ${r.status}: ${await r.text()}`);
  const submit = await r.json();
  const pollUrl = submit.polling_url || `https://api.bfl.ai/v1/get_result?id=${submit.id}`;

  for (let i = 0; i < 80; i++) {
    await new Promise((res) => setTimeout(res, 1500));
    const pr = await fetch(pollUrl, { headers: { "x-key": key } });
    if (!pr.ok) throw new Error(`POLL ${pr.status}`);
    const data = await pr.json();
    if (data.status === "Ready") {
      const imgUrl = data.result?.sample;
      if (!imgUrl) throw new Error(`No image in result`);
      const imgRes = await fetch(imgUrl);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, buf);
      return { skipped: false, path: outPath };
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
}

(async () => {
  const key = loadKey();
  const refImgB64 = fs.readFileSync(IMG_PROMPT_PATH).toString("base64");
  const t0 = Date.now();
  let ok = 0,
    skip = 0,
    fail = 0;

  console.log(`Image-prompt anchor: ${path.basename(IMG_PROMPT_PATH)} (strength=${IMG_STRENGTH})`);
  console.log(`${PHOTOS.length} photos × ${SEEDS.length} seeds = ${PHOTOS.length * SEEDS.length} generations\n`);

  for (let i = 0; i < PHOTOS.length; i++) {
    const p = PHOTOS[i];
    for (let s = 0; s < SEEDS.length; s++) {
      const suffix = String.fromCharCode(97 + s); // a, b, c...
      const idx = `[${i + 1}/${PHOTOS.length}]${suffix}`;
      process.stdout.write(`${idx} ${p.name}_${suffix} ... `);
      try {
        const r = await generateOne(p, SEEDS[s], suffix, key, refImgB64);
        if (r.skipped) {
          process.stdout.write(`SKIP (exists)\n`);
          skip++;
        } else {
          const dt = ((Date.now() - t0) / 1000).toFixed(0);
          process.stdout.write(`✓ (${dt}s, $${((ok + 1) * 0.06).toFixed(2)} cum)\n`);
          ok++;
        }
      } catch (e) {
        process.stdout.write(`✗ ${e.message}\n`);
        fail++;
      }
    }
  }

  const totalDt = ((Date.now() - t0) / 1000).toFixed(0);
  console.log(`\nDone. ✓ ${ok}  skip ${skip}  ✗ ${fail}  time ${totalDt}s  cost ~$${(ok * 0.06).toFixed(2)}`);
})().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});
