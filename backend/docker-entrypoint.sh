#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL is not set. Skipping migrations."
else
  echo "🔄 Waiting for database and synchronizing schema..."
  RETRIES=20
  until npx prisma db push --skip-generate >/tmp/prisma.log 2>&1; do
    RETRIES=$((RETRIES - 1))
    if [ "$RETRIES" -le 0 ]; then
      echo "❌ Prisma db push failed after multiple attempts:"
      cat /tmp/prisma.log
      exit 1
    fi
    sleep 3
  done
  cat /tmp/prisma.log
  rm /tmp/prisma.log
fi

echo "🚀 Starting application..."
exec "$@"
