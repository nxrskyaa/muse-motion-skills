#!/usr/bin/env bash
# Synthesize one VO clip per line of script.txt (format: ID|text).
# Usage: ./vo.sh   (writes public/vo/<ID>.mp3)
# Requires the `tts` skill CLI. Set LANG_ID for other languages (default: en).
set -euo pipefail
VOICE="${VOICE:-avocado_v2:MAI_03}"
LANG_ID="${LANG_ID:-en}"
OUT="$(dirname "$0")/../public/vo"
mkdir -p "$OUT"
while IFS='|' read -r id text; do
  [[ -z "$id" || "$id" == \#* ]] && continue
  echo "== $id"
  tts speak --voice "$VOICE" --language "$LANG_ID" --output "$OUT/$id.mp3" --text "$text"
  ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$id.mp3" | xargs echo "   duration:"
done < "$(dirname "$0")/script.txt"
