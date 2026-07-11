#!/usr/bin/env bash
# Alwaysdata serverda birinchi marta ishga tushirish (SSH orqali)
set -euo pipefail

APP_DIR="${APP_DIR:-/home/asadbektg/tences}"
cd "$APP_DIR"

mkdir -p data

if [[ ! -f .env ]]; then
  cat > .env <<EOF
BOT_TOKEN=YOUR_BOT_TOKEN
DATABASE_URL="file:${APP_DIR}/data/tences.db"
PORT=8100
HOST=::
POLLING=false
EOF
  echo ".env yaratildi — BOT_TOKEN ni tahrirlang: nano .env"
fi

npm ci --omit=dev
npm run build
npm run start:prod
