#!/bin/bash
echo "🚀 Running all C++ checkers..."

SCRIPT_DIR=$(dirname "$0")
CPP_EXECUTABLES=("builder-name-check" "check-generics" "check-unique-types" "query-keys" "server-hooks" "merge-query-keys" "update-index")

for FILE in "${CPP_EXECUTABLES[@]}"; do
  EXEC_PATH="$SCRIPT_DIR/$FILE"

  if [[ -x "$EXEC_PATH" ]]; then
    echo "▶️ Running $FILE..."
    "$EXEC_PATH"
    if [[ $? -ne 0 ]]; then
      echo "❌ Execution failed: $FILE"
      exit 1
    fi
    echo "✅ $FILE executed successfully!"
  else
    echo "⚠️  Skipping $FILE: Executable not found or not executable!"
  fi
done

echo -e "🔧 Running lint fix..."
yarn run lint:fix
echo -e "✅ Linting and formatting completed!\n"

echo -e "\n🎉 All C++ checkers executed successfully!"
