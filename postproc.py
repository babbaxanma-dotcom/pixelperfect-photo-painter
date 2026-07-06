# -*- coding: utf-8 -*-
# Postproc v3, MINIMAL TOUCH (5 jul 2026, na "kwaliteit is een beetje slecht"):
# root-cause van zachtheid was 1K-raw -> UPSCALE naar 1600 + rotatie-resample + opgelegde ruis.
# Nu: 2K-raw -> center-crop naar AR -> DOWNSCALE naar doel (scherptewinst) -> milde unsharp -> q92.
# Geen rotatie, geen kunstmatige ruis, geen saturatie-geknijp. Realisme komt uit de scene zelf.
# python postproc.py <naam> <hero|gal>
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import uniform_filter

naam, soort = sys.argv[1], sys.argv[2]
src = f"generated-final/{naam}.jpg"
im = Image.open(src).convert('RGB')
bron_w, bron_h = im.size

doel = (1600, 900) if soort == 'hero' else (900, 900) if soort == 'steps' else (1600, 1200)
dw, dh = doel
ar_d = dw / dh
w, h = im.size
ar_s = w / h
if ar_s > ar_d:
    nw = int(h * ar_d); x = (w - nw) // 2; im = im.crop((x, 0, x + nw, h))
else:
    nh = int(w / ar_d); y = (h - nh) // 2; im = im.crop((0, y, w, y + nh))
upscale = im.size[0] < dw  # waarschuwing als de bron te klein is (raw was geen 2K)
im = im.resize(doel, Image.LANCZOS)
im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=3))
# zachte exposure-correctie zoals een telefoon (NOOIT de scene verduisteren om een getal:
# te helder -> subtiel terugtrekken; te donker -> subtiel optillen)
arr = np.asarray(im).astype(np.float32)
l0 = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
m0 = float(l0.mean())
if m0 > 165:
    arr = np.clip(arr * (160.0 / m0), 0, 255); im = Image.fromarray(arr.astype(np.uint8))
elif m0 < 100:
    arr = np.clip(arr * (115.0 / m0), 0, 255); im = Image.fromarray(arr.astype(np.uint8))
uit = f"generated-final/{naam}-cam.jpg"
im.save(uit, 'JPEG', quality=92)

# informatieve metingen + zachte poorten
a = np.asarray(Image.open(uit).convert('RGB')).astype(np.float32)
lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
def ruisvloer(l):
    sm = uniform_filter(l, 5); res = l - sm
    B = 32; hh, ww = res.shape
    stds = [res[y:y+B, x:x+B].std() for y in range(0, hh-B, B) for x in range(0, ww-B, B)]
    return float(np.percentile(stds, 10))
mx = a.max(axis=2); mn = a.min(axis=2)
sat = float(np.where(mx > 0, (mx - mn) / (mx + 1e-6), 0).mean())
checks = {
    'bron>=doel (geen upscale)': not upscale,
    'sat(<=0.50)': sat <= 0.50,
    'lum_mean(95-165)': 95 <= float(lum.mean()) <= 165,
}
ok = all(checks.values())
print(f"{'PASS' if ok else 'FAIL'} {naam}: bron={bron_w}x{bron_h} maat={dw}x{dh} q=92 noise={ruisvloer(lum):.2f} sat={sat:.3f} lum={lum.mean():.0f}")
for k, v in checks.items():
    if not v: print(f"  FAIL: {k}")
sys.exit(0 if ok else 1)
