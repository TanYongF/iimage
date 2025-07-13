#!/bin/bash

# Backend Build Script for PhotoOmmit
set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the backend directory"
    exit 1
fi

print_status "🚀 Starting backend build process..."

# Check Node.js version
print_status "📋 Checking Node.js version..."
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Check npm version
print_status "📋 Checking npm version..."
NPM_VERSION=$(npm --version)
print_success "npm version: $NPM_VERSION"

# Clean previous build artifacts
print_status "🧹 Cleaning previous build artifacts..."
rm -rf node_modules package-lock.json

# Install dependencies
print_status "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully!"
else
    print_error "Failed to install dependencies!"
    exit 1
fi

# Check for required environment variables
print_status "🔍 Checking environment configuration..."
ENV_FILE=".env"
if [ -f "$ENV_FILE" ]; then
    print_success "Environment file found: $ENV_FILE"
    
    # Check for required OSS environment variables
    REQUIRED_VARS=("OSS_ACCESS_KEY_ID" "OSS_ACCESS_KEY_SECRET" "OSS_BUCKET" "OSS_REGION" "OSS_ENDPOINT")
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if ! grep -q "^${var}=" "$ENV_FILE"; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -eq 0 ]; then
        print_success "All required environment variables are configured"
    else
        print_warning "Missing environment variables: ${MISSING_VARS[*]}"
        print_warning "Please ensure these are set in production environment"
    fi
else
    print_warning "No .env file found. Please create one with required environment variables"
    print_status "Creating sample .env file..."
    cat > .env.example << EOL
# OSS Configuration
OSS_ACCESS_KEY_ID=your_access_key_id
OSS_ACCESS_KEY_SECRET=your_access_key_secret
OSS_BUCKET=your_bucket_name
OSS_REGION=your_region
OSS_ENDPOINT=your_endpoint

# Server Configuration
PORT=3000
NODE_ENV=production
EOL
    print_success "Created .env.example file"
fi

# Validate server configuration
print_status "🔍 Validating server configuration..."
if [ -f "server.js" ]; then
    print_success "Main server file found: server.js"
else
    print_error "Main server file not found!"
    exit 1
fi

# Check for required directories and files
print_status "🔍 Checking project structure..."
REQUIRED_DIRS=("routes" "middlewares" "config" "utils")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_success "Directory found: $dir/"
    else
        print_warning "Directory missing: $dir/"
    fi
done

# Check for required route files
ROUTE_FILES=("routes/index.js" "routes/upload.js" "routes/status.js" "routes/mcp.js")
for file in "${ROUTE_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "Route file found: $file"
    else
        print_warning "Route file missing: $file"
    fi
done

# Test server startup (without actually starting)
print_status "🧪 Testing server configuration..."
if node -c server.js; then
    print_success "Server configuration is valid!"
else
    print_error "Server configuration has syntax errors!"
    exit 1
fi

# Check for potential issues
print_status "🔍 Running security and quality checks..."

# Check for common security issues
if grep -r "console.log" . --include="*.js" | grep -v "node_modules" > /dev/null; then
    print_warning "Found console.log statements in production code"
fi

# Check for hardcoded secrets
if grep -r "password\|secret\|key" . --include="*.js" | grep -v "node_modules" | grep -v "OSS_" > /dev/null; then
    print_warning "Potential hardcoded secrets found - please review"
fi

# Create build info
print_status "📝 Creating build information..."
BUILD_INFO="build-info.json"
cat > "$BUILD_INFO" << EOL
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "nodeVersion": "$NODE_VERSION",
  "npmVersion": "$NPM_VERSION",
  "packageVersion": "$(node -p "require('./package.json').version")",
  "dependencies": $(npm list --json --depth=0 | jq '.dependencies' 2>/dev/null || echo '{}'),
  "buildEnvironment": "$(uname -s) $(uname -r)"
}
EOL
print_success "Build information saved to: $BUILD_INFO"

# Create deployment script
print_status "📝 Creating deployment script..."
cat > deploy.sh << 'EOL'
#!/bin/bash
# Backend Deployment Script

echo "🚀 Deploying backend..."

# Set environment
export NODE_ENV=production

# Start the server
echo "Starting server on port ${PORT:-3000}..."
node server.js
EOL
chmod +x deploy.sh
print_success "Deployment script created: deploy.sh"

# Final build summary
print_status "📊 Build Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ Server configuration validated"
echo "  ✅ Project structure checked"
echo "  ✅ Build artifacts created"
echo ""
print_success "🎉 Backend build completed successfully!"
echo ""
print_status "Next steps:"
echo "  1. Review the build information in: $BUILD_INFO"
echo "  2. Ensure environment variables are properly configured"
echo "  3. Run './deploy.sh' to start the server"
echo "  4. Or use 'npm start' to start in development mode"
