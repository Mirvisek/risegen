#!/bin/sh
set -e

# Wait for DB if needed (not needed for SQLite file mode usually, but ensures mount is ready)
echo "Starting application..."

# Run migrations
if [ -n "$DATABASE_URL" ]; then
    echo "Running Prisma migrations..."
    npx prisma migrate deploy
fi

# Start Next.js
echo "Starting server..."
exec npm start
