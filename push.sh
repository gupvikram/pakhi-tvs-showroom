#!/bin/bash
# ─────────────────────────────────────────────────
#  Pakhi TVS Alwar Showroom — Git Push Script
#  Usage: ./push.sh "your commit message"
#  Or   : ./push.sh          (uses auto message)
# ─────────────────────────────────────────────────

cd "$(dirname "$0")"

MSG="${1:-Update $(date '+%d %b %Y %H:%M')}"

echo "📦  Staging all changes…"
git add .

if git diff --cached --quiet; then
    echo "ℹ️   Nothing to commit — working tree clean."
    exit 0
fi

echo "💾  Committing: $MSG"
git commit -m "$MSG"

echo "🚀  Pushing to GitHub…"
git push

echo "✅  Done! Railway will auto-deploy in ~30 seconds."
