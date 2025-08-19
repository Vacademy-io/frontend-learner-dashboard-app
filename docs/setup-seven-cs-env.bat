@echo off
REM Seven CS Environment Setup Script for Windows Command Prompt
REM This script helps you set up environment variables for the keystore

echo 🔐 Setting up Seven CS Keystore Environment Variables
echo ==================================================

REM Check if .env file exists
if exist "seven_cs\.env" (
    echo ✅ .env file found in seven_cs\ directory
    echo 📝 Loading environment variables...
    
    REM Load environment variables from .env file
    for /f "tokens=1,2 delims==" %%a in (seven_cs\.env) do (
        set %%a=%%b
    )
    
    echo ✅ Environment variables loaded
) else (
    echo ❌ .env file not found in seven_cs\ directory
    echo.
    echo 📋 To set up your environment:
    echo 1. Copy the example file: copy docs\SEVEN_CS_ENV_EXAMPLE.txt seven_cs\.env
    echo 2. Edit seven_cs\.env with your actual credentials
    echo 3. Run this script again
    echo.
    echo ⚠️  Make sure you have the keystore file at: seven_cs\seven_cs_release.keystore
    pause
    exit /b 1
)

REM Verify environment variables are set
echo.
echo 🔍 Verifying environment variables:
if defined SEVEN_CS_STORE_PASSWORD (
    echo SEVEN_CS_STORE_PASSWORD: ✅ Set
) else (
    echo SEVEN_CS_STORE_PASSWORD: ❌ Not set
)

if defined SEVEN_CS_KEY_ALIAS (
    echo SEVEN_CS_KEY_ALIAS: ✅ Set
) else (
    echo SEVEN_CS_KEY_ALIAS: ❌ Not set
)

if defined SEVEN_CS_KEY_PASSWORD (
    echo SEVEN_CS_KEY_PASSWORD: ✅ Set
) else (
    echo SEVEN_CS_KEY_PASSWORD: ❌ Not set
)

echo.
echo 🚀 You can now build the release bundle:
echo cd android ^&^& gradlew.bat bundleSeven_csRelease
pause
