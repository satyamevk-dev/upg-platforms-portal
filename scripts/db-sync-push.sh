#!/usr/bin/env bash
# Push a full copy of the database from .env DATABASE_URL (source) onto TARGET_DATABASE_URL.
# This is destructive on the target: it drops and recreates objects in the dump.
#
# Prerequisites: PostgreSQL 15+ client tools (`pg_dump`, `psql`) on PATH.
#   macOS: brew install libpq && brew link --force libpq
#
# Usage:
#   export TARGET_DATABASE_URL='postgresql://USER:PASS@HOST/DB?sslmode=require'
#   npm run db:sync:push
#
# Get TARGET_DATABASE_URL from Render → PostgreSQL → "External Database URL" (or Internal if
# your machine can reach it). Always use TLS on public hosts (?sslmode=require).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -z "${TARGET_DATABASE_URL:-}" ]]; then
  echo "Missing TARGET_DATABASE_URL."
  echo "Example:"
  echo "  export TARGET_DATABASE_URL='postgresql://user:pass@dpg-....render.com/dbname?sslmode=require'"
  echo "  npm run db:sync:push"
  exit 1
fi

if ! command -v pg_dump >/dev/null 2>&1 || ! command -v psql >/dev/null 2>&1; then
  echo "pg_dump and psql are required. Install with: brew install libpq && brew link --force libpq"
  exit 1
fi

SOURCE_URL="$(node "${ROOT}/scripts/db-sync-read-source-url.mjs")"

echo ""
echo "Source: DATABASE_URL from .env (local)"
echo "Target: TARGET_DATABASE_URL (first 60 chars): ${TARGET_DATABASE_URL:0:60}..."
echo ""
echo "This OVERWRITES the target database with a dump from source (pg_dump --clean)."
read -r -p "Type YES to continue: " confirm
if [[ "${confirm}" != "YES" ]]; then
  echo "Aborted."
  exit 1
fi

set -o pipefail
pg_dump "${SOURCE_URL}" --clean --if-exists --no-owner --no-acl | psql "${TARGET_DATABASE_URL}" -v ON_ERROR_STOP=1

echo ""
echo "Sync finished. Verify on the host (e.g. Render Shell or prisma studio against TARGET)."
