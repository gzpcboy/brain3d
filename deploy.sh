#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

echo "Installing dependencies if needed..."
npm install

echo "Running unit and structure tests..."
npm test

echo "Building production assets..."
npm run build

echo "Restarting local Brain3D static server..."
./scripts/restart-local-server.sh

echo "Brain3D deployed locally on http://127.0.0.1:4317"
echo "Expected public route after proxy apply: https://brain3d.gzpcboy.vip"

