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
      o="Sourced: photo published by @sainttropezconfeitaria on Instagram (assets-src/$n.jpg, carried over from APXWeb/saint-tropez-confeitaria); house badge cropped out and resized by tools/images.py. Not generated." ;;
  esac
  "$I" embed-prompt "$f" --prompt "$o" >/dev/null || echo "falhou: $f"
done
"$I" embed-prompt --scan public/img public
