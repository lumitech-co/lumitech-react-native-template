#!/bin/bash

GENERATED_FILE="src/shared/themes/ui/lib/stylesheet.ts"

if [ ! -f "$GENERATED_FILE" ]; then
  echo "Generated file not found. Please ensure ts-to-zod has run successfully."
  exit 1
fi

sed -i '' 's/z\.literal(Animated\.AnimatedNode)/z\.any()/g' "$GENERATED_FILE"

echo "Replaced Animated.AnimatedNode with z.any() in $GENERATED_FILE"
