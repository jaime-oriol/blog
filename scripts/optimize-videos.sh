#!/bin/bash
# Script para comprimir videos MP4 manteniendo calidad visual
# Uso: ./scripts/optimize-videos.sh <directorio>

if [ -z "$1" ]; then
  echo "Uso: ./scripts/optimize-videos.sh <directorio>"
  echo "Ejemplo: ./scripts/optimize-videos.sh public/static/images/articles/extras"
  exit 1
fi

DIRECTORY=$1

if [ ! -d "$DIRECTORY" ]; then
  echo "Error: El directorio '$DIRECTORY' no existe"
  exit 1
fi

echo "🎬 Optimizando videos en: $DIRECTORY"
echo "----------------------------------------"

# Verificar si ffmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
  echo "❌ Error: ffmpeg no está instalado"
  echo "Instala con: sudo apt-get install ffmpeg (Linux) o brew install ffmpeg (Mac)"
  exit 1
fi

# Contador
count=0
total_before=0
total_after=0

# Buscar todos los archivos MP4
find "$DIRECTORY" -type f -name "*.mp4" | while read -r file; do
  # Crear backup
  backup="${file}.original"

  # Si ya existe un backup, skip
  if [ -f "$backup" ]; then
    echo "⏭️  Skip (ya optimizado): $(basename "$file")"
    continue
  fi

  # Obtener tamaño original
  size_before=$(du -h "$file" | cut -f1)
  bytes_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)

  # Crear archivo temporal
  temp="${file}.temp.mp4"

  echo "🔄 Procesando: $(basename "$file") (${size_before})"

  # Comprimir con H.265 (mejor compresión) o H.264 (mayor compatibilidad)
  # Opción 1: H.265 (HEVC) - Mejor compresión (~50% menos tamaño)
  # ffmpeg -i "$file" -c:v libx265 -crf 28 -preset medium -c:a aac -b:a 128k -movflags +faststart "$temp" -y -v quiet -stats

  # Opción 2: H.264 - Mayor compatibilidad (~30% menos tamaño)
  ffmpeg -i "$file" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart "$temp" -y -v quiet -stats

  # Verificar si la compresión fue exitosa
  if [ $? -eq 0 ] && [ -f "$temp" ]; then
    # Obtener tamaño comprimido
    bytes_after=$(stat -f%z "$temp" 2>/dev/null || stat -c%s "$temp" 2>/dev/null)
    size_after=$(du -h "$temp" | cut -f1)

    # Calcular reducción
    reduction=$((100 - (bytes_after * 100 / bytes_before)))

    # Solo reemplazar si hay reducción significativa (>10%)
    if [ $reduction -gt 10 ]; then
      # Hacer backup del original
      mv "$file" "$backup"

      # Reemplazar con versión optimizada
      mv "$temp" "$file"

      echo "✅ Optimizado: $(basename "$file")"
      echo "   Antes: ${size_before} → Después: ${size_after} (${reduction}% reducción)"

      count=$((count + 1))
      total_before=$((total_before + bytes_before))
      total_after=$((total_after + bytes_after))
    else
      echo "⚠️  Sin mejora significativa, manteniendo original"
      rm "$temp"
    fi
  else
    echo "❌ Error al comprimir: $(basename "$file")"
    [ -f "$temp" ] && rm "$temp"
  fi

  echo ""
done

echo "----------------------------------------"
echo "✨ Optimización completada"
echo "Videos procesados: $count"

if [ $count -gt 0 ]; then
  # Calcular totales en MB
  mb_before=$((total_before / 1024 / 1024))
  mb_after=$((total_after / 1024 / 1024))
  mb_saved=$((mb_before - mb_after))
  total_reduction=$((100 - (total_after * 100 / total_before)))

  echo "Tamaño total antes: ${mb_before} MB"
  echo "Tamaño total después: ${mb_after} MB"
  echo "Espacio ahorrado: ${mb_saved} MB (${total_reduction}%)"
  echo ""
  echo "💡 Los archivos originales están guardados como *.mp4.original"
  echo "   Para restaurar: mv archivo.mp4.original archivo.mp4"
fi
