/* Gedeelde RPC-laag voor adstransparency.google.com: vaste pauze per call,
   harde stop bij 429 (geen herhaalpogingen die de captcha verlengen). */
const KOPPEN = {
  'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
  origin: 'https://adstransparency.google.com',
  referer: 'https://adstransparency.google.com/?region=BE',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
};
const PAUZE = Number(process.env.PAUZE || 3000);
const wacht = (ms) => new Promise((k) => setTimeout(k, ms));
let teller = 0;
class Stop429 extends Error {}
async function rpc(naam, payload) {
  teller++;
  const r = await fetch(`https://adstransparency.google.com/anji/_/rpc/${naam}?authuser=`, {
    method: 'POST', headers: KOPPEN,
    body: 'f.req=' + encodeURIComponent(JSON.stringify(payload)),
    signal: AbortSignal.timeout(30000),
  });
  await wacht(PAUZE);
  if (r.status === 429) throw new Stop429(`429 na call ${teller} (${naam})`);
  if (!r.ok) throw new Error(`${naam} status ${r.status}`);
  const t = await r.text();
  if (/captcha|<html/i.test(t.slice(0, 300))) throw new Stop429(`captcha na call ${teller}`);
  return JSON.parse(t);
}
module.exports = { rpc, wacht, Stop429, teller: () => teller };
