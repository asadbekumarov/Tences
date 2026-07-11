# Alwaysdata deploy: build local -> upload -> install -> migrate -> restart
$ErrorActionPreference = "Stop"

$REMOTE_USER = "asadbektg"
$REMOTE_HOST = "ssh-asadbektg.alwaysdata.net"
$REMOTE_DIR = "/home/asadbektg/tences"
$REMOTE = "${REMOTE_USER}@${REMOTE_HOST}"
$Archive = "tences-deploy.tgz"

Write-Host "==> Build..." -ForegroundColor Cyan
Set-Location $PSScriptRoot\..
npm run build

Write-Host "==> Archive (node_modules va .env dan tashqari)..." -ForegroundColor Cyan
if (Test-Path $Archive) { Remove-Item $Archive -Force }

tar -czf $Archive `
  --exclude=node_modules `
  --exclude=.env `
  --exclude=prisma/dev.db `
  --exclude=prisma/data `
  --exclude=$Archive `
  --exclude=.git `
  bot.ts package.json package-lock.json tsconfig.json `
  dist prisma src scripts .env.example

Write-Host "==> Server papkasini tayyorlash..." -ForegroundColor Cyan
ssh $REMOTE "mkdir -p $REMOTE_DIR/data"

Write-Host "==> Yuklash..." -ForegroundColor Cyan
scp $Archive "${REMOTE}:${REMOTE_DIR}/"

Write-Host "==> Serverda o'rnatish..." -ForegroundColor Cyan
ssh $REMOTE @"
set -e
cd $REMOTE_DIR
tar -xzf $Archive
npm ci --omit=dev
mkdir -p data
if [ ! -f .env ]; then
  cp .env.example .env
  echo 'Iltimos .env faylini tahrirlang: nano .env'
fi
echo 'Alwaysdata panel -> Sites -> Command:'
echo 'cd $REMOTE_DIR && npm run start:prod'
"@

Remove-Item $Archive -Force
Write-Host "==> Tayyor!" -ForegroundColor Green
Write-Host "Alwaysdata panel: Environment -> BOT_TOKEN, DATABASE_URL=file:$REMOTE_DIR/data/tences.db, POLLING=false, PORT=(site port)"
