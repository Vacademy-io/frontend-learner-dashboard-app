# Seven CS App Release Guide

This guide helps developers release new versions of the Seven CS app for Android.

## Prerequisites

- Android Studio or command line tools
- Java Development Kit (JDK)
- Gradle build tools
- Access to the project repository

## Security Notice ⚠️

**IMPORTANT**: The `seven_cs/` folder contains sensitive keystore files and should NEVER be committed to version control.

## Setup

### 1. Keystore Configuration

The app uses a release keystore located at `seven_cs/seven_cs_release.keystore`.

**⚠️ IMPORTANT**: The keystore credentials are sensitive information and are not stored in this repository. You need to:

1. **Ask the development team** for the keystore file and credentials
2. **Place the keystore file** at the following path:
   ```
   seven_cs/seven_cs_release.keystore
   ```
3. **Get the credentials** from the team:
   - Store Password
   - Key Alias
   - Key Password

**Note**: Never commit the keystore file or credentials to version control!

### 1.1 Setting Up the Keystore File

Once you receive the keystore file from the development team:

1. **Create the directory** (if it doesn't exist):

   ```bash
   mkdir -p seven_cs
   ```

2. **Place the keystore file** at the exact path:

   ```
   seven_cs/seven_cs_release.keystore
   ```

3. **Verify the file exists**:

   **On macOS/Linux:**

   ```bash
   ls -la seven_cs/seven_cs_release.keystore
   ```

   **On Windows (Command Prompt):**

   ```cmd
   dir seven_cs\seven_cs_release.keystore
   ```

4. **Set up environment variables** (Secure approach):

   **On macOS/Linux:**

   ```bash
   # Copy the example file
   cp docs/SEVEN_CS_ENV_EXAMPLE.txt seven_cs/.env

   # Edit the .env file with actual credentials
   nano seven_cs/.env
   # OR use any text editor you prefer
   ```

   **On Windows (Command Prompt):**

   ```cmd
   # Copy the example file
   copy docs\SEVEN_CS_ENV_EXAMPLE.txt seven_cs\.env

   # Edit the .env file with actual credentials
   notepad seven_cs\.env
   # OR use any text editor you prefer
   ```

   **Example .env content:**

   ```bash
   SEVEN_CS_STORE_PASSWORD=actual_password_here
   SEVEN_CS_KEY_ALIAS=actual_alias_here
   SEVEN_CS_KEY_PASSWORD=actual_password_here
   ```

5. **Verify environment variables** are set:

   **On macOS/Linux:**

   ```bash
   echo $SEVEN_CS_STORE_PASSWORD
   echo $SEVEN_CS_KEY_ALIAS
   echo $SEVEN_CS_KEY_PASSWORD
   ```

   **On Windows (Command Prompt):**

   ```cmd
   echo %SEVEN_CS_STORE_PASSWORD%
   echo %SEVEN_CS_KEY_ALIAS%
   echo %SEVEN_CS_KEY_PASSWORD%
   ```

6. **Use the helper script** (Optional but recommended):

   **On macOS/Linux:**

   ```bash
   # Run the setup script to verify everything is configured
   ./docs/setup-seven-cs-env.sh
   ```

   **On Windows (Command Prompt):**

   ```cmd
   # Run the setup script to verify everything is configured
   docs\setup-seven-cs-env.bat
   ```

### 2. Git Ignore Configuration

Ensure the following is added to your `.gitignore` file:

```gitignore
# Seven CS Keystore (Sensitive - Never commit!)
seven_cs/
```

## Version Management

### Updating Version Information

Before building a release, update the version information in `android/app/build.gradle`:

```gradle
defaultConfig {
    // ... other config
    versionCode 15        // Increment this number
    versionName "1.0.14" // Update this version string
}
```

**Version Code Rules:**

- Must be a positive integer
- Must be incremented for each release
- Cannot be decreased
- Used by Google Play Store for version comparison

**Version Name Rules:**

- Human-readable version string
- Follow semantic versioning (e.g., "1.0.14", "2.1.0")
- Can be any string format

## Build Commands

### Build APK (Debug)

**On macOS/Linux:**

```bash
# Navigate to android directory
cd android

# Build debug APK for seven_cs
./gradlew assembleSeven_csDebug

# Output: app/build/outputs/apk/seven_cs/debug/app-seven_cs-debug.apk
```

**On Windows:**

```cmd
# Navigate to android directory
cd android

# Build debug APK for seven_cs
gradlew.bat assembleSeven_csDebug

# Output: app\build\outputs\apk\seven_cs\debug\app-seven_cs-debug.apk
```

### Build APK (Release)

**On macOS/Linux:**

```bash
# Navigate to android directory
cd android

# Build release APK for seven_cs
./gradlew assembleSeven_csRelease

# Output: app/build/outputs/apk/seven_cs/release/app-seven_cs-release.apk
```

**On Windows:**

```cmd
# Navigate to android directory
cd android

# Build release APK for seven_cs
gradlew.bat assembleSeven_csRelease

# Output: app\build\outputs\apk\seven_cs\release\app-seven_cs-release.apk
```

### Build Bundle (Release) - Recommended for Play Store

**On macOS/Linux:**

```bash
# Navigate to android directory
cd android

# Build release bundle for seven_cs
./gradlew bundleSeven_csRelease

# Output: app/build/outputs/bundle/seven_csRelease/app-seven_cs-release.aab
```

**On Windows:**

```cmd
# Navigate to android directory
cd android

# Build release bundle for seven_cs
gradlew.bat bundleSeven_csRelease

# Output: app\build\outputs\bundle\seven_csRelease\app-seven_cs-release.aab
```

### Clean Build

**On macOS/Linux:**

```bash
# Clean previous builds
./gradlew clean

# Then build again
./gradlew bundleSeven_csRelease
```

**On Windows:**

```cmd
# Clean previous builds
gradlew.bat clean

# Then build again
gradlew.bat bundleSeven_csRelease
```

## Release Process

### 1. Pre-Release Checklist

- [ ] Update version code and version name in `build.gradle`
- [ ] Test the app thoroughly
- [ ] Ensure all features are working
- [ ] Check that the keystore file exists and is accessible

### 2. Build Release Bundle

**On macOS/Linux:**

```bash
cd android
./gradlew bundleSeven_csRelease
```

**On Windows:**

```cmd
cd android
gradlew.bat bundleSeven_csRelease
```

### 3. Verify Build Output

Check that the bundle was created successfully:

**On macOS/Linux:**

```bash
ls -la app/build/outputs/bundle/seven_csRelease/
```

**On Windows (Command Prompt):**

```cmd
dir app\build\outputs\bundle\seven_csRelease\
```

You should see: `app-seven_cs-release.aab`

### 4. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to "Production" → "Create new release"
4. Upload the `.aab` file from `app/build/outputs/bundle/seven_csRelease/`
5. Add release notes
6. Review and roll out

## Troubleshooting

### Common Build Errors

#### 1. Keystore Not Found

```
> Could not read key seven_cs from keystore
```

**Solution**: Ensure the keystore file exists at `seven_cs/seven_cs_release.keystore`

#### 2. Wrong Password

```
> keystore password was incorrect
```

**Solution**: Verify the environment variables are set correctly:

```bash
echo $SEVEN_CS_STORE_PASSWORD
echo $SEVEN_CS_KEY_ALIAS
echo $SEVEN_CS_KEY_PASSWORD
```

#### 3. Debug Mode Error

```
> You uploaded an APK or Android App Bundle that was signed in debug mode
```

**Solution**: Ensure you're using the release keystore (`seven_cs_release.keystore`) and not the debug keystore

### Build Verification

To verify your bundle is properly signed:

**On macOS/Linux:**

```bash
# Check bundle signature
jarsigner -verify -verbose -certs app/build/outputs/bundle/seven_csRelease/app-seven_cs-release.aab
```

**On Windows:**

```cmd
# Check bundle signature
jarsigner -verify -verbose -certs app\build\outputs\bundle\seven_csRelease\app-seven_cs-release.aab
```

### Cross-Platform Common Issues

#### 1. Path Separators

- **macOS/Linux**: Use forward slashes `/` in paths
- **Windows**: Use backslashes `\` in paths (or forward slashes work too)

#### 2. Gradle Wrapper

- **macOS/Linux**: Use `./gradlew`
- **Windows**: Use `gradlew.bat`

#### 3. Environment Variables

- **macOS/Linux**: Use `$VARIABLE_NAME`
- **Windows Command Prompt**: Use `%VARIABLE_NAME%`

## File Structure

```
project-root/
├── android/
│   └── app/
│       └── build.gradle          # Version and signing config
├── seven_cs/                     # ⚠️ NEVER COMMIT THIS FOLDER
│   └── seven_cs_release.keystore
└── docs/
    └── SEVEN_CS_RELEASE_GUIDE.md # This file
```

## Additional Notes

- **Keystore Backup**: Keep a secure backup of your keystore file. Losing it means you can't update your app.
- **Password Security**: Store keystore passwords securely. Consider using environment variables for production builds.
- **Testing**: Always test release builds before uploading to Play Store.
- **Rollback**: If issues are found after release, you can roll back to a previous version in Play Console.

## Support

If you encounter issues during the release process:

1. Check this guide first
2. Review the build output for specific error messages
3. Ensure all prerequisites are met
4. Contact the development team for assistance

---

**Last Updated**: August 19, 2025  
**Maintainer**: Team
