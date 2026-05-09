#!/bin/bash
# Pulls latest shared contracts from M1 (agentstudio-core)
# Run this before starting work or when M1 team updates types

set -e
MILSTONE_URL="https://raw.githubusercontent.com/juanjogr07/agentstudio-core/main"

mkdir -p src/contracts

echo "Syncing types from M1..."
curl -sf "$MILESTONE_URL/src/contracts/types.ts" -o src/contracts/types.ts
echo "Done: src/contracts/types.ts updated"

echo "Fetching M1 API reference..."
mkdir -p CONTEXT
curl -sf "$MILESTONE_URL/CONTEXT/board-api.md" -o CONTEXT/core-api.md 2>/dev/null || echo "Note: core-api.md not yet available"
echo "Sync complete."
