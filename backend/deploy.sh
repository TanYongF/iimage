#!/bin/bash
# Backend Deployment Script

echo "🚀 Deploying backend..."

# Set environment
export NODE_ENV=production

# Start the server
echo "Starting server on port ${PORT:-3000}..."
node server.js
