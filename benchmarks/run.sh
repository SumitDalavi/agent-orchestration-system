#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../server"

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Running Multi-Agent Throughput Benchmark..."
npx ts-node ../benchmarks/run.ts
