#!/usr/bin/env bash
set -Eeuo pipefail
PORT=${PORT:-3107}
CHROME=$(command -v chromium || command -v google-chrome || true)
if [ -z "$CHROME" ]; then echo 'Chromium unavailable'; exit 2; fi
mkdir -p qa/results
for route in en en/storyverse; do
  name=${route//\//-}
  "$CHROME" --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --hide-scrollbars --window-size=1280,800 --screenshot="$(pwd)/qa/results/${name}.png" "http://127.0.0.1:${PORT}/${route}" >/dev/null 2>&1
  echo "Screenshot: qa/results/${name}.png"
done
