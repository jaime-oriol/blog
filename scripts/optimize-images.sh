#!/bin/bash
# Script para convertir y optimizar imágenes PNG/JPG a WebP
# Uso: ./scripts/optimize-images.sh <directorio>

if [ -z "$1" ]; then
  echo "Uso: ./scripts/optimize-images.sh <directorio>"
  echo "Ejemplo: ./scripts/optimize-images.sh public/static/images/articles"
  exit 1
fi

DIRECTORY=$1

if [ ! -d "$DIRECTORY" ]; then
  echo "Error: El directorio '$DIRECTORY' no existe"
  exit 1
fi

echo "🖼️  Optimizando imágenes en: $DIRECTORY"
echo "----------------------------------------"

# Verificar si cwebp está instalado
if ! command -v cwebp &> /dev/null; then
  echo "❌ Error: cwebp no está instalado"
  echo "Instala con: sudo apt-get install webp (Linux) o brew install webp (Mac)"
  exit 1
fi

count_png=0
count_jpg=0
total_before=0
total_after=0

# Función para convertir una imagen
convert_image() {
  local file=$1
  local ext="${file##*.}"
  local webp="${file%.*}.webp"

  # Si ya existe WebP, skip
  if [ -f "$webp" ]; then
    echo "⏭️  Skip (WebP ya existe): $(basename "$file")"
    return
  fi

  # Obtener tamaño original
  size_before=$(du -h "$file" | cut -f1)
  bytes_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

  echo "🔄 Procesando: $(basename "$file") (${size_before})"

  # Convertir a WebP con calidad 85 (equilibrio calidad/tamaño)
  if [ "$ext" = "png" ] || [ "$ext" = "PNG" ]; then
    # PNG: usar -lossless para transparencias, o -q 90 si no hay transparencia
    cwebp -q 90 "$file" -o "$webp" -quiet
  else
    # JPG: calidad 85 es óptima
    cwebp -q 85 "$file" -o "$webp" -quiet
  fi

  # Verificar si la conversión fue exitosa
  if [ $? -eq 0 ] && [ -f "$webp" ]; then
    bytes_after=$(stat -f%z "$webp" 2>/dev/null || stat -c%s "$webp" 2>/dev/null)
    size_after=$(du -h "$webp" | cut -f1)

    # Calcular reducción
    reduction=$((100 - (bytes_after * 100 / bytes_before)))

    echo "✅ Convertido a WebP: $(basename "$webp")"
    echo "   Antes: ${size_before} → Después: ${size_after} (${reduction}% reducción)"

    if [ "$ext" = "png" ] || [ "$ext" = "PNG" ]; then
      count_png=$((count_png + 1))
    else
      count_jpg=$((count_jpg + 1))
    fi

    total_before=$((total_before + bytes_before))
    total_after=$((total_after + bytes_after))
  else
    echo "❌ Error al convertir: $(basename "$file")"
    [ -f "$webp" ] && rm "$webp"
  fi

  echo ""
}

# Procesar PNGs
echo "📸 Procesando archivos PNG..."
find "$DIRECTORY" -type f \( -name "*.png" -o -name "*.PNG" \) | while read -r file; do
  convert_image "$file"
done

echo ""
echo "📸 Procesando archivos JPG..."
find "$DIRECTORY" -type f \( -name "*.jpg" -o -name "*.JPG" -o -name "*.jpeg" -o -name "*.JPEG" \) | while read -r file; do
  convert_image "$file"
done

total_converted=$((count_png + count_jpg))

echo "----------------------------------------"
echo "✨ Optimización completada"
echo "PNGs convertidos: $count_png"
echo "JPGs convertidos: $count_jpg"
echo "Total: $total_converted imágenes"

if [ $total_converted -gt 0 ]; then
  # Calcular totales en MB
  mb_before=$((total_before / 1024 / 1024))
  mb_after=$((total_after / 1024 / 1024))
  mb_saved=$((mb_before - mb_after))
  total_reduction=$((100 - (total_after * 100 / total_before)))

  echo ""
  echo "Tamaño total antes: ${mb_before} MB"
  echo "Tamaño total después: ${mb_after} MB"
  echo "Espacio ahorrado: ${mb_saved} MB (${total_reduction}%)"
  echo ""
  echo "💡 Los archivos originales PNG/JPG se mantienen para compatibilidad"
  echo "   Next.js servirá WebP a navegadores modernos automáticamente"
fi
