#!/bin/bash

# FoodLog EAS Build Script
# Run this to build for both iOS and Android

set -e

echo "🍳 FoodLog Build Script"
echo "======================"

# Check if logged in to EAS
if ! eas whoami &> /dev/null; then
    echo "⚠️  Not logged in to EAS. Please login with: eas login"
    exit 1
fi

# Check for required files
echo "📁 Checking required files..."
required_files=(
    "app.json"
    "eas.json"
    "package.json"
    "assets/icon.png"
    "assets/splash.png"
    "assets/adaptive-icon.png"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
done
echo "✅ All required files present"

# Build iOS
echo ""
echo "📱 Building for iOS..."
read -p "Build for iOS? (y/n) " ios_response
if [[ "$ios_response" =~ ^[Yy]$ ]]; then
    eas build --platform ios --profile production
fi

# Build Android
echo ""
echo "🤖 Building for Android..."
read -p "Build for Android? (y/n) " android_response
if [[ "$android_response" =~ ^[Yy]$ ]]; then
    eas build --platform android --profile production
fi

echo ""
echo "✨ Build script complete!"
echo ""
echo "Next steps:"
echo "  - Check build status: eas build:list"
echo "  - Submit to stores: eas submit --platform ios/android"