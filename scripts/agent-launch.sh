#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "=== EduNet Agent Launch ==="
echo "Repository: $ROOT"
echo "Branch: $(git branch --show-current)"
echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'not committed')"
echo

echo "[1/4] Read agent contract"
cat agent/MASTER_AGENT.md

echo

echo "[2/4] Read implementation prompt"
cat prompts/MASTER_IMPLEMENTATION.md

echo

echo "[3/4] Read current state"
cat agent/runtime/IMPLEMENTATION_STATE.md

echo

echo "[4/4] Next action"
echo "Inspect the target application repository and begin Foundation -> Architecture." 
echo "Do not ask questions; resolve ambiguity autonomously per MASTER_AGENT.md."
