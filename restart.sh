#!/bin/bash
# ─────────────────────────────────────────────────
#  Pakhi TVS Alwar Showroom — Restart Script
#  Usage: ./restart.sh
# ─────────────────────────────────────────────────

cd "$(dirname "$0")"

echo "⏹  Stopping any server on port 8001…"
lsof -ti :8001 | xargs kill -9 2>/dev/null
sleep 1

echo "✅  Port 8001 is free."
echo "🚀  Starting server…"
echo ""

source .venv/bin/activate 2>/dev/null || true

uvicorn main:app --host 0.0.0.0 --port 8001 --reload
