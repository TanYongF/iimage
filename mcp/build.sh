#!/bin/bash

# MCP Build Test Script
echo "🧪 Testing MCP build process..."

# Check if we're in the mcp directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mcp directory"
    exit 1
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building MCP project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Verify build output
echo "🔍 Verifying build output..."
if [ -f "build/index.js" ]; then
    echo "✅ build/index.js exists"
else
    echo "❌ build/index.js not found"
    exit 1
fi

# Check executable permissions
if [ -x "build/index.js" ]; then
    echo "✅ build/index.js has execute permissions"
else
    echo "❌ build/index.js missing execute permissions"
    exit 1
fi

# List build contents
echo "📋 Build contents:"
ls -la build/

echo "🎉 All tests passed! MCP build is working correctly." 