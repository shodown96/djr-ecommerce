#!/bin/sh
set -e

echo "Building frontend..."

cd client
npm install
npm run build

echo "Moving build to backend..."

rm -rf ../server/core/build
mkdir -p ../server/core/build

cp -r dist/* ../server/core/build/

echo "Frontend build moved successfully."
