#!/usr/bin/env bash
set -euo pipefail

BUCKET="react-roster-clowman"
DISTRIBUTION_ID="ECVSX3IRV4B0E"

# Fail fast if the SSO session has expired
aws sts get-caller-identity > /dev/null

npm run build

# 1. Hashed assets: safe to cache forever (upload new ones, keep old ones for now)
aws s3 sync dist/assets "s3://$BUCKET/assets" \
  --cache-control "public,max-age=31536000,immutable"

# 2. Unhashed files copied from public/ (favicon, icons): cache for 1 day
aws s3 sync dist "s3://$BUCKET" --delete \
  --exclude "assets/*" --exclude "index.html" \
  --cache-control "public,max-age=86400"

# 3. index.html last, and never cached without checking
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "no-cache"

# 4. Now that the new index.html is live, remove old hashed assets
aws s3 sync dist/assets "s3://$BUCKET/assets" --delete \
  --cache-control "public,max-age=31536000,immutable"

# 5. Tell CloudFront to drop its cached copies
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" --query "Invalidation.Id" --output text

echo "Deployed to https://d7ow9eu0p5k7h.cloudfront.net"
