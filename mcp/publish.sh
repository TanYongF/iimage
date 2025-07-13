#!/bin/bash

# NPM Publish Script for PhotoOmmit MCP
set -e

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

# Check if we're in the mcp directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the mcp directory"
    exit 1
fi

print_status "🚀 Starting npm publish process..."

# Check if user is logged in to npm
print_status "🔐 Checking npm authentication..."
if ! npm whoami > /dev/null 2>&1; then
    print_error "You are not logged in to npm. Please run 'npm login' first."
    exit 1
fi
print_success "Authenticated as: $(npm whoami)"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "📋 Current version: $CURRENT_VERSION"

# Ask for version bump
echo ""
echo "Select version bump type:"
echo "1) patch (1.0.0 -> 1.0.1)"
echo "2) minor (1.0.0 -> 1.1.0)"
echo "3) major (1.0.0 -> 2.0.0)"
echo "4) custom version"
echo "5) skip version bump"
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        npm version patch --no-git-tag-version
        ;;
    2)
        npm version minor --no-git-tag-version
        ;;
    3)
        npm version major --no-git-tag-version
        ;;
    4)
        read -p "Enter custom version (e.g., 1.2.3): " custom_version
        npm version $custom_version --no-git-tag-version
        ;;
    5)
        print_status "Skipping version bump"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

NEW_VERSION=$(node -p "require('./package.json').version")
if [ "$CURRENT_VERSION" != "$NEW_VERSION" ]; then
    print_success "Version updated: $CURRENT_VERSION -> $NEW_VERSION"
fi

# Clean previous build
print_status "🧹 Cleaning previous build..."
npm run clean 2>/dev/null || rm -rf build/

# Install dependencies
print_status "📦 Installing dependencies..."
npm install

# Build the project
print_status "🔨 Building project..."
npm run build

# Verify build output
print_status "🔍 Verifying build output..."
if [ ! -f "build/index.js" ]; then
    print_error "Build failed - build/index.js not found"
    exit 1
fi

if [ ! -x "build/index.js" ]; then
    print_error "Build failed - build/index.js is not executable"
    exit 1
fi

print_success "Build verification passed"

# Check package.json for required fields
print_status "🔍 Validating package.json..."
REQUIRED_FIELDS=("name" "version" "description" "main" "author" "license" "repository")
MISSING_FIELDS=()

for field in "${REQUIRED_FIELDS[@]}"; do
    if ! node -e "console.log(require('./package.json').$field)" > /dev/null 2>&1; then
        MISSING_FIELDS+=("$field")
    fi
done

if [ ${#MISSING_FIELDS[@]} -gt 0 ]; then
    print_warning "Missing required fields in package.json: ${MISSING_FIELDS[*]}"
    read -p "Continue anyway? (y/N): " continue_anyway
    if [[ ! $continue_anyway =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "Package.json validation passed"
fi

# Check if package name is available
print_status "🔍 Checking package name availability..."
PACKAGE_NAME=$(node -p "require('./package.json').name")
if npm view "$PACKAGE_NAME" > /dev/null 2>&1; then
    print_warning "Package '$PACKAGE_NAME' already exists on npm"
    read -p "Continue with publish? (y/N): " continue_publish
    if [[ ! $continue_publish =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "Package name '$PACKAGE_NAME' is available"
fi

# Show what will be published
print_status "📋 Files that will be published:"
npm pack --dry-run

# Final confirmation
echo ""
print_warning "Ready to publish to npm!"
echo "Package: $PACKAGE_NAME"
echo "Version: $NEW_VERSION"
echo "Files: $(npm pack --dry-run | tail -n 1)"
echo ""
read -p "Proceed with publish? (y/N): " confirm_publish

if [[ ! $confirm_publish =~ ^[Yy]$ ]]; then
    print_status "Publish cancelled"
    exit 0
fi

# Publish to npm
print_status "📤 Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    print_success "🎉 Successfully published $PACKAGE_NAME@$NEW_VERSION to npm!"
    echo ""
    print_status "Next steps:"
    echo "  1. Visit: https://www.npmjs.com/package/$PACKAGE_NAME"
    echo "  2. Test installation: npm install -g $PACKAGE_NAME"
    echo "  3. Update documentation if needed"
    echo "  4. Create a git tag: git tag v$NEW_VERSION && git push origin v$NEW_VERSION"
else
    print_error "Failed to publish to npm"
    exit 1
fi 