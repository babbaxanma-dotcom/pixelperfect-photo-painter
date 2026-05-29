/**
 * AB Bouw LP image generator V2 — herwerkt na test 1 (Dutch-vinex fail).
 *
 * V2-strategie (gebaseerd op research):
 *  - GEEN brand-names (Koramic/Vandersanden hallucineren naar "Koremic Folfutan")
 *  - CITY anchors ipv "Belgian": "Mechelen suburb", "Lier 19th-century district"
 *  - Photographer anchor: "photographed by Stijn Bollaert" (heeft training data)
 *  - Architect anchor voor modern: "Vincent Van Duysen warm minimalism"
 *  - Visuele material descriptions: "hand-formed warm red-brown brick, thick cream lime mortar joints"
 *  - Embedded negation: "no Dutch vinex, no pastel colors, no white painted window frames"
 *  - End every prompt met "ArchDaily" of "Divisare" — caption-anchor naar pro-photography
 *
 * Run:
 *   export BFL_API_KEY="..." && node generate-lp-images.mjs
 *
 * Test mode (alleen 3 images x 1 seed = $0.18):
 *   TEST=1 node generate-lp-images.mjs
 */
import { writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const API_KEY = process.env.BFL_API_KEY;
const TEST_MODE = process.env.TEST === '1';

if (!API_KEY) {
  console.error('❌ BFL_API_KEY env var ontbreekt');
  process.exit(1);
}

const ENDPOINT = 'https://api.bfl.ai/v1/flux-pro-1.1-ultra';
const SEEDS = TEST_MODE ? [101] : [101, 202, 303];
const OUT_DIR = TEST_MODE ? 'generated-images-v2-test' : 'generated-images-v2';

const PROMPTS = [
  // ─────────── DAKWERKEN LP ───────────
  { dir: 'dak', name: 'lp-classic-renovatie', ar: '16:9', raw: true, prompt:
    `Narrow 3-storey brick row house in 19th-century working-class district of Mechelen, hand-formed warm red-brown brick with thick cream lime mortar joints visible, freshly installed steep 45-degree dark anthracite clay pantile roof, tall narrow aluminum-frame windows with deep reveal, blue stone window sills, blue stone plinth, continuous street wall flush to sidewalk no front garden, neighbour's facade in slightly different brick visible at right edge, parked compact European van cropped at left edge. Overcast soft northern European light, late afternoon, no shadows. Photographed by Stijn Bollaert, ArchDaily architectural documentation. No Dutch vinex aesthetic, no pastel colors, no white painted window frames`
  },
  { dir: 'dak', name: 'lp-crepi-nieuwbouw', ar: '16:9', raw: true, prompt:
    `Contemporary low-energy villa in Antwerp suburb, single elongated volume with overhanging gable roof, kalei lime-painted brick facade in warm off-white, dark anthracite zinc standing-seam roof, full-height anodized dark aluminum windows with deep reveal, exposed concrete plinth at ground level, mature beech hedge as boundary. Vincent Van Duysen warm minimalism, photographed by Bas Princen, ArchDaily. Overcast diffuse Flemish light. No Dutch vinex new-build, no Scandinavian style, no pastel colors`
  },
  { dir: 'dak', name: 'lp-oranje-solar', ar: '16:9', raw: true, prompt:
    `Three-bay semi-detached brick house in Antwerp ring suburb, warm orange-red hand-formed Flemish brick with thick beige lime mortar, steep clay pantile roof with integrated flush-mounted black monocrystalline solar panels covering south slope, no visible mounting frames, dark anthracite aluminum windows with deep reveal, paved driveway with concrete klinkers, low brick boundary wall. Photographed by Stijn Bollaert, ArchDaily. Overcast soft light, late afternoon. No Danish farmhouse style, no Scandinavian, no Dutch vinex`
  },
  { dir: 'dak', name: 'lp-geel-nieuwbouw', ar: '16:9', raw: true, prompt:
    `Recent contemporary villa in Lier suburb, warm yellow-beige hand-formed brick facade laid in traditional Flemish bond, deep raked mortar joints creating strong shadow lines, dark anthracite clay pantile roof, tall narrow dark aluminum windows with deep reveal, blue stone plinth, beech hedge boundary, sober landscaping. Vincent Van Duysen warm minimalism aesthetic, photographed by Frederik Vercruysse, ArchDaily. Overcast Flemish daylight. No Dutch vinex, no Scandinavian minimalism, no white window frames`
  },
  { dir: 'dak', name: 'lp-velux', ar: '3:2', raw: true, prompt:
    `Interior of converted attic workspace in Belgian terraced house, freshly installed roof window flooding room with natural daylight, exposed wooden rafters and ceiling beams of original roof structure, white-painted plasterboard between beams, simple wooden desk with laptop and ceramic coffee mug below window. View through roof window shows overcast sky and adjacent dark clay tile roofs of neighbours. Photographed by Stijn Bollaert architectural interior, available light only at ISO 800. No Scandinavian style, no IKEA showroom aesthetic, no bright white walls`
  },
  { dir: 'dak', name: 'lp-vakman', ar: '3:2', raw: true, prompt:
    `Belgian roofer mid-action installing dark anthracite clay pantile on a steep 45-degree saddle roof in Mechelen, wearing yellow hi-vis safety vest over dark navy work trousers, white safety helmet, focused expression. Aluminum systeem scaffolding visible at frame edge. Background shows other steep clay pantile roofs of typical Flemish terraced houses, dark zinc gutters. Tiles stacked on temporary plank. Overcast diffuse daylight. Documentary action photography by Stijn Bollaert, ArchDaily building site coverage. No staged corporate look, no Dutch hi-vis orange, no American hard hat`
  },
  { dir: 'dak', name: 'lp-natuurleien', ar: '4:3', raw: true, prompt:
    `Close-up macro detail of newly laid Spanish natural slate roof tiles in deep blue-grey on traditional Belgian church roof, slightly varying tonal range between slates, copper valley flashing intersection in lower frame, traditional overlapping cross-bond pattern. Single small autumn leaf caught between two slates. Overcast Belgian sky reflected in damp slate surfaces. Architectural detail photography by Stijn Bollaert, ArchDaily, 90mm macro lens at f/8. No glossy polished surfaces, no Mediterranean terracotta, no roof shingles`
  },
  { dir: 'dak', name: 'lp-plat-dak', ar: '3:2', raw: true, prompt:
    `Flat roof of contemporary Belgian villa freshly covered with seamless black EPDM rubber membrane, aluminum edge profile trim, single roof skylight in distance, dark zinc drainage outlet with HEAD pipe inlet detail. Elevated view across rooftops of Antwerp suburb showing other modern villas, mature trees. Wet membrane reflecting overcast pale grey sky. Vincent Van Duysen contemporary architecture, photographed by Bas Princen, ArchDaily roof inspection style. No green roof, no garden terrace, no balcony furniture`
  },
  { dir: 'dak', name: 'lp-zink-goot', ar: '4:3', raw: true, prompt:
    `Architectural detail of newly soldered dark anthracite zinc gutter against warm red-brown hand-formed Flemish brick wall, perfect solder joint visible on zinc edge, copper rainwater downpipe transitioning with custom bend. Single drop of water sliding along zinc edge. Raking afternoon light from the side revealing zinc surface texture variation and irregular mortar joints. Photographed by Stijn Bollaert architectural detail, ArchDaily, 50mm at f/5.6. No shiny new copper, no perfect symmetry, no industrial setting`
  },
  { dir: 'dak', name: 'lp-anatomy-illustration', ar: '16:9', raw: false, prompt:
    `Clean architectural cross-section technical illustration of steep Flemish clay-tile roof construction showing layered materials from top to bottom: dark anthracite clay roof tiles, wooden battens, breathable underlayment membrane, 22cm rigid insulation board between rafters, wooden structural beams, vapor barrier film, white-painted ceiling finish. Each layer labeled with thin grey arrows in Dutch. Diagrammatic style, isometric 30-degree angle, off-white background, soft drop shadows. Technical architectural drawing precision`
  },
  { dir: 'dak', name: 'lp-3d-exploded', ar: '16:9', raw: false, prompt:
    `Exploded isometric 3D architectural rendering of pitched roof construction, 6 floating material layers in sequence with 30cm vertical gap between each: dark anthracite clay roof tiles at top, wooden battens, breathable membrane underlayment, 22cm rigid insulation panels, wooden rafter beams, vapor barrier sheet. Each layer floating above the next in front of soft off-white studio background, subtle drop shadows below each layer indicating depth. Clean photoreal architectural visualization, isometric angle. No text or labels visible`
  },
  { dir: 'dak', name: 'lp-comfort-illustration', ar: '3:2', raw: true, prompt:
    `Cozy Belgian living room interior on overcast winter afternoon in Antwerp, view through tall dark aluminum window to a renovated rooftop across the street showing fresh dark clay tiles, woman in her 40s reading a book on a linen sofa, woolen throw blanket, ceramic mug of steaming tea on side table, single floor lamp with warm light, no overhead lights. Subtle white radiator against white wall. Sober Belgian interior. Photographed by Frederik Vercruysse, ArchDaily, 35mm at f/2.8, ISO 800. No Scandinavian hygge, no IKEA furniture, no white wood floors`
  },

  // ─────────── GEVEL LP ───────────
  { dir: 'gevel', name: 'witte-crepi', ar: '16:9', raw: true, prompt:
    `Modern semi-detached villa in Mechelen suburb with smooth white plaster facade freshly applied, dark anthracite aluminum windows with deep reveal, blue stone window sills, dark anthracite clay tile roof, narrow gravel pad along facade edge with hortensia bushes. Neighbour's red-brick facade visible at right edge for visual contrast. Sober Belgian suburban context. Vincent Van Duysen warm minimalism, photographed by Stijn Bollaert, ArchDaily. Overcast Flemish daylight revealing plaster micro-texture. No Mediterranean white villa, no Greek aesthetic, no Dutch vinex`
  },
  { dir: 'gevel', name: 'grijze-crepi', ar: '16:9', raw: true, prompt:
    `Belgian semi-detached house in Lier suburb with warm light-grey smooth plaster facade, traditional steep saddle roof with red-brown clay tiles, dark anthracite aluminum windows and blue stone sills. Low brick boundary wall with metal fence, beech hedge behind. Wet sidewalk from earlier rain. Pale grey March afternoon sky. Photographed by Stijn Bollaert, ArchDaily, 35mm at f/8, slight handheld tilt. No Scandinavian style, no Dutch vinex, no white painted window frames`
  },
  { dir: 'gevel', name: 'steenstrips', ar: '16:9', raw: true, prompt:
    `Modern garden extension on Belgian villa in Antwerp suburb, dark anthracite brick slip cladding contrasting with older white plastered main house, large dark aluminum sliding doors looking out onto wooden terrace deck. Slight clutter: coiled garden hose, single weathered teak chair. Sober Belgian backyard with hortensia bushes and ivy. Vincent Van Duysen aesthetic, photographed by Bas Princen, ArchDaily. Overcast diffuse daylight, soft shadows. No Mediterranean style, no IKEA garden furniture`
  },
  { dir: 'gevel', name: 'sierpleister', ar: '16:9', raw: true, prompt:
    `Contemporary Belgian villa in Bruges suburb with strong horizontal contrast: upper volume in hand-applied white textured lime plaster, lower volume clad in anthracite fiber-cement cladding panels. Hidden flat roof behind composite trim. Tall dark aluminum window framing in deep reveal. Modern landscaping: gravel pad with single multi-stem birch tree, low beech hedge perimeter. Pale Flemish sky, overcast diffuse afternoon light. Vincent Van Duysen minimalism, photographed by Filip Dujardin, ArchDaily. No Mediterranean stucco, no California minimalist, no Dutch vinex`
  },
  { dir: 'gevel', name: 'stelling', ar: '3:2', raw: true, prompt:
    `Mid-project view of Belgian terraced house in Mechelen city centre with full-facade aluminum systeem scaffolding, exterior insulation panels being installed at upper level, two construction workers in yellow hi-vis vests over dark navy work trousers carrying insulation board. White compact European work van parked at curb. Cardboard packaging stacked neatly on sidewalk. Pale grey overcast sky. Documentary site photography by Stijn Bollaert, ArchDaily, 23mm at f/8. No staged corporate look, no Dutch hi-vis orange, no shiny new equipment`
  },
  { dir: 'gevel', name: 'intro', ar: '16:9', raw: true, prompt:
    `Wide context shot of three adjacent narrow brick row houses in Mechelen 19th-century working-class district, the middle one freshly renovated with new smooth white plaster facade, two neighbours in different unrenovated states one warm red brick one yellow-beige brick, shared party walls visible. Continuous narrow street wall flush to sidewalk no front gardens, parked compact European car cropped at left edge, single pedestrian walking in distance, power line crossing upper sky. Pale grey March overcast. Photographed by Stijn Bollaert, ArchDaily streetscape documentation. No Dutch vinex, no suburban setting, no front garden`
  },
  { dir: 'gevel', name: 'lp-anatomy-cross', ar: '16:9', raw: false, prompt:
    `Clean architectural cross-section technical illustration of exterior wall insulation system showing layered materials from outside to inside: smooth white plaster outer finish, fiberglass reinforcement mesh embedded in cement base coat, thick rigid foam insulation board, adhesive layer, original red brick wall structure. Each layer labeled with thin grey arrows and metric measurements in Dutch. Diagrammatic style, isometric 30-degree angle, off-white background, soft drop shadows. Technical architectural drawing precision`
  },
  { dir: 'gevel', name: 'lp-anatomy-l1', ar: '1:1', raw: false, prompt:
    `Isolated architectural visualization of weathered warm red-brown hand-formed Flemish brick wall section floating against soft off-white studio background, 3D photoreal texture, irregular thick cream lime mortar joints, subtle color variation between bricks suggesting age, single layer in isolation, 30-degree isometric angle, soft drop shadow below indicating thickness. Clean technical illustration style, no surrounding context, no text labels`
  },
  { dir: 'gevel', name: 'lp-anatomy-l2', ar: '1:1', raw: false, prompt:
    `Isolated architectural visualization of 14cm thick rigid foam insulation board with even adhesive pattern visible on back side, photoreal white-grey insulation foam texture, sharp clean cut edges, single layer floating against soft off-white studio background, 30-degree isometric angle, soft drop shadow, clean technical illustration style, no surrounding context, no text labels`
  },
  { dir: 'gevel', name: 'lp-anatomy-l3', ar: '1:1', raw: false, prompt:
    `Isolated architectural visualization of fiberglass reinforcement mesh embedded in grey-beige cement base coat layer, fine fiberglass net pattern visible through wet cement surface, photoreal material texture, single layer floating against off-white studio background, 30-degree isometric angle, soft drop shadow, clean technical illustration. No text labels, no surrounding context`
  },
  { dir: 'gevel', name: 'lp-anatomy-l4', ar: '1:1', raw: false, prompt:
    `Isolated architectural visualization of off-white siloxane primer coat smoothly applied over cement base coat, subtle sheen suggesting fresh application, photoreal smooth texture, single layer floating against off-white studio background, 30-degree isometric angle, soft drop shadow, clean technical illustration style. No text labels, no surrounding context`
  },
  { dir: 'gevel', name: 'lp-anatomy-l5', ar: '1:1', raw: false, prompt:
    `Isolated architectural visualization of finished smooth white textured silicone plaster facade finish in warm off-white tone, fine spatula-applied surface texture visible, photoreal surface variation, single layer floating against off-white studio background, 30-degree isometric angle, soft drop shadow, clean technical illustration style. No text labels, no surrounding context`
  },
];

// Test mode: only 3 most representative prompts
const ACTIVE = TEST_MODE
  ? PROMPTS.filter(p => ['lp-classic-renovatie', 'lp-crepi-nieuwbouw', 'lp-vakman'].includes(p.name))
  : PROMPTS;

// ── Helpers ──────────────────────────────────────────────────────

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generateOne(prompt, aspectRatio, raw, seed) {
  const post = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'x-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspectRatio,
      raw,
      seed,
      safety_tolerance: 2,
      output_format: 'jpeg',
    }),
  });

  if (!post.ok) {
    const text = await post.text();
    throw new Error(`POST failed ${post.status}: ${text.slice(0,200)}`);
  }
  const { id, polling_url } = await post.json();
  if (!polling_url) throw new Error(`No polling_url`);

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    await sleep(1500);
    const poll = await fetch(polling_url, {
      headers: { 'accept': 'application/json', 'x-key': API_KEY },
    });
    if (!poll.ok) continue;
    const data = await poll.json();
    if (data.status === 'Ready') {
      const imgUrl = data.result?.sample;
      if (!imgUrl) throw new Error('Ready but no sample URL');
      const dl = await fetch(imgUrl);
      if (!dl.ok) throw new Error(`Download failed ${dl.status}`);
      return Buffer.from(await dl.arrayBuffer());
    }
    if (data.status === 'Error' || data.status === 'Failed') {
      throw new Error(`Job failed: ${JSON.stringify(data).slice(0,300)}`);
    }
  }
  throw new Error('Timeout after 90s');
}

// ── Main loop ─────────────────────────────────────────────────────

await mkdir(join(OUT_DIR, 'dak'), { recursive: true });
await mkdir(join(OUT_DIR, 'gevel'), { recursive: true });

const total = ACTIVE.length * SEEDS.length;
let done = 0, failed = 0, skipped = 0;
const t0 = Date.now();

console.log(`Mode: ${TEST_MODE ? 'TEST (3 prompts × 1 seed)' : 'FULL (25 prompts × 3 seeds)'}`);
console.log(`Output dir: ./${OUT_DIR}/\n`);

for (const p of ACTIVE) {
  for (const seed of SEEDS) {
    done++;
    const filename = `${p.name}-seed${seed}.jpg`;
    const outPath = join(OUT_DIR, p.dir, filename);
    if (await fileExists(outPath)) {
      skipped++;
      console.log(`[${done}/${total}] SKIP (exists) ${p.dir}/${filename}`);
      continue;
    }
    try {
      const buf = await generateOne(p.prompt, p.ar, p.raw, seed);
      await writeFile(outPath, buf);
      const kb = Math.round(buf.length/1024);
      const elapsed = Math.round((Date.now()-t0)/1000);
      console.log(`[${done}/${total}] ✓ ${p.dir}/${filename} (${kb}KB, ${elapsed}s)`);
    } catch (e) {
      failed++;
      console.error(`[${done}/${total}] ✗ ${p.dir}/${filename}: ${e.message}`);
    }
    await sleep(800);
  }
}

const min = Math.round((Date.now()-t0)/60_000);
console.log(`\n=== KLAAR ===`);
console.log(`Generated: ${done - failed - skipped}`);
console.log(`Skipped: ${skipped}`);
console.log(`Failed: ${failed}`);
console.log(`Total time: ${min} min`);
console.log(`Output: ./${OUT_DIR}/dak/ + ./${OUT_DIR}/gevel/`);
