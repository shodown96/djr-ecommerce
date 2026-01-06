#!/bin/bash
# this script removes all the migrations

# make it run from the current working directory of the script regardless
# of the executors location
cwd="$(dirname "$0")"

echo "Clearing migration files..."

find $cwd/../server -path "*/migrations/*.py" -not -name "__init__.py" -delete
find $cwd/../server -path "*/migrations/*.pyc"  -delete
find $cwd/../server -path "*/__pycache__/*"  -delete

echo "Done. Migration files cleared."
