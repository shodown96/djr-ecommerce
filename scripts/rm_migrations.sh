#!/bin/sh
set -e

echo "Clearing migration files..."

find . -path "*/migrations/*.py" \
  -not -name "__init__.py" \
  -delete

find . -path "*/migrations/*.pyc" -delete

echo "Done. Migration files cleared."
