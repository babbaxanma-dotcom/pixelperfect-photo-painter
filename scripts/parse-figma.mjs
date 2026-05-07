#!/usr/bin/env node
/**
 * Figma file parser — dumps EVERYTHING.
 *
 * Usage:
 *   FIGMA_TOKEN=figd_xxx node scripts/parse-figma.mjs \
 *     --file on6JCzBIeUrvZarFM3meRR \
 *     --node 7:365 \
 *     --out ./figma-dump
 *
 * Defaults to the Roofing file / node from the URL provided.
 *
 * Output (in --out dir):
 *   raw.json              full /v1/files/:key/nodes response
 *   tree.json             flattened node list (id, name, type, depth, parent, geometry, style refs, text)
 *   tree.txt              human readable indented outline
 *   styles.json           file-level styles + components
 *   images/               every IMAGE fill + every node exported as PNG/SVG
 *   images-index.json     map of nodeId -> downloaded asset paths
 *   text.json             every text node with content + style
 *   summary.json          counts per type, totals, etc.
 *
 * No deps — pure Node 18+ (uses global fetch).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

// ── args ────────────────────────────────────────────────────────────
const argv = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith('--')) acc.push([cur.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);
const FILE_KEY = argv.file || 'on6JCzBIeUrvZarFM3meRR';
const NODE_ID = (argv.node || '7:365').replace('-', ':');
const OUT_DIR = argv.out || './figma-dump';
const TOKEN = process.env.FIGMA_TOKEN || argv.token;
if (!TOKEN) {
  console.error('Missing FIGMA_TOKEN env var (or --token).');
  process.exit(1);
}

const HEADERS = { 'X-Figma-Token': TOKEN };
const API = 'https://api.figma.com/v1';

await fs.mkdir(path.join(OUT_DIR, 'images'), { recursive: true });

// ── helpers ─────────────────────────────────────────────────────────
async function api(url) {
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${url}\n${await r.text()}`);
  return r.json();
}
async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) { console.warn('  ! download failed', r.status, url); return false; }
  const buf = Buffer.from(await r.arrayBuffer());
  await fs.writeFile(dest, buf);
  return true;
}
const safe = (s) => String(s).replace(/[^a-z0-9._-]+/gi, '_').slice(0, 80);
const writeJson = (p, o) => fs.writeFile(path.join(OUT_DIR, p), JSON.stringify(o, null, 2));

// ── 1. fetch node subtree ───────────────────────────────────────────
console.log(`▶ fetching file ${FILE_KEY} node ${NODE_ID} ...`);
const raw = await api(`${API}/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(NODE_ID)}&geometry=paths`);
await writeJson('raw.json', raw);

const root = raw.nodes[NODE_ID];
if (!root) throw new Error(`Node ${NODE_ID} not found in response`);
console.log(`  ✓ root: ${root.document.name} (${root.document.type})`);

// styles + components meta from this response
await writeJson('styles.json', {
  styles: root.styles || {},
  components: root.components || {},
  componentSets: root.componentSets || {},
});

// ── 2. walk tree ────────────────────────────────────────────────────
const flat = [];
const textNodes = [];
const imageFillNodes = [];   // nodes with IMAGE paint
const exportableNodes = [];  // nodes worth exporting as PNG (frames, components, instances, vectors)
const counts = {};

function visit(node, depth, parentId) {
  counts[node.type] = (counts[node.type] || 0) + 1;
  const entry = {
    id: node.id,
    name: node.name,
    type: node.type,
    depth,
    parentId,
    visible: node.visible !== false,
    locked: node.locked || false,
    absoluteBoundingBox: node.absoluteBoundingBox || null,
    constraints: node.constraints || null,
    layoutMode: node.layoutMode || null,
    layoutAlign: node.layoutAlign || null,
    layoutGrow: node.layoutGrow ?? null,
    primaryAxisAlignItems: node.primaryAxisAlignItems || null,
    counterAxisAlignItems: node.counterAxisAlignItems || null,
    itemSpacing: node.itemSpacing ?? null,
    paddingLeft: node.paddingLeft ?? null,
    paddingRight: node.paddingRight ?? null,
    paddingTop: node.paddingTop ?? null,
    paddingBottom: node.paddingBottom ?? null,
    cornerRadius: node.cornerRadius ?? null,
    rectangleCornerRadii: node.rectangleCornerRadii || null,
    fills: node.fills || null,
    strokes: node.strokes || null,
    strokeWeight: node.strokeWeight ?? null,
    effects: node.effects || null,
    opacity: node.opacity ?? null,
    blendMode: node.blendMode || null,
    styles: node.styles || null,
    componentId: node.componentId || null,
    componentProperties: node.componentProperties || null,
    characters: node.characters || null,
    style: node.style || null,
    childIds: (node.children || []).map((c) => c.id),
  };
  flat.push(entry);

  if (node.type === 'TEXT') {
    textNodes.push({
      id: node.id, name: node.name,
      characters: node.characters,
      style: node.style,
      characterStyleOverrides: node.characterStyleOverrides,
      styleOverrideTable: node.styleOverrideTable,
      fills: node.fills,
    });
  }
  if (Array.isArray(node.fills) && node.fills.some((f) => f.type === 'IMAGE')) {
    imageFillNodes.push({
      id: node.id, name: node.name,
      imageRefs: node.fills.filter((f) => f.type === 'IMAGE').map((f) => f.imageRef),
    });
  }
  if (['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'GROUP', 'VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'ELLIPSE', 'REGULAR_POLYGON', 'RECTANGLE'].includes(node.type)) {
    exportableNodes.push({ id: node.id, name: node.name, type: node.type, depth });
  }

  for (const child of node.children || []) visit(child, depth + 1, node.id);
}
visit(root.document, 0, null);

await writeJson('tree.json', flat);
await writeJson('text.json', textNodes);

// human outline
const outline = flat.map((n) =>
  `${'  '.repeat(n.depth)}- [${n.type}] ${n.name}  (${n.id})` +
  (n.characters ? `  "${n.characters.replace(/\s+/g, ' ').slice(0, 80)}"` : '')
).join('\n');
await fs.writeFile(path.join(OUT_DIR, 'tree.txt'), outline);

console.log(`  ✓ ${flat.length} nodes (${Object.entries(counts).map(([k,v])=>k+':'+v).join(', ')})`);
console.log(`  ✓ ${textNodes.length} text nodes`);
console.log(`  ✓ ${imageFillNodes.length} nodes with image fills`);
console.log(`  ✓ ${exportableNodes.length} exportable nodes`);

// ── 3. resolve image fills (imageRef -> CDN URL) ────────────────────
const indexMap = {};
console.log('▶ fetching imageRef → URL map ...');
const imgFillResp = await api(`${API}/files/${FILE_KEY}/images`);
const imageRefMap = imgFillResp.meta?.images || {};

for (const n of imageFillNodes) {
  for (const ref of n.imageRefs) {
    const url = imageRefMap[ref];
    if (!url) continue;
    const ext = (url.split('?')[0].match(/\.(png|jpe?g|gif|webp|svg)$/i) || [, 'png'])[1];
    const dest = `images/fill_${safe(n.id)}_${ref.slice(0, 8)}.${ext}`;
    process.stdout.write(`  · fill ${n.id} ${ref.slice(0,8)} ... `);
    const ok = await download(url, path.join(OUT_DIR, dest));
    console.log(ok ? '✓' : 'fail');
    indexMap[n.id] = indexMap[n.id] || {};
    indexMap[n.id].fills = indexMap[n.id].fills || [];
    if (ok) indexMap[n.id].fills.push(dest);
  }
}

// ── 4. render exportable nodes as PNG (batched) ─────────────────────
console.log(`▶ rendering ${exportableNodes.length} nodes as PNG (batches of 50) ...`);
const BATCH = 50;
for (let i = 0; i < exportableNodes.length; i += BATCH) {
  const batch = exportableNodes.slice(i, i + BATCH);
  const ids = batch.map((n) => n.id).join(',');
  try {
    const res = await api(`${API}/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=png&scale=2`);
    const map = res.images || {};
    for (const n of batch) {
      const url = map[n.id];
      if (!url) continue;
      const dest = `images/node_${safe(n.id)}_${safe(n.name)}.png`;
      const ok = await download(url, path.join(OUT_DIR, dest));
      indexMap[n.id] = indexMap[n.id] || {};
      if (ok) indexMap[n.id].render = dest;
    }
    console.log(`  ✓ batch ${i / BATCH + 1} (${batch.length} nodes)`);
  } catch (e) {
    console.warn(`  ! batch ${i / BATCH + 1} failed: ${e.message}`);
  }
}

await writeJson('images-index.json', indexMap);

// ── 5. summary ──────────────────────────────────────────────────────
const summary = {
  fileKey: FILE_KEY,
  rootNodeId: NODE_ID,
  rootName: root.document.name,
  totalNodes: flat.length,
  countsByType: counts,
  textNodes: textNodes.length,
  imageFillNodes: imageFillNodes.length,
  renderedNodes: Object.values(indexMap).filter((v) => v.render).length,
  downloadedFills: Object.values(indexMap).reduce((a, v) => a + (v.fills?.length || 0), 0),
};
await writeJson('summary.json', summary);

console.log('\n✓ done. summary:');
console.log(JSON.stringify(summary, null, 2));
console.log(`\nOutput in: ${path.resolve(OUT_DIR)}`);
