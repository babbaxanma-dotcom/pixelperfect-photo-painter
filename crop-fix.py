# -*- coding: utf-8 -*-
# Eenmalige raw-fixes: datestamp (zwembad-g3) en auto-blob (oprit-what) wegsnijden vóór postproc
from PIL import Image

# zwembad-g3: oranje datestamp rechtsonder -> onderste 15% eraf
im = Image.open('generated-final/zwembad-g3.jpg')
w, h = im.size
im.crop((0, 0, w, int(h * 0.85))).save('generated-final/zwembad-g3.jpg', 'JPEG', quality=95)
print('zwembad-g3 raw:', w, h, '->', w, int(h * 0.85))

# oprit-what: donkere auto-massa rechtsonder -> rechtse 22% eraf
im = Image.open('generated-final/oprit-what.jpg')
w, h = im.size
im.crop((0, 0, int(w * 0.78), h)).save('generated-final/oprit-what.jpg', 'JPEG', quality=95)
print('oprit-what raw:', w, h, '->', int(w * 0.78), h)
