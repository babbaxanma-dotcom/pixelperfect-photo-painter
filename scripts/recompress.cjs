const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'src', 'assets');
const MAXW = 2200, Q = 80, MIN_BYTES = 380 * 1024;
let saved = 0, n = 0, fail = [];
const files = [];
(function walk(dir){ for(const e of fs.readdirSync(dir,{withFileTypes:true})){
  const p = path.join(dir, e.name);
  if(e.isDirectory()){ walk(p); continue; }
  if(/\.(jpe?g)$/i.test(e.name) && fs.statSync(p).size >= MIN_BYTES) files.push(p);
}})(ROOT);
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async()=>{
  for(const p of files){
    try{
      const before = fs.statSync(p).size;
      const input = fs.readFileSync(p);
      const img = sharp(input, {failOn:'none'});
      const meta = await img.metadata();
      let pipe = img.rotate();
      if(meta.width && meta.width > MAXW) pipe = pipe.resize({width:MAXW});
      const buf = await pipe.jpeg({quality:Q, mozjpeg:true}).toBuffer();
      if(buf.length < before){
        let wrote=false;
        for(let attempt=0; attempt<5 && !wrote; attempt++){
          try{ fs.writeFileSync(p, buf); wrote=true; }
          catch(e){ await sleep(300); }
        }
        if(wrote){ saved += before-buf.length; n++; console.log(`${path.relative(ROOT,p)}  ${(before/1024|0)}KB -> ${(buf.length/1024|0)}KB`); }
        else { fail.push(p); console.log(`!! kon niet schrijven: ${path.relative(ROOT,p)}`); }
      }
    }catch(e){ fail.push(p); console.log(`!! fout: ${path.relative(ROOT,p)} — ${e.message}`); }
  }
  console.log(`\n${n} files herschreven, ${(saved/1024/1024).toFixed(1)} MB bespaard. ${fail.length} mislukt.`);
})();
