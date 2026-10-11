#!/usr/bin/env bash
# Download bundled fonts (Inter + JetBrains Mono, latin woff2).
set -euo pipefail
DIR="$(dirname "$0")/../public/fonts"
mkdir -p "$DIR"
echo "-> Inter"
curl -sL -o "$DIR/Inter.woff2" "https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2"
echo "-> JetBrains Mono"
curl -sL -o "$DIR/JetBrainsMono.woff2" "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2"
ls -la "$DIR"
