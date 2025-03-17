#!/bin/bash

openapi_schema_file="src/shared/api/endpoints.ts"

if [[ ! -f "$openapi_schema_file" ]]; then
  echo "File not found!"
  exit 1
fi

paths=$(grep -o '"/[^"]*":' "$openapi_schema_file" | sed 's/"://g' | tr -d '"')

union="export type Endpoints = "

for path in $paths; do
  union+="\"$path\" | "
done

union+="({} & string);"

echo -e "$union" > "$openapi_schema_file"

echo "Endpoints type has been added to $openapi_schema_file with | ({} & string) at the end."