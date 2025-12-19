import type { CapacitorConfig } from "@capacitor/cli";
import { flavorConfig } from "./flavor.config";

const FLAVOR = process.env.VITE_FLAVOR || "io.vacademy.student.app";
const currentFlavor = flavorConfig[FLAVOR];

if (!currentFlavor) {
  throw new Error(`Invalid flavor: ${FLAVOR}`);
}

// Check if we are in "Live Reload" mode (Dev only)
// You can set this env var in your package.json script: "start:android": "LIVE_RELOAD=true cap run android"
const isLiveReload = process.env.LIVE_RELOAD === "true";

// If using live reload, decide if you want Local IP or Live Domain
// Ideally, use Local IP for speed, but Domain works too.
const liveUrl = `https://${currentFlavor.subdomain}.${currentFlavor.domain}`;

const config: CapacitorConfig = {
  appId: FLAVOR,
  appName: currentFlavor.appName,
  webDir: "dist",

  server: {
    // CRITICAL: In production (isLiveReload = false), this MUST be undefined.
    // If undefined, Capacitor loads the 'index.html' from the local device.
    url: isLiveReload ? liveUrl : undefined,
    hostname: currentFlavor.domain, // Ensure verified domain for cleaner origin check 

    iosScheme: "https",
    allowNavigation: [
      "youtube.com",
      "*.youtube.com",
      "*.googlevideo.com",
      "youtu.be",
      "neerajhariyale.github.io",
      // Add your own domain to allow navigation if needed
      currentFlavor.domain,
      `*.${currentFlavor.domain}`
    ],
  },

  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
  },
};

export default config;