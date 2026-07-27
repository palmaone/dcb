#!/bin/sh
set -e

# Check the env var set in Dokploy
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🚀 Running database migrations..."
  deno task migrate
else
  echo "⏭️  Skipping migrations (RUN_MIGRATIONS is not 'true')"
fi

# Start the app
exec deno task start   