#!/bin/bash

set -e

echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -f lambda-deployment.zip

echo "🔨 Building TypeScript..."
npm run build

echo "📦 Preparing Lambda package..."
cp package.json dist/
cd dist

echo "📥 Installing production dependencies..."
npm install --production --no-optional

echo "🗜️ Creating deployment package..."
zip -r ../lambda-deployment.zip . -x "*.map"

cd ..
echo "✅ Lambda deployment package created: lambda-deployment.zip"
echo "📊 Package size: $(du -h lambda-deployment.zip | cut -f1)"