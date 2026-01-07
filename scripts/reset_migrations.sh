#!/bin/bash
# this script resets migration files so it just has one migration file in each app

sh scripts/rm_migrations.sh

echo "Creating new migration files..."

cd server
python manage.py makemigrations
python manage.py migrate

echo "Done. Migration files created."
