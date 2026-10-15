"""Crop the house watermark out of the source photos and export AVIF + WebP sizes.

Source photos (assets-src/) come from @sainttropezconfeitaria on Instagram and carry
the house badge in the top-left corner; the crop removes that band. Run from the
project root: python tools/images.py
"""
import json
import os
from PIL import Image, ImageOps

SRC = 'assets-src'
OUT = 'public/img'
WIDTHS = (640, 1080, 1600)

# name: (left, top, right, bottom) crop in source pixels; None keeps the full frame.
BADGE = (0, 190, None, None)
SHOT = (0, 115, None, None)
CROPS = {
    'fachada-letreiro': None,
    'fachada-relevo': None,
    'fachada-noite': None,
    'salao-arcos': (0, 0, 905, None),          # keeps the customer at the right out of frame
    'salao-palmeiras': BADGE,
    'salao-panorama': None,
    'carrinho-bolos': BADGE,
    'triciclo': BADGE,
    'vitrine-folhados': BADGE,
    'vitrine-paes': BADGE,
    'croissants': BADGE,
    'croissants-vitrine': BADGE,
    'bolo-camadas-frutas': BADGE,
    'bolo-frutas-vermelhas': BADGE,
    'torta-chocolate': BADGE,
    'doces-caramelizados': BADGE,
    'doces-finos': (0, 205, None, None),       # printed menu-card header at the top
    'taca-frutas': BADGE,
    'salgado-tomate': BADGE,
    'tortinhas-coloridas': BADGE,
    'tortinhas-cremosas': BADGE,
    'sanduiche-ciabatta': BADGE,
    'sanduiche-quente': (0, 190, 1100, 1060),  # handle sticker at the bottom right
    'prato-peixe': BADGE,
    'prato-salmao': BADGE,
    'pratos-saladas': BADGE,
    'salada-salmao': BADGE,
    # Screenshots of the house's Instagram sent by the user on 2026-10-14 (~850 px):
    # the badge band is 115 px tall at that size.
    'folhado-creme': None,                     # no badge in this one
    'doce-urso': SHOT,
    'fatia-bolo-chocolate': SHOT,
    'paes-dourados': SHOT,
    'prato-carne': SHOT,
    'salmao-cogumelos': SHOT,
    'bebida-morango': SHOT,
    'croissants-acucar': SHOT,
    'folhados-coracao': SHOT,
    'sanduiche-salmao': SHOT,
    'salao-vidro': SHOT,
    'salao-palmeira': SHOT,
    'quiche-tomate': SHOT,
    'torrada-presunto': SHOT,
    'cafe-espuma': SHOT,
    'crepe-gratinado': SHOT,
    'fachada-inteira': SHOT,
    'coxinhas': SHOT,
    'balcao-vitrine': SHOT,
    'pizza-presunto': SHOT,
    'adega-maquinas': SHOT,
    # More screenshots sent by the user on 2026-10-14 (second batch, ~850 px).
    'ilha-de-frios': SHOT,
    'adega-parede': SHOT,
    'adega-garrafas': SHOT,
    'pratos-balcao': (285, 0, None, None),     # the badge only covers the top-left: cut the left strip, keep the heads
    'fachada-noite-letreiro': (0, 110, None, None),
    'balcao-paes': (0, 0, 815, None),          # no badge; drops the carousel arrow at the right edge
}


def main(only=()):
    """Exports every photo, or only the names given on the command line (the manifest is merged)."""
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    if only:
        with open('src/data/images.json', encoding='utf-8') as f:
            manifest = json.load(f)
    for name, box in CROPS.items():
        if only and name not in only:
            continue
        im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, name + '.jpg'))).convert('RGB')
        if box:
            l, t, r, b = box
            im = im.crop((l, t, r or im.width, b or im.height))
        widths = [w for w in WIDTHS if w < im.width] + [im.width]
        widths = sorted(set(w for w in widths if w >= 480))
        for w in widths:
            h = round(im.height * w / im.width)
            frame = im.resize((w, h), Image.LANCZOS) if w != im.width else im
            frame.save(f'{OUT}/{name}-{w}.webp', 'WEBP', quality=80, method=6)
            frame.save(f'{OUT}/{name}-{w}.avif', 'AVIF', quality=58, speed=4)
        manifest[name] = {'w': im.width, 'h': im.height, 'sizes': widths}
        print(name, im.size, widths)
    with open('src/data/images.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=1)

    if only:
        return

    # Brand marks: badge for the header and icons.
    badge = Image.open(os.path.join(SRC, 'brand', 'logo-icon.png')).convert('RGBA')
    badge.save(f'{OUT}/selo.png')
    for s in (32, 180, 192):
        badge.resize((s, s), Image.LANCZOS).save(f'public/icon-{s}.png')


if __name__ == '__main__':
    import sys
    main(tuple(sys.argv[1:]))
