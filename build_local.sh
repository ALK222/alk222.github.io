#!/bin/bash

echo "🔧 Building token module for GitHub API..."

# Check if .env exists
if [ -f .env ]; then
    source .env
    if [ -n "$GITHUB_TOKEN" ]; then
        # Create token module for ES6 import
        cat > js/token.js << EOF
// Auto-generated token module
export const GITHUB_TOKEN = '$GITHUB_TOKEN';
EOF
        echo "✅ Successfully built js/token.js with token"
    else
        echo "❌ GITHUB_TOKEN is empty in .env file"
        # Create empty token module
        cat > js/token.js << 'EOF'
// No token available
export const GITHUB_TOKEN = undefined;
EOF
    fi
else
    echo "⚠️  No .env file found - building without token"
    # Create empty token module
    cat > js/token.js << 'EOF'
// No token available
export const GITHUB_TOKEN = undefined;
EOF
fi