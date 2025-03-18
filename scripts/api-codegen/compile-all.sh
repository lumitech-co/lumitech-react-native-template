#!/bin/bash

echo "🔨 Compiling all C++ files..."

SCRIPT_DIR=$(dirname "$0")

g++ -o "$SCRIPT_DIR/builder-name-check" "$SCRIPT_DIR/builder-name-check.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: builder-name-check.cpp"
  exit 1
fi

g++ -o "$SCRIPT_DIR/check-generics" "$SCRIPT_DIR/check-generics.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: check-generics.cpp"
  exit 1
fi

g++ -o "$SCRIPT_DIR/check-unique-types" "$SCRIPT_DIR/check-unique-types.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: check-unique-types.cpp"
  exit 1
fi

g++ -o "$SCRIPT_DIR/query-keys" "$SCRIPT_DIR/query-keys.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: query-keys.cpp"
  exit 1
fi

g++ -o "$SCRIPT_DIR/server-hooks" "$SCRIPT_DIR/server-hooks.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: server-hooks.cpp"
  exit 1
fi

g++ -o "$SCRIPT_DIR/merge-query-keys" "$SCRIPT_DIR/merge-query-keys.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: merge-query-keys.cpp"
  exit 1
fi

g++ -o "$SCRIPT_DIR/update-index" "$SCRIPT_DIR/update-index.cpp" -std=c++17 -O2
if [[ $? -ne 0 ]]; then
  echo "❌ Compilation failed: update-index.cpp"
  exit 1
fi

echo "✅ All files compiled successfully!"
