#!/usr/bin/env bash
# Deploy Anon directly to Vercel (no GitHub required).
# Requires: npx vercel login (once)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

PRODUCTION_URL="${PRODUCTION_URL:-https://anon-seven-eta.vercel.app}"

if ! npx vercel whoami &>/dev/null; then
  echo "Run: npx vercel login"
  exit 1
fi

npx vercel link --project anon --yes 2>/dev/null || npx vercel link --yes

# Parse server/.env (supports quoted values with & in MONGO_URI)
eval "$(node -e "
const fs = require('fs');
const text = fs.readFileSync('server/.env','utf8');
for (const line of text.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const i = t.indexOf('=');
  if (i < 0) continue;
  let k = t.slice(0,i).trim();
  let v = t.slice(i+1).trim();
  if ((v.startsWith('\"') && v.endsWith('\"')) || (v.startsWith(\"'\") && v.endsWith(\"'\"))) v = v.slice(1,-1);
  console.log('export ' + k + '=' + JSON.stringify(v));
}
")"

set_env() {
  npx vercel env rm "$1" production -y 2>/dev/null || true
  printf '%s' "$2" | npx vercel env add "$1" production --yes --force
}

echo "→ Syncing environment variables..."
set_env MONGO_URI "${MONGO_URI}"
set_env JWT_SECRET "${JWT_SECRET}"
set_env CLIENT_URL "${PRODUCTION_URL}"
if [ -n "${ADMIN_EMAILS:-}" ]; then
  set_env ADMIN_EMAILS "${ADMIN_EMAILS}"
fi
set_env FIRST_USER_AUTO_ADMIN "${FIRST_USER_AUTO_ADMIN:-false}"
set_env VITE_API_URL "/api"
set_env VITE_SERVER_URL "${PRODUCTION_URL}"

echo "→ Deploying..."
npx vercel deploy --prod --yes

echo "→ Health check..."
sleep 6
curl -sS "${PRODUCTION_URL}/api/health" | python3 -m json.tool 2>/dev/null || curl -sS "${PRODUCTION_URL}/api/health"
