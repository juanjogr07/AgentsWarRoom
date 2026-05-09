#!/bin/bash
# Pulls latest shared contracts from M1 (agentstudio-core)
# Run this before starting work or when M1 team updates types

set -e
BASE_URL="https://raw.githubusercontent.com/juanjogr07/agentstudio-core/main"

mkdir -p src/contracts CONTEXT

echo "Syncing types from M1..."
curl -sf "$BASE_URL/src/contracts/types.ts" -o src/contracts/types.ts
echo "Done: src/contracts/types.ts updated"

echo "Fetching context files..."
curl -sf "$BASE_URL/CONTEXT/actions-api.md" -o CONTEXT/core-api.md 2>/dev/null || echo "Note: core-api.md not yet available"
curl -sf "https://raw.githubusercontent.com/juanjogr07/agentstudio-board/main/CONTEXT/board-api.md" -o CONTEXT/board-api.md 2>/dev/null || echo "Note: board-api.md not yet available"
echo "Sync complete."
