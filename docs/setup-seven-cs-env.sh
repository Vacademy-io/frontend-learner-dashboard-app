#!/bin/bash

# Seven CS Environment Setup Script
# This script helps you set up environment variables for the keystore

echo "🔐 Setting up Seven CS Keystore Environment Variables"
echo "=================================================="

# Check if .env file exists
if [ -f "seven_cs/.env" ]; then
    echo "✅ .env file found in seven_cs/ directory"
    echo "📝 Loading environment variables..."
    export $(cat seven_cs/.env | xargs)
    echo "✅ Environment variables loaded"
else
    echo "❌ .env file not found in seven_cs/ directory"
    echo ""
    echo "📋 To set up your environment:"
    echo "1. Copy the example file: cp docs/SEVEN_CS_ENV_EXAMPLE.txt seven_cs/.env"
    echo "2. Edit seven_cs/.env with your actual credentials"
    echo "3. Run this script again"
    echo ""
    echo "⚠️  Make sure you have the keystore file at: seven_cs/seven_cs_release.keystore"
    exit 1
fi

# Verify environment variables are set
echo ""
echo "🔍 Verifying environment variables:"
echo "SEVEN_CS_STORE_PASSWORD: ${SEVEN_CS_STORE_PASSWORD:+✅ Set}"
echo "SEVEN_CS_KEY_ALIAS: ${SEVEN_CS_KEY_ALIAS:+✅ Set}"
echo "SEVEN_CS_KEY_PASSWORD: ${SEVEN_CS_KEY_PASSWORD:+✅ Set}"

echo ""
echo "🚀 You can now build the release bundle:"
echo "cd android && ./gradlew bundleSeven_csRelease"
