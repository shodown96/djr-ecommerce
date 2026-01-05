# backend/entrypoint.sh
#!/bin/sh

if [ "$ENVIRONMENT" = "production" ]; then
  mkdir -p /app/templates
  cp /app/static/frontend/index.html /app/templates/index.html
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
