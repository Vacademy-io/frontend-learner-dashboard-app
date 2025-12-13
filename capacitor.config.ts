import type { CapacitorConfig } from "@capacitor/cli";
import { flavorConfig } from "./flavor.config";

// Get flavor from environment variable (default to SSDC)
const FLAVOR = process.env.VITE_FLAVOR || "io.vacademy.student.app";
const currentFlavor = flavorConfig[FLAVOR];

if (!currentFlavor) {
  throw new Error(`Invalid flavor: ${FLAVOR}. Available flavors: ${Object.keys(flavorConfig).join(", ")}`);
}

const config: CapacitorConfig = {
  // server: {
  //   url: "http://192.168.31.249:5173/",
  //   cleartext: true,
  // },

  appId: FLAVOR,
  appName: currentFlavor.appName,
  webDir: "dist",
  plugins: {
    PrivacyScreen: {
      enable: true,
      preventScreenshots: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
  },
  // server: {
  //   androidScheme: "https",
  //   iosScheme: "capacitor",
  //   allowNavigation: ["*"],
  // },
};

export default config;
