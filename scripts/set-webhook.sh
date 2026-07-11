#!/usr/bin/env bash
# Telegram webhook o'rnatish (Alwaysdata HTTPS domeni bilan)
set -euo pipefail

if [[ -z "${BOT_TOKEN:-}" ]]; then
  echo "BOT_TOKEN kerak: export BOT_TOKEN=..."
  exit 1
fi

if [[ -z "${WEBHOOK_HOST:-}" ]]; then
  echo "WEBHOOK_HOST kerak, masalan: asadbektg.alwaysdata.net"
  exit 1
fi

WEBHOOK_URL="https://${WEBHOOK_HOST}/${BOT_TOKEN}"

curl -sS "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -d "url=${WEBHOOK_URL}" \
  -d "drop_pending_updates=true" | jq .

echo "Webhook: ${WEBHOOK_URL}"
