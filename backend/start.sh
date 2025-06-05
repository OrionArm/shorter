#!/bin/sh

echo "🚀 Running script start.sh"
npx drizzle-kit migrate || {
  echo "❌ Migration failed"
  exit 1
}
echo "✅ Migrations applied."
echo "Starting server..."
node /app/backend/dist/src/main.js
