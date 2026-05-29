/**
 * AB Bouw V7 image generator — Nano Banana Pro (Gemini 3) via fal.ai
 *
 * TEXT-TO-IMAGE endpoint (no refs) — Gemini 3 LLM has semantic Belgian architecture knowledge
 * built-in. Refs from V2/V3 were anchoring output to mediocre quality.
 *
 * V7 strategie:
 *  - Endpoint: fal-ai/nano-banana-pro (text-only, no /edit)
 *  - Premium real-estate-portfolio quality
 *  - Single distinctive subject (NO twin halfopen)
 *  - Beautiful clay tiles prominent for dak shots
 *  - Setting variation per prompt
 *  - Balance polished + authentic
 *
 * Run:
 *   export FAL_KEY="key:secret"
 *   node generate-nano-banana.mjs
 *
 * Test mode (3 images x 1 each = $0.18):
 *   TEST=1 node generate-nano-banana.mjs
 */
import { writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const FAL_KEY = process.env.FAL_KEY;
const TEST_MODE = process.env.TEST === '1';

if (!FAL_KEY) {
  console.error('❌ FAL_KEY env var ontbreekt');
  process.exit(1);
}

// Text-to-image endpoint (no refs)
const ENDPOINT = 'https://fal.run/fal-ai/nano-banana-pro';
const OUT_DIR = TEST_MODE ? 'generated-images-v3-test' : 'generated-images-v3';

const PROMPTS = [
  // ─── DAKWERKEN LP — focus op DAKPANNEN PROMINENT ───

  {
    dir: 'dak', name: 'lp-classic-renovatie', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a renovated narrow Belgian Flemish rijwoning in old Mechelen working-class district. SINGLE rowhouse — NOT two mirrored twins. Plot 5m wide. The facade has exactly TWO windows per floor flanking a central dark anthracite front door with brass mailbox. Warm red-brown hand-formed Vlaamse brick with cream lime mortar, natural patina. Brand-new dark anthracite Koramic Tempest clay roof tiles arranged in perfect cross-bond pattern — the dakpannen are PROMINENT in the upper third of the frame, beautifully catching the late-afternoon golden hour side-light revealing every tile's curved profile. Decorative cement bands above each window. Blue Belgian hardstone plinth. Mature climbing wisteria on adjacent neighbour wall providing single soft accent. Quiet narrow Mechelen residential street, sober paved sidewalk, no cars in foreground. Three-quarter view from across the street. Golden hour 6pm in May, warm directional light from upper-left casting clean architectural shadows. Sony A7R V with 35mm prime at f/8, ISO 100, tripod-stable, professional residential architectural photography. Belgian, NOT Dutch.`
  },

  {
    dir: 'dak', name: 'lp-crepi-nieuwbouw', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a CONTEMPORARY Belgian FREESTANDING villa in a green suburban Antwerp neighborhood, shot FRONT-FACING from the street so the entire front facade is fully visible in the frame (NOT a side angle, NOT cropped). Modern family home with smooth white kalei lime-painted brick facade. Steep dark anthracite Koramic clay pantile roof prominently visible in upper third — every tile sharp and beautiful. The HOUSE is the clear central subject, occupying the middle 60% of the frame width with both side edges of the building visible. Full-height anodized dark aluminum windows in deep reveals. Front door clearly visible. Concrete klinker driveway leading to front. Mature beech hedge boundary, lavender border, single mature multi-stem birch tree. Suburb residential street visible in foreground sidewalk. Late afternoon golden hour, warm directional sun. Sony A7R V with 35mm prime at f/8, ISO 100. Premium residential architectural photography. Front view, fully framed, classic Belgian suburban villa.`
  },

  {
    dir: 'dak', name: 'lp-oranje-solar', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a renovated SINGLE freestanding Belgian villa (NOT a halfopen twin) in a quiet Antwerp ring suburban neighborhood. Two-story classic family villa with warm orange-red hand-formed Flemish brick facade, beige lime mortar joints, natural color variation. Newly installed dark anthracite Koramic clay pantile roof with seamlessly flush-mounted black monocrystalline solar panels covering the entire south slope — solar panels integrated perfectly into the dakpannen with no visible mounting frames. Dakpannen PROMINENT in upper half of frame, clearly visible alongside the solar integration. Dark anthracite aluminum windows with deep reveal. White blue Belgian hardstone window sills. Concrete klinker driveway, low brick boundary wall, anthracite metal gate. Single mature espalier pear tree trained against the side wall. Sober Belgian villa-wijk setting. Late afternoon warm golden hour light from upper-right, dramatic but natural. Sony A7R V with 35mm prime at f/8, ISO 100, professional residential architectural photography. NOT Danish farmhouse. NOT Scandinavian.`
  },

  {
    dir: 'dak', name: 'lp-geel-nieuwbouw', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a CLASSIC Belgian family villa in a Lier villa-wijk neighborhood. SINGLE FREESTANDING villa — NOT a halfopen twin, NOT a modern cubic box, NOT avant-garde. Traditional rectangular two-story family-villa floor plan with a CLASSIC pitched zadeldak roof — proper triangular roof shape with chimney. Warm yellow-beige hand-formed Belgian brick facade laid in traditional Flemish bond, deep raked mortar joints creating beautiful shadow lines. Brand-new dark anthracite Koramic clay pantile roof PROMINENT in upper third — the dakpannen catching late afternoon golden side-light, every tile distinct, beautiful texture. Tall classic windows in dark anthracite aluminum frames with deep reveals, two windows downstairs flanking a central front door, three windows upstairs. Blue Belgian hardstone plinth. Mature beech hedge boundary, lavender border along the foundation, single multi-stem birch tree on the front lawn. Wide tree-lined villa-wijk street with neighboring Belgian villas visible. Sony A7R V with 35mm prime at f/8, ISO 100, golden hour, professional residential architectural photography. Authentic traditional Belgian family-villa character.`
  },

  {
    dir: 'dak', name: 'lp-velux', ar: '3:2',
    prompt: `Premium architectural interior photograph of an empty modern Belgian attic conversion in a renovated row house. NO people, no laptop, no coffee, no staged lifestyle props. Single distinctive Velux GGL roof window installed in the steep ceiling, flooding the empty room with natural daylight. Exposed natural oak roof beams of the original rafter structure, treated but unstained. White-painted plasterboard between the rafters. Polished light grey concrete floor. A built-in oak bookshelf along the side wall with a few hardcover architecture books — subtle, not styled. Through the Velux window: a beautiful view of dark anthracite clay roof tiles of adjacent Flemish houses against a soft blue afternoon sky. Late afternoon natural light only — warm directional sun beam streaming through the Velux. Sony A7R V with 24mm prime at f/5.6, ISO 200. Premium architectural interior photography. Belgian, not Scandinavian.`
  },

  {
    dir: 'dak', name: 'lp-vakman', ar: '3:2',
    prompt: `Premium documentary photograph of a Belgian roofer in mid-action installing brand-new dark anthracite Koramic Tempest clay roof tiles on a steep 45-degree saddle roof in Mechelen. He wears a yellow high-visibility vest over navy work trousers, white safety helmet, focused expression as he carefully aligns a tile with his gloved hand. The DAKPANNEN fill most of the right side of the frame — clearly showing the beautiful curved profile of each individual tile, cross-bond pattern visible, fresh installation precision. Stacks of unused tiles on a temporary plank in the foreground showing detail of the clay material. Layher aluminum scaffolding edge visible. Background: blurred Flemish rooftops with anthracite zinc gutters. Late morning natural light, slight overcast diffusing the sun. Sony A7R V with 35mm prime at f/5.6, ISO 200. Premium contractor portfolio photography. Authentic, focused craftsmanship.`
  },

  {
    dir: 'dak', name: 'lp-natuurleien', ar: '4:3',
    prompt: `Premium architectural close-up photograph of newly installed natural Spanish slate roof tiles (Cupa Heavy 3) in deep blue-grey on a steep Belgian roof. The slate tiles in cross-bond overlapping pattern fill the entire frame in a beautiful textural composition. Natural tonal variation from light blue-grey to dark charcoal across the slates. Each slate's hand-split edges visible. A copper VMZinc valley flashing crosses the lower third of the frame, providing material contrast. The slate surface slightly damp catching subtle reflections of the sky above. Three-quarter angle showing depth of the roof. Late afternoon raking light from the side revealing the slate texture. Sony A7R V with 90mm macro at f/8, ISO 100. Premium architectural material detail photography.`
  },

  {
    dir: 'dak', name: 'lp-plat-dak', ar: '3:2',
    prompt: `Premium elevated architectural photograph of a flat roof on a contemporary Belgian villa, freshly covered with seamless black Firestone EPDM RubberCover rubber membrane laid in one continuous piece. Brushed aluminum daktrim edge profile running clean around the perimeter. Single Velux roof skylight in the distance. Dark anthracite zinc rainwater drainage outlet detail in the foreground. Beyond the roof: panoramic view across rooftops of a sober Belgian villa-wijk suburb showing other contemporary villas, mature trees, soft late-afternoon sky with subtle cloud detail. The EPDM surface slightly wet from rain earlier, reflecting sky. Three-quarter elevated viewpoint. Late afternoon natural light, warm directional sun. Sony A7R V with 24mm prime at f/8, ISO 100. Premium architectural roof inspection photography.`
  },

  {
    dir: 'dak', name: 'lp-zink-goot', ar: '4:3',
    prompt: `Premium architectural detail photograph of a newly soldered VMZinc Quartz-Zinc anthracite rainwater gutter mounted against a warm red-brown hand-formed Flemish brick wall. Perfect solder joint clearly visible on the zinc edge. A custom-bent copper rainwater downpipe transitioning from the gutter with elegant angle. Single droplet of water on the bottom edge of the zinc catching the light. The brick mortar joints irregular handvorm with cream-colored lime mortar showing patina. Late afternoon raking light from the side reveals the zinc surface character and the brick texture variation. Sony A7R V with 90mm macro at f/5.6, ISO 100. Premium architectural craftsmanship detail photography.`
  },

  // Anatomy illustrations (kept text-to-image, no refs needed)
  {
    dir: 'dak', name: 'lp-anatomy-illustration', ar: '16:9',
    prompt: `Clean architectural cross-section technical illustration of a steep Belgian Flemish clay-tile roof construction. Layered materials shown stacked from top to bottom: dark anthracite Koramic clay roof tiles on top, wooden battens and counterbattens, breathable Delta underlayment membrane, 22cm thick PIR rigid insulation board between rafters, wooden rafter structural beams, vapor barrier film, white-painted plasterboard ceiling at bottom. Each layer labeled in Dutch with thin grey arrows pointing to it. Isometric 30-degree angle view. Soft off-white background. Subtle drop shadows below each layer indicating depth. Clean architectural diagram style with technical drawing precision. NOT photoreal.`
  },

  {
    dir: 'dak', name: 'lp-3d-exploded', ar: '16:9',
    prompt: `Exploded isometric 3D architectural rendering of a Belgian pitched roof construction. Six floating material layers in clear sequence with 30cm vertical gap between each: dark anthracite Koramic clay roof tiles at the top, wooden battens, breathable underlayment, thick rigid PIR insulation panels, wooden rafter beams, vapor barrier at bottom. Each layer hovers above the next in front of a soft off-white studio background. Subtle drop shadows below each layer indicating depth. Clean photoreal architectural visualization with isometric perspective. No text labels visible. Architectural render quality.`
  },

  {
    dir: 'dak', name: 'lp-comfort-illustration', ar: '3:2',
    prompt: `Premium architectural close-up photograph of a beautifully completed Belgian pannendak — the camera angled looking up at a freshly installed dark anthracite Koramic clay tile roof from the eaves looking up the slope. Every single tile in perfect cross-bond pattern, hand-crafted finish, beautiful curved profile of each pan visible. Pristine VMZinc anthracite zinc gutter running along the bottom edge of the frame. A small portion of warm red-brown brick wall visible at the lower edge for material context. Late afternoon golden hour light raking across the tiles from the side, revealing every detail of the finish. Soft blue Belgian sky visible at the very top of the frame. Sony A7R V with 50mm prime at f/8, ISO 100. Premium architectural craftsmanship-detail photography. Subject: completed dakpannen finish, the visible result of professional dakwerk.`
  },

  // ─── GEVEL LP ───

  {
    dir: 'gevel', name: 'witte-crepi', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a contemporary Belgian FREESTANDING villa in a Mechelen villa-wijk neighborhood. SINGLE freestanding house — NOT a halfopen twin, NOT mirrored. Modern family villa with smooth white Sto Lotusan siliconencrepi facade freshly applied. Dark anthracite RAL 7016 Reynaers aluminum windows with deep reveal. Blue Belgian hardstone window sills. Brand-new dark anthracite Koramic clay pantile roof prominently visible in upper third of frame catching the warm light. Beautiful Belgian front garden: a single mature multi-stem birch tree, low boxwood spheres flanking the front entrance, narrow gravel pad along the facade. Neighbour villa visible at right edge for context. Late afternoon golden hour, 6pm in May, warm directional sun from the upper-left creating beautiful shadows that reveal the crepi micro-texture. Sony A7R V with 35mm prime at f/8, ISO 100. Premium residential architectural photography. NOT Mediterranean, NOT Greek.`
  },

  {
    dir: 'gevel', name: 'grijze-crepi', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a contemporary Belgian FREESTANDING villa in a Lier villa-wijk neighborhood. SINGLE freestanding house — NOT a halfopen twin. Modern family villa with smooth WARM LIGHT GREY Sto Lotusan siliconencrepi facade in RAL 7044 (the GREY crepi is the photo's clear subject — visibly grey, not white). Traditional pitched zadeldak roof with red-brown Vlaamse clay pantiles prominently visible in upper third. Dark anthracite RAL 7016 aluminum windows with deep reveal. Blue Belgian hardstone window sills. Low brick boundary wall with anthracite metal fence, lavender border along the wall. Single mature plane tree at corner of plot. Quiet villa-wijk residential street with neighbouring villas visible. Late afternoon golden hour, warm directional sun from upper-right. Sony A7R V with 35mm prime at f/8, ISO 100. Premium residential architectural photography. The GREY color is clearly visible.`
  },

  {
    dir: 'gevel', name: 'steenstrips', ar: '16:9',
    prompt: `Premium architectural photograph of a modern garden extension on a Belgian FREESTANDING villa (NOT a twin halfopen). The extension is clad in beautiful dark anthracite Vandersanden Black Diamond hand-formed brick slips (steenstrips) — each slip clearly visible showing its natural color variation and rough hand-formed texture. The extension extends from the white plastered original main house, creating elegant material contrast. Large dark aluminum Reynaers sliding doors face onto a wooden terrace deck of weathered composite planks. A single weathered teak garden chair and a coiled garden hose add subtle living detail. Mature climbing wisteria growing on the side wall of the main house adds soft natural accent. Sober Belgian backyard with mature beech hedge boundary. Late afternoon golden hour, warm directional sun from upper-left revealing the brick slip texture. Sony A7R V with 35mm prime at f/8, ISO 100. Premium residential architectural photography.`
  },

  {
    dir: 'gevel', name: 'sierpleister', ar: '16:9',
    prompt: `Premium real-estate-portfolio photograph of a contemporary Belgian villa in a Bruges suburb with strong horizontal contrast between two volumes. The upper volume finished in beautiful hand-applied white textured lime sierpleister (Knauf marmorino) showing visible brush-stroke texture. The lower volume clad in anthracite Eternit Equitone fiber-cement cladding panels with clean vertical joints. SINGLE freestanding villa — NOT a halfopen twin. Hidden flat roof behind composite trim cap. Tall dark aluminum windows in deep reveal. Modern Belgian landscaping: a single multi-stem mature birch tree in a corten steel planter, low boxwood spheres along the foundation, gravel pad. Quiet Belgian suburban context. Late afternoon golden hour, warm directional sun from upper-left. Sony A7R V with 35mm prime at f/8, ISO 100. Premium residential architectural photography. NOT Mediterranean, NOT California.`
  },

  {
    dir: 'gevel', name: 'stelling', ar: '3:2',
    prompt: `Premium documentary photograph of a Belgian terraced row house in Mechelen city center mid-project with full-facade aluminum scaffolding installed. ABSOLUTELY NO visible brand names, NO signs, NO logos, NO text on the scaffolding or anywhere in the frame — pure clean scaffolding without any "Premio", "Layher", or other contractor brand markings. Exterior insulation panels (ETICS) clearly being installed at the upper level. Two Belgian construction workers in plain yellow high-vis vests (no logos) over navy work trousers carefully carrying a large insulation board. Cardboard packaging from insulation materials stacked neatly on the sidewalk (plain boxes, no brand text). Materials and tools in the foreground. Pale grey overcast Belgian afternoon sky. Three-quarter side angle from across the street. Sony A7R V with 24mm prime at f/8, ISO 200. Premium contractor portfolio documentation photography. Clean of any third-party branding.`
  },

  {
    dir: 'gevel', name: 'intro', ar: '16:9',
    prompt: `Premium architectural streetscape photograph of a sunny Belgian villa-wijk neighborhood in suburban Mechelen on a clear afternoon. The frame shows three FREESTANDING (NOT halfopen twins) Belgian family villas along a wide tree-lined residential street. Middle villa freshly renovated with smooth white Sto Lotusan crepi facade — clearly the photo's subject. Left villa: warm red-brown hand-formed Vlaamse brick. Right villa: light beige Belgian brick. All three with proper Belgian residential character — pitched zadeldak roofs with clay tiles, anthracite aluminum windows, blue hardstone plinths, small front gardens with hedges and lawns. Wide residential street with mature linden trees lining both sides. Clear bright sky with subtle clouds (NOT foggy, NOT depressing). Three-quarter angle down the street. Late afternoon golden hour. Sony A7R V with 24mm prime at f/8, ISO 100. Premium residential streetscape photography. Authentic Belgian villa-wijk character.`
  },

  // Anatomy gevel (text-only)
  {
    dir: 'gevel', name: 'lp-anatomy-cross', ar: '16:9',
    prompt: `Clean architectural cross-section technical illustration of a Belgian ETICS exterior wall insulation system. Six distinct layers from outside to inside: smooth white Sto Lotusan siliconencrepi outer finish, glasvezel reinforcement mesh in wapeningsmortel, cement basecoat, 14cm rigid EPS insulation board, adhesive lijmlaag, original red baksteen brick wall. Each layer labeled in Dutch with thin grey arrows and metric measurements. Isometric 30-degree angle view. Soft off-white background. Subtle drop shadows. Clean architectural diagram style with technical drawing precision. NOT photoreal.`
  },

  {
    dir: 'gevel', name: 'lp-anatomy-l1', ar: '1:1',
    prompt: `Isolated architectural visualization of a weathered warm red-brown hand-formed Flemish brick wall section floating against a soft off-white studio background. Photoreal brick texture with irregular handvorm mortar joints showing cream lime mortar. Subtle color variation between individual bricks. Single layer in isolation at 30-degree isometric angle with soft drop shadow indicating thickness. Clean technical illustration style. No surrounding context. No text labels.`
  },

  {
    dir: 'gevel', name: 'lp-anatomy-l2', ar: '1:1',
    prompt: `Isolated architectural visualization of a 14cm thick rigid EPS foam insulation board with even adhesive pattern on the back side. Photoreal white-grey EPS texture with sharp clean cut edges. Single layer floating against soft off-white studio background at 30-degree isometric angle with soft drop shadow. Clean technical illustration style. No surrounding context. No text labels.`
  },

  {
    dir: 'gevel', name: 'lp-anatomy-l3', ar: '1:1',
    prompt: `Isolated architectural visualization of fiberglass reinforcement mesh embedded in grey-beige cement base coat layer (wapeningsmortel). Fine fiberglass net pattern visible through wet mortar surface. Photoreal material texture. Single layer floating against off-white studio background at 30-degree isometric angle with soft drop shadow. Clean technical illustration. No text labels.`
  },

  {
    dir: 'gevel', name: 'lp-anatomy-l4', ar: '1:1',
    prompt: `Isolated architectural visualization of off-white siloxane primer coat smoothly applied over cement base coat. Subtle sheen suggesting fresh application. Photoreal smooth texture. Single layer floating against soft off-white studio background at 30-degree isometric angle with soft drop shadow. Clean technical illustration style. No text labels.`
  },

  {
    dir: 'gevel', name: 'lp-anatomy-l5', ar: '1:1',
    prompt: `Isolated architectural visualization of a finished smooth white textured silicone plaster facade finish (Sto Lotusan) in soft warm off-white RAL 9010. Fine spatula-applied surface texture visible. Photoreal surface variation. Single layer floating against soft off-white studio background at 30-degree isometric angle with soft drop shadow. Clean technical illustration style. No text labels.`
  },

  // ─── CALCULATOR DAK — 6 NEW photos ───

  {
    dir: 'dak', name: 'hellend-pannen', ar: '4:3',
    prompt: `Premium architectural photograph of a Belgian hellend dak (sloped roof) covered in newly installed dark anthracite Koramic clay pantiles. The roof fills most of the frame at a slight angle showing the depth of the slope. Each individual tile clearly visible in beautiful cross-bond pattern, the curved profile of every pan distinct. The roof of a single classic Belgian family villa, captured from across the street looking up at the steep slope. A brick chimney visible in the upper-right adding character. Late afternoon golden hour light raking across the tiles, revealing each pan's individual character. Sony A7R V with 50mm prime at f/8, ISO 100. Premium architectural roofing photography.`
  },

  {
    dir: 'dak', name: 'lp-hero-pannendak', ar: '4:3',
    prompt: `Premium architectural detail photograph of a freshly installed pannendak (clay tile roof) on a Belgian house. The dakpannen are the absolute focus — dark anthracite Koramic Tempest clay tiles arranged in perfect cross-bond pattern, every single tile showing its beautiful curved profile, natural color variation from firing, fresh installation precision. The frame captures the roof at a three-quarter angle showing both the roof plane and a small portion of the ridge cap. Soft natural daylight. Sony A7R V with 90mm at f/8, ISO 100. Premium roofing portfolio detail photography. Subject: anthracite clay pantiles.`
  },

  {
    dir: 'dak', name: 'plat-epdm', ar: '4:3',
    prompt: `Premium architectural detail photograph of a freshly laid Firestone EPDM RubberCover flat roof membrane on a contemporary Belgian villa. Seamless black rubber surface stretches across the frame in one continuous piece, no visible seams. Clean brushed aluminum daktrim edge profile along the perimeter at the bottom of the frame. The EPDM surface slightly wet from light morning rain, beautifully reflecting the soft overcast sky. Subtle texture of the rubber visible. Three-quarter elevated angle. Soft natural daylight. Sony A7R V with 35mm prime at f/8, ISO 100. Premium architectural flat roof detail photography. Subject: EPDM rubber.`
  },

  {
    dir: 'dak', name: 'bitumen', ar: '4:3',
    prompt: `Premium architectural detail photograph of a freshly installed bitumen roofing membrane (APP-bitumen, 2-layer system with grey slate-chip finish) on a Belgian flat roof. The dark grey bitumen surface with subtle slate-chip texture fills most of the frame. Clean overlap seam visible where two membrane sheets join, heat-welded perfectly. The bitumen surface catching soft directional light revealing its texture. Single rolled-edge detail at the perimeter. Sony A7R V with 50mm at f/8, ISO 100. Premium architectural flat roof bitumen detail photography. Subject: bitumen roofing.`
  },

  {
    dir: 'dak', name: 'lp-pir-isolatie', ar: '4:3',
    prompt: `Premium architectural detail photograph of newly installed PIR rigid foam insulation boards between wooden rafters on a Belgian sloped roof during renovation. The yellowish-cream PIR boards (Recticel or Unilin style) with foil facing fill the frame at a slight angle, fitted precisely between dark wooden rafter beams. Sharp cut edges showing 22cm thickness. A small portion of breathable underlayment membrane visible at the top of the frame. Soft natural daylight from above through the open roof structure. Sony A7R V with 35mm prime at f/5.6, ISO 200. Premium architectural insulation detail photography. Subject: PIR insulation installation.`
  },

  {
    dir: 'dak', name: 'lp-stormschade', ar: '4:3',
    prompt: `Photograph of an old, weathered Belgian house roof from the 1970s-era showing clear signs of age and wear. The original clay tile roof has visibly faded color, slight moss growing along the bottom edge near the gutter, and some tiles look weathered with patina from decades of weather. The roof clearly needs renovation. A weathered zinc rainwater gutter showing dark patina runs along the eaves. The brick wall below the roof also shows age. NO storm damage, NO missing tiles, NO blue tarp — just an OLD intact roof that has aged naturally over decades. Three-quarter view from below looking up at the roof. Soft natural overcast daylight. Sony A7R V with 50mm prime at f/8, ISO 200. Premium documentary photograph of an aged Belgian roof needing renovation.`
  },
];

// ─── Helpers ───

async function fileExists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function generateOne({ prompt, ar }) {
  const body = {
    prompt,
    num_images: 1,
    aspect_ratio: ar,
    output_format: 'jpeg',
  };

  const post = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!post.ok) {
    const text = await post.text();
    throw new Error(`POST ${post.status}: ${text.slice(0, 300)}`);
  }

  const data = await post.json();
  const imgUrl = data.images?.[0]?.url || data.image?.url;
  if (!imgUrl) throw new Error(`No image URL: ${JSON.stringify(data).slice(0, 300)}`);

  const dl = await fetch(imgUrl);
  if (!dl.ok) throw new Error(`Download failed: ${dl.status}`);
  return Buffer.from(await dl.arrayBuffer());
}

// ─── Main ───

await mkdir(join(OUT_DIR, 'dak'), { recursive: true });
await mkdir(join(OUT_DIR, 'gevel'), { recursive: true });

const ACTIVE = TEST_MODE
  ? PROMPTS.filter(p => ['lp-classic-renovatie', 'lp-crepi-nieuwbouw', 'witte-crepi'].includes(p.name))
  : PROMPTS;

console.log(`Mode: ${TEST_MODE ? `TEST (${ACTIVE.length} images)` : `FULL (${ACTIVE.length} images)`}`);
console.log(`Output: ./${OUT_DIR}/\n`);

let done = 0, failed = 0, skipped = 0;
const t0 = Date.now();

for (const p of ACTIVE) {
  done++;
  const filename = `${p.name}.jpg`;
  const outPath = join(OUT_DIR, p.dir, filename);
  if (await fileExists(outPath)) {
    skipped++;
    console.log(`[${done}/${ACTIVE.length}] SKIP exists: ${p.dir}/${filename}`);
    continue;
  }
  try {
    const buf = await generateOne(p);
    await writeFile(outPath, buf);
    const kb = Math.round(buf.length / 1024);
    const elapsed = Math.round((Date.now() - t0) / 1000);
    console.log(`[${done}/${ACTIVE.length}] ✓ ${p.dir}/${filename} (${kb}KB, ${elapsed}s)`);
  } catch (e) {
    failed++;
    console.error(`[${done}/${ACTIVE.length}] ✗ ${p.dir}/${filename}: ${e.message}`);
  }
  await sleep(800);
}

const min = Math.round((Date.now() - t0) / 60_000);
console.log(`\n=== DONE ===`);
console.log(`Generated: ${done - failed - skipped} · Skipped: ${skipped} · Failed: ${failed}`);
console.log(`Time: ${min} min`);
console.log(`Output: ./${OUT_DIR}/`);
