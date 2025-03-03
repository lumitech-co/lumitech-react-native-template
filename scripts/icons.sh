#!/bin/bash
PATTERN="selection.json"
DECL_POSTFIX=".d.ts"
TARGET_DIRECTORY="./src/assets/resources"

echo "Current Directory: $(pwd)"
echo "Checking for files in: $TARGET_DIRECTORY"

JSONS=($(find "$TARGET_DIRECTORY" -type f -name "$PATTERN"))

echo "Files found: ${JSONS[@]}"

if [ ${#JSONS[@]} -eq 0 ]; then
  echo "No files found. Exiting."
  exit 1
fi

for file in "${JSONS[@]}"
do
  echo "Processing file: $file"

  if git check-ignore --quiet "$file"; then
    continue
  fi

  ICON_NAMES=$(jq -r '.icons[].properties.name' "$file" | awk -v ORS=' | ' '{print "\"" $0 "\""}' | sed 's/ | $//')

  printf "/** Generated with \`./icons.sh\` */\nexport type IconName = $ICON_NAMES | (string & {});\n" > "$file$DECL_POSTFIX"
  echo "Generated .d.ts for: $file"
done