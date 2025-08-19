# Seven CS Quick Reference

## 🚀 Quick Build Commands

### Build Release Bundle (Most Common)

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

### Build Release APK

**On macOS/Linux:**

```bash
cd android
./gradlew assembleSeven_csRelease
```

**On Windows:**

```cmd
cd android
gradlew.bat assembleSeven_csRelease
```

### Build Debug APK

**On macOS/Linux:**

```bash
cd android
./gradlew assembleSeven_csDebug
```

**On Windows:**

```cmd
cd android
gradlew.bat assembleSeven_csDebug
```

### Clean Build

**On macOS/Linux:**

```bash
cd android
./gradlew clean
./gradlew bundleSeven_csRelease
```

**On Windows:**

```cmd
cd android
gradlew.bat clean
gradlew.bat bundleSeven_csRelease
```

## 📱 Version Updates

**File**: `android/app/build.gradle`

```gradle
defaultConfig {
    versionCode 15        // Increment this
    versionName "1.0.14" // Update this
}
```

## 🔐 Keystore Info

- **File**: `seven_cs/seven_cs_release.keystore`
- **Credentials**: Set environment variables (see full guide)
- **Security**: No hardcoded passwords in source code
- **Note**: Never commit keystore files or .env files to version control

## 📁 Output Locations

- **Bundle**: `android/app/build/outputs/bundle/seven_csRelease/app-seven_cs-release.aab`
- **APK**: `android/app/build/outputs/apk/seven_cs/release/app-seven_cs-release.apk`

## ⚠️ Security

- **NEVER commit** the `seven_cs/` folder
- Keystore is already in `.gitignore`
- Keep keystore backup secure

## 🆘 Common Issues

| Error                             | Solution                         |
| --------------------------------- | -------------------------------- |
| "keystore password was incorrect" | Ask team for correct credentials |
| "Could not read key"              | Check keystore file exists       |
| "signed in debug mode"            | Use `seven_cs_release.keystore`  |

---

**Full Guide**: See `SEVEN_CS_RELEASE_GUIDE.md`
