#!/bin/bash

# Script to generate all required favicon sizes for FootballDecoded
# Run this from the project root: bash scripts/generate-favicons.sh

set -e

FAVICON_DIR="public/static/favicons"
SOURCE_PNG="$FAVICON_DIR/favicon-source.png"

echo "🚀 Generating favicons for FootballDecoded..."

if [ ! -f "$SOURCE_PNG" ]; then
    echo "❌ Source favicon not found at $SOURCE_PNG"
    exit 1
fi

cd "$FAVICON_DIR"

# Check if we have ImageMagick convert or magick command
if command -v convert >/dev/null 2>&1; then
    CONVERT_CMD="convert"
elif command -v magick >/dev/null 2>&1; then
    CONVERT_CMD="magick"
else
    echo "❌ ImageMagick not found. Please install ImageMagick:"
    echo "   Ubuntu/Debian: sudo apt install imagemagick"
    echo "   macOS: brew install imagemagick"
    echo "   Windows: Download from https://imagemagick.org/script/download.php"
    exit 1
fi

echo "✅ Using ImageMagick command: $CONVERT_CMD"

# Generate all required sizes
echo "📱 Generating favicon sizes..."

# Standard favicon sizes
$CONVERT_CMD "favicon-source.png" -resize 16x16 "favicon-16x16.png"
$CONVERT_CMD "favicon-source.png" -resize 32x32 "favicon-32x32.png"
$CONVERT_CMD "favicon-source.png" -resize 48x48 "favicon-48x48.png"

# Apple touch icons
$CONVERT_CMD "favicon-source.png" -resize 180x180 "apple-touch-icon.png"

# Android/Chrome icons for PWA
$CONVERT_CMD "favicon-source.png" -resize 192x192 "android-chrome-192x192.png"
$CONVERT_CMD "favicon-source.png" -resize 512x512 "android-chrome-512x512.png"

# Microsoft tile
$CONVERT_CMD "favicon-source.png" -resize 150x150 "mstile-150x150.png"

# Generate ICO file (multiple sizes in one file)
$CONVERT_CMD "favicon-source.png" -resize 256x256 \
    \( -clone 0 -resize 128x128 \) \
    \( -clone 0 -resize 64x64 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 16x16 \) \
    -delete 0 favicon.ico

echo "✅ All favicons generated successfully!"
echo "📋 Generated files:"
echo "   • favicon.ico (multi-size)"
echo "   • favicon-16x16.png"
echo "   • favicon-32x32.png"
echo "   • favicon-48x48.png"
echo "   • apple-touch-icon.png (180x180)"
echo "   • android-chrome-192x192.png"
echo "   • android-chrome-512x512.png"
echo "   • mstile-150x150.png"
echo ""
echo "🔍 Verify your favicons at: https://realfavicongenerator.net/favicon_checker"