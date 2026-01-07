#!/bin/sh
set -e

echo "Starting Django container..."

echo "Applying migrations..."
python manage.py migrate --noinput

# If running in production, Collect static
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Running in production mode"
    echo "Collecting static files..."
    python manage.py collectstatic --noinput
fi

echo "Starting server..."
exec "$@"
