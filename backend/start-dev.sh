#!/bin/sh

echo "🚀 Running script start-dev.sh"
npm run db:migrate || {
  echo "❌ Migration failed"
  exit 1
}
echo "✅ Migrations applied."
echo "Starting server..."
npm run start:dev
