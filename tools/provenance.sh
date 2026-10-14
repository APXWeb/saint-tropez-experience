#!/usr/bin/env sh
# Embeds the origin of every shipping raster (Impeccable provenance). Run after `npm run images`.
# Usage: IMPECCABLE=/path/to/impeccable sh tools/provenance.sh
I="${IMPECCABLE:-impeccable}"
for f in public/img/*.webp public/img/*.avif public/img/selo.png public/icon-*.png; do
  case "$f" in
    *selo*|*icon-*)
      o="Sourced: Saint Tropez Confeitaria palm badge from the house's Instagram profile picture (pre-existing asset from APXWeb/saint-tropez-confeitaria), resized by tools/images.py" ;;
    *)
      n=$(basename "$f" | sed -E 's/-[0-9]+\.(webp|avif)$//')
      case " folhado-creme doce-urso fatia-bolo-chocolate paes-dourados prato-carne salmao-cogumelos bebida-morango croissants-acucar folhados-coracao sanduiche-salmao salao-vidro salao-palmeira quiche-tomate torrada-presunto cafe-espuma crepe-gratinado fachada-inteira coxinhas balcao-vitrine pizza-presunto adega-maquinas " in
        *" $n "*)
          o="Sourced: photo published by @sainttropezconfeitaria on Instagram, screenshot sent by the user on 2026-10-14 (assets-src/$n.jpg); house badge cropped out and resized by tools/images.py. Not generated." ;;
        *)
          o="Sourced: photo published by @sainttropezconfeitaria on Instagram (assets-src/$n.jpg, carried over from APXWeb/saint-tropez-confeitaria); house badge cropped out and resized by tools/images.py. Not generated." ;;
      esac ;;
  esac
  "$I" embed-prompt "$f" --prompt "$o" >/dev/null || echo "falhou: $f"
done
"$I" embed-prompt --scan public/img public
