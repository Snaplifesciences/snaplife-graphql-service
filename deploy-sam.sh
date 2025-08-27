#!/bin/bash

set -e

ENV=${1:-dev}
echo "🌍 Deploying to environment: $ENV"

echo "🔨 Building and packaging..."
if ! ./deploy.sh; then
    echo "❌ Build failed! Aborting deployment."
    exit 1
fi
echo "✅ Build successful!"

echo "🚀 Deploying with SAM..."
sam deploy \
    --template-file template.yml \
    --stack-name "snaplife-graphql-service-$ENV" \
    --s3-bucket snaplife-graphql-service-deployments \
    --s3-prefix "$ENV" \
    --parameter-overrides "Stage=$ENV" \
    --capabilities CAPABILITY_IAM \
    --profile snaplife \
    --no-confirm-changeset

echo "✅ Deployment complete!"