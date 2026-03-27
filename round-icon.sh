#!/bin/zsh
set -e

ICON_PATH=$1
OUTPUT_PATH=$2
RADIUS=122  # ~12% of 1024px

# Create solid white rounded PNG mask
magick -size 1024x1024 xc:none -fill white -draw "roundrectangle 0,0 1024,1024 $RADIUS,$RADIUS" temp_mask.png

# Apply alpha mask
magick "$ICON_PATH" temp_mask.png -compose CopyOpacity -composite "$OUTPUT_PATH"

rm temp_mask.png

