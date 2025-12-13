# iOS Build Guide

This guide will walk you through creating an iOS build for any flavor/client of the app.

## Prerequisites

- macOS with Xcode installed
- Node.js and pnpm installed
- Capacitor CLI installed
- Apple Developer account (for distribution)

## Quick Build Steps

### 1. Configure Your Flavor

Edit `flavor.config.ts` to add or select your flavor:

```typescript
export const flavorConfig: FlavorConfigs = {
  "com.yourclient.app": {
    appName: "Your Client App Name",
    domain: "vacademy.io",
    subdomain: "yourclient",
  },
};
```

### 2. Set Environment Variable

Set the flavor you want to build:

```bash
export VITE_FLAVOR="com.yourclient.app"
```

**Available Flavors:**
- `io.vacademy.student.app` - SSDC Horizon
- `com.sevencs.learner` - the7cs

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Build the Web App

```bash
pnpm run build
```

This creates optimized production files in the `dist` folder.

### 5. Sync with Capacitor

```bash
npx cap sync ios
```

This copies the web assets to the iOS project and updates native dependencies.

### 6. Open Xcode

```bash
npx cap open ios
```

Or manually open:
```bash
open ios/App/App.xcworkspace
```

**Important:** Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

### 7. Configure in Xcode

1. **Select Target:**
   - For most builds: Select `App` target
   - For specific flavors: Select the corresponding target (e.g., `the7cs`)

2. **Select Device:**
   - Choose a simulator (e.g., iPhone 17 Pro)
   - Or connect a physical device

3. **Signing & Capabilities:**
   - Go to "Signing & Capabilities" tab
   - Select your Team
   - Xcode will automatically manage provisioning profiles

4. **Bundle Identifier:**
   - Verify it matches your flavor config (e.g., `com.sevencs.app`)
   - This is set automatically from `VITE_FLAVOR`

### 8. Build and Run

**For Testing (Simulator/Device):**
- Press `Cmd + R` or click the ▶️ Run button

**For App Store Distribution:**

1. Select "Any iOS Device (arm64)" as the destination
2. Go to: `Product` → `Archive`
3. Once archived, the Organizer window will open
4. Click `Distribute App`
5. Choose distribution method:
   - **App Store Connect** - For App Store submission
   - **Ad Hoc** - For testing on registered devices
   - **Enterprise** - For internal distribution
   - **Development** - For development testing

## Building for Different Flavors

### SSDC Horizon Build
```bash
export VITE_FLAVOR="io.vacademy.student.app"
pnpm run build
npx cap sync ios
npx cap open ios
```

### The 7Cs Build
```bash
export VITE_FLAVOR="com.sevencs.app"
pnpm run build
npx cap sync ios
npx cap open ios
```

### Custom Client Build
```bash
# 1. Add your flavor to flavor.config.ts
# 2. Set the environment variable
export VITE_FLAVOR="com.newclient.app"
pnpm run build
npx cap sync ios
npx cap open ios
```

## Troubleshooting

### Issue: "No such process" error
**Solution:**
```bash
# Kill existing processes
killall Simulator
killall Xcode

# Resync
npx cap sync ios
npx cap open ios
```

### Issue: Pod install fails
**Solution:**
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
npx cap sync ios
```

### Issue: Build fails with signing errors
**Solution:**
1. Go to Xcode → Preferences → Accounts
2. Add your Apple ID
3. Download Manual Profiles
4. In project settings, select your team and enable "Automatically manage signing"

### Issue: White screen on launch
**Solution:**
```bash
# Clear cache and rebuild
pnpm run build
npx cap sync ios
# Then rebuild in Xcode
```

### Issue: Wrong app name/icon showing
**Solution:**
- Verify `VITE_FLAVOR` is set correctly
- Clean build folder: `Product` → `Clean Build Folder` (Cmd + Shift + K)
- Rebuild the app

## Quick Reference

### Essential Commands
```bash
# Install dependencies
pnpm install

# Build web app
pnpm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Full rebuild
pnpm run build && npx cap sync ios && npx cap open ios
```

### File Locations
- **Flavor Config:** `flavor.config.ts` (root directory)
- **Capacitor Config:** `capacitor.config.ts` (auto-reads from flavor.config.ts)
- **iOS Project:** `ios/App/App.xcworkspace`
- **Web Assets:** `dist/` → copied to `ios/App/App/public/`

## Development vs Production

### Development Build
```bash
# Use local dev server
pnpm run dev

# In another terminal
npx cap run ios
```

### Production Build
```bash
# Build optimized assets
pnpm run build

# Sync and open
npx cap sync ios
npx cap open ios
```

## Adding a New Flavor

1. **Edit `flavor.config.ts`:**
```typescript
"com.newclient.app": {
  appName: "New Client Name",
  domain: "vacademy.io",
  subdomain: "newclient",
},
```

2. **Set and build:**
```bash
export VITE_FLAVOR="com.newclient.app"
pnpm run build
npx cap sync ios
```

3. **Create iOS target (if needed for separate binary):**
   - In Xcode, duplicate existing target
   - Update bundle identifier
   - Configure signing

## Notes

- Always use `pnpm` instead of `npm` for this project
- The `VITE_FLAVOR` environment variable determines which app configuration is used
- Default flavor is `io.vacademy.student.app` if not specified
- Changes to `flavor.config.ts` require a rebuild
- iOS builds require macOS and Xcode
- YouTube videos will play with original audio (no translation)

## Support

For issues or questions:
1. Check Xcode build logs
2. Review Capacitor console output
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed

---

**Last Updated:** December 13, 2025
