import { Capacitor } from '@capacitor/core';
import { flavorConfig } from '../../flavor.config'; // Path adjust karlena agar zarurat ho

export const getAppConfig = () => {
  // 🔥 CHANGE HERE: Default changed to 7Cs ("com.sevencs.learner")
  const currentFlavorKey = import.meta.env.VITE_FLAVOR || "com.sevencs.learner";
  
  const config = flavorConfig[currentFlavorKey];

  // Safety Check
  if (!config) {
    console.error("Flavor config not found for:", currentFlavorKey);
    // Fallback to avoid crash
    return {
      subdomain: "7cs",
      domain: "vacademy.io",
      isNative: Capacitor.isNativePlatform()
    };
  }

  // 1. Native App (iOS/Android)
  if (Capacitor.isNativePlatform()) {
    return {
      subdomain: config.subdomain, // Returns "7cs"
      domain: config.domain,
      isNative: true
    };
  }

  // 2. Web Browser
  const host = window.location.hostname;
  const parts = host.split('.');
  
  // Localhost (Dev mode)
  if (host.includes('localhost')) {
     return {
      subdomain: config.subdomain,
      domain: config.domain,
      isNative: false
    };
  }

  // Production Web
  return {
    subdomain: parts[0], 
    domain: parts.slice(1).join('.'),
    isNative: false
  };
};