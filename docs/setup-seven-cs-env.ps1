# Seven CS Environment Setup Script for Windows PowerShell
# This script helps you set up environment variables for the keystore

Write-Host "🔐 Setting up Seven CS Keystore Environment Variables" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if .env file exists
if (Test-Path "seven_cs\.env") {
    Write-Host "✅ .env file found in seven_cs\ directory" -ForegroundColor Green
    Write-Host "📝 Loading environment variables..." -ForegroundColor Yellow
    
    # Load environment variables from .env file
    Get-Content "seven_cs\.env" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $name = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    
    Write-Host "✅ Environment variables loaded" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found in seven_cs\ directory" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 To set up your environment:" -ForegroundColor Yellow
    Write-Host "1. Copy the example file: Copy-Item docs\SEVEN_CS_ENV_EXAMPLE.txt seven_cs\.env"
    Write-Host "2. Edit seven_cs\.env with your actual credentials"
    Write-Host "3. Run this script again"
    Write-Host ""
    Write-Host "⚠️  Make sure you have the keystore file at: seven_cs\seven_cs_release.keystore" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

# Verify environment variables are set
Write-Host ""
Write-Host "🔍 Verifying environment variables:" -ForegroundColor Cyan

$storePassword = [Environment]::GetEnvironmentVariable("SEVEN_CS_STORE_PASSWORD", "Process")
$keyAlias = [Environment]::GetEnvironmentVariable("SEVEN_CS_KEY_ALIAS", "Process")
$keyPassword = [Environment]::GetEnvironmentVariable("SEVEN_CS_KEY_PASSWORD", "Process")

Write-Host "SEVEN_CS_STORE_PASSWORD: $(if ($storePassword) { '✅ Set' } else { '❌ Not set' })"
Write-Host "SEVEN_CS_KEY_ALIAS: $(if ($keyAlias) { '✅ Set' } else { '❌ Not set' })"
Write-Host "SEVEN_CS_KEY_PASSWORD: $(if ($keyPassword) { '✅ Set' } else { '❌ Not set' })"

Write-Host ""
Write-Host "🚀 You can now build the release bundle:" -ForegroundColor Green
Write-Host "cd android; gradlew.bat bundleSeven_csRelease" -ForegroundColor Yellow

Read-Host "Press Enter to continue"
