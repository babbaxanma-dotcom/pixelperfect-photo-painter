# -*- coding: utf-8 -*-
# Textuur-bewuste degrainer v2: blur doodt korrel, echte randen (die blur overleven)
# behouden hun origineel. python degrain.py <naam> [<naam>...]
import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, uniform_filter

def smoothstep(t0, t1, x):
    t = np.clip((x - t0) / (t1 - t0), 0, 1)
    return t * t * (3 - 2 * t)

for naam in sys.argv[1:]:
    pad = f'generated-final/{naam}.jpg'
    a = np.asarray(Image.open(pad).convert('RGB')).astype(np.float32)
    lum = 0.299 * a[:, :, 0] + 0.587 * a[:, :, 1] + 0.114 * a[:, :, 2]
    # randkaart op zwaar-geblurd beeld: korrel is daar weg, echte randen blijven
    glad = gaussian_filter(lum, 2.2)
    gy, gx = np.gradient(glad)
    rand = gaussian_filter(np.hypot(gx, gy), 1.5)
    e = smoothstep(1.5, 6.0, rand)[:, :, None]          # 0=vlak, 1=echte rand
    base = np.stack([gaussian_filter(a[:, :, c], 1.6) for c in range(3)], axis=2)
    uit = np.clip(base * (1 - e) + a * e, 0, 255)
    Image.fromarray(uit.astype(np.uint8)).save(pad, 'JPEG', quality=95)
    lum2 = 0.299 * uit[:, :, 0] + 0.587 * uit[:, :, 1] + 0.114 * uit[:, :, 2]
    sm = uniform_filter(lum2.astype(np.float32), 5); r2 = lum2 - sm
    B = 32; h, wdt = r2.shape
    stds = [r2[y:y+B, x:x+B].std() for y in range(0, h-B, B) for x in range(0, wdt-B, B)]
    print(f'{naam}: vloer na degrain = {float(np.percentile(stds, 10)):.2f}')
