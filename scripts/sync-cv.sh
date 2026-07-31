#!/bin/bash
# Publica los CV de LaTeX en public/static, comprimidos con ghostscript.
# Origen: $CV_SOURCE_DIR (por defecto ~/LAB/GOD/cv). Uso: npm run sync:cv [--force]
# Lo llama solo el hook pre-commit: si el origen no ha cambiado, no hace nada.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${CV_SOURCE_DIR:-$HOME/LAB/GOD/cv}"
DEST_DIR="$ROOT/public/static"
STAMP="$ROOT/scripts/.cv-sync"
FILES=(CV_Jaime_Oriol.pdf CV_Jaime_Oriol_ING.pdf)

# Sin los originales delante (CI, Vercel, otro equipo) no se toca lo publicado.
for f in "${FILES[@]}"; do
  if [ ! -f "$SRC_DIR/$f" ]; then
    echo "sync-cv: falta $SRC_DIR/$f, se deja el PDF publicado como está"
    exit 0
  fi
done

# El sello guarda el hash de los originales, no del PDF publicado: ghostscript
# no es determinista y comparar la salida marcaría "cambiado" en cada commit.
stamp_now=$(md5sum "${FILES[@]/#/$SRC_DIR/}" | md5sum | cut -d' ' -f1)
if [ "${1:-}" != "--force" ] && [ "$(cat "$STAMP" 2>/dev/null)" = "$stamp_now" ]; then
  exit 0
fi

for f in "${FILES[@]}"; do
  if command -v gs > /dev/null; then
    gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
      -dDetectDuplicateImages=true -dNOPAUSE -dQUIET -dBATCH \
      -sOutputFile="$DEST_DIR/$f" "$SRC_DIR/$f"
  else
    cp "$SRC_DIR/$f" "$DEST_DIR/$f"
  fi
  echo "sync-cv: $f  $(($(stat -c%s "$SRC_DIR/$f") / 1024)) KB -> $(($(stat -c%s "$DEST_DIR/$f") / 1024)) KB"
done

echo "$stamp_now" > "$STAMP"

# Deja los PDF listos en el índice para que entren en el commit en curso.
if git -C "$ROOT" rev-parse --git-dir > /dev/null 2>&1; then
  git -C "$ROOT" add "${FILES[@]/#/public/static/}" scripts/.cv-sync
fi
