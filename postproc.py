# -*- coding: utf-8 -*-
# Camera-izer + validator: python postproc.py <naam> <hero|gal>
# 1) generated-final/<naam>.jpg -> lichte rotatie (per-naam seed), crop, resize naar camera-plausibele maat
# 2) sensor-ruis + variabele JPEG-kwaliteit (per foto anders)
# 3) valideert tegen refstats.json (echte-foto-envelop); print PASS/FAIL + metrics
import sys, json, hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import uniform_filter

naam, soort = sys.argv[1], sys.argv[2]
src = f"generated-final/{naam}.jpg"
rng = np.random.default_rng(int(hashlib.md5(naam.encode()).hexdigest()[:8], 16))

im = Image.open(src).convert('RGB')
# 1) subtiele handheld-rotatie + crop (per foto uniek)
hoek = float(rng.uniform(0.3, 1.4)) * (1 if rng.random() < 0.5 else -1)
im = im.rotate(hoek, resample=Image.BICUBIC, expand=False)
w, h = im.size
m = int(min(w, h) * 0.035)  # snij rotatieranden weg
im = im.crop((m, m, w - m, h - m))
# 2) camera-plausibele doelmaat (nooit x32-canvas)
doel = (1600, 900) if soort == 'hero' else (1600, 1200)
dw, dh = doel
ar_d = dw / dh; w, h = im.size; ar_s = w / h
if ar_s > ar_d:
    nw = int(h * ar_d); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
else:
    nh = int(w / ar_d); y = (h - nh) // 2; im = im.crop((0, y, w, y + nh))
im = im.resize(doel, Image.LANCZOS)
# 3) sensor-ruis richting echte-foto-niveau (luminantie + lichte chroma), per foto andere sterkte
arr = np.asarray(im).astype(np.float32)
n_l = float(rng.uniform(2.2, 4.2))
arr += rng.normal(0, n_l, arr.shape[:2])[:, :, None]
arr += rng.normal(0, n_l * 0.35, arr.shape)
arr = np.clip(arr, 0, 255)
im = Image.fromarray(arr.astype(np.uint8))
q = int(rng.integers(78, 89))
uit = f"generated-final/{naam}-cam.jpg"
im.save(uit, 'JPEG', quality=q)

# 4) valideer tegen echte-envelop
ref = json.load(open('refstats.json'))
a = np.asarray(Image.open(uit).convert('RGB')).astype(np.float32)
lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
top = lum[:a.shape[0] // 4]
sm = uniform_filter(lum, 5); res = lum - sm
flat = np.abs(np.gradient(sm)[0]) + np.abs(np.gradient(sm)[1]) < 1.0
noise = float(res[flat].std()) if flat.sum() > 1000 else float(res.std())
mx = a.max(axis=2); mn = a.min(axis=2)
sat = float(np.where(mx > 0, (mx - mn) / (mx + 1e-6), 0).mean())
top99 = float(np.percentile(top, 99))
checks = {
    'noise(2.0-7.0)': 2.0 <= noise <= 7.0,
    'sat(<=0.45)': sat <= 0.45,
    'lum_mean(95-155)': 95 <= float(lum.mean()) <= 155,
}
ok = all(checks.values())
print(f"{'PASS' if ok else 'FAIL'} {naam}: rot={hoek:+.1f} q={q} maat={doel[0]}x{doel[1]} noise={noise:.2f} sat={sat:.3f} top99={top99:.0f} lum={lum.mean():.0f}")
for k, v in checks.items():
    if not v: print(f"  FAIL: {k}")
sys.exit(0 if ok else 1)
