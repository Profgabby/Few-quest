#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$0")/.."
mkdir -p qa/results
LOG="qa/results/production-gate.log"
exec > >(tee "$LOG") 2>&1
printf 'Production gate started: %s\n' "$(date -u)"
node --version; npm --version
if [ -f package-lock.json ]; then npm ci; else echo 'No package-lock.json present: npm install will generate a lockfile in this isolated checkout'; npm install; fi
npm run typecheck
npm run lint
npm run build
node storyverse-offline-tests.cjs
node storyverse-catalog-tests.cjs
PORT=${PORT:-3107} npm run start -- -p "${PORT:-3107}" >qa/results/server.log 2>&1 &
PID=$!
trap 'kill "$PID" 2>/dev/null || true' EXIT
for i in $(seq 1 35); do if curl -fsS "http://127.0.0.1:${PORT:-3107}/en" -o /dev/null; then break; fi; sleep 1; done
node qa/http-regression.mjs
printf 'PASS production gate\n'
