#!/bin/sh
set -e

ROOT_ENV=".env"
SERVER_ENV="server/.env"
CLIENT_ENV="client/.env"

echo "Merging env files into root .env..."

# Clear existing root .env
rm -f "$ROOT_ENV"

# Copy server envs
if [ -f "$SERVER_ENV" ]; then
  echo "# Server envs" >> "$ROOT_ENV"
  cat "$SERVER_ENV" >> "$ROOT_ENV"
  echo "" >> "$ROOT_ENV"
fi

# Copy client envs (optional)
if [ -f "$CLIENT_ENV" ]; then
  echo "# Client envs" >> "$ROOT_ENV"
  cat "$CLIENT_ENV" >> "$ROOT_ENV"
fi

echo "Done. Root .env created."
