#!/bin/bash

# Script to clean and reinstall packages 
# to resolve dependency conflicts

echo "Cleaning node_modules..."
rm -rf node_modules
rm -rf .pnpm-store

echo "Clearing package manager cache..."
pnpm store prune

echo "Reinstalling packages..."
pnpm install

echo "Done! If you're still experiencing issues, try:"
echo "- Checking package.json for conflicting dependencies"
echo "- Running 'pnpm dedupe' to optimize the dependency tree"
echo "- Running 'pnpm audit fix' to resolve vulnerable dependencies" 