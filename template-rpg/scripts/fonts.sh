#!/usr/bin/env bash
# Download the pixel font (Press Start 2P, TTF).
set -euo pipefail
DIR="$(dirname "$0")/../public/fonts"
mkdir -p "$DIR"
echo "-> Press Start 2P"
curl -sL -o "$DIR/PS2P.ttf" "https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK0nS.ttf"
ls -la "$DIR"
