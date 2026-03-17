import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";
import { flavorConfig } from "../../flavor.config";

/**
 * Returns the web origin for the current native app flavor.
 * On native platforms, `window.location.origin` is `capacitor://localhost` (iOS) or
 * `http://localhost` (Android), which breaks OAuth redirects.
 * This function resolves the correct web domain from the flavor config.
 */
export const getNativeWebOrigin = async (): Promise<string> => {
  try {
    const appInfo = await App.getInfo();
    const config = flavorConfig[appInfo.id];
    if (config) {
      return `https://${config.subdomain}.${config.domain}`;
    }
  } catch {
    // Fall through to default
  }
  // Default fallback for the main Vacademy learner app
  return "https://learner.vacademy.io";
};

/**
 * Returns the correct origin for OAuth redirect URLs.
 * On web it returns `window.location.origin`.
 * On native (Android/iOS) it returns the app's web domain.
 */
export const getOAuthRedirectOrigin = async (): Promise<string> => {
  if (Capacitor.isNativePlatform()) {
    return getNativeWebOrigin();
  }
  return window.location.origin;
};

/**
 * Whether the current platform is a native Capacitor app.
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Opens an OAuth URL on native platforms using an in-app browser and
 * listens for the redirect back to the app via deep link (appUrlOpen).
 *
 * Returns a promise that resolves with the callback URL string when the
 * OAuth provider redirects back to the app.
 */
export const openNativeOAuth = (loginUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    let resolved = false;

    // Listen for the deep link redirect
    const listener = App.addListener("appUrlOpen", (event) => {
      if (resolved) return;
      const url = event.url;

      // Check if this is our OAuth callback
      if (
        url.includes("/login/oauth/learner") ||
        url.includes("/oauth-popup-handler.html")
      ) {
        resolved = true;
        listener.then((l) => l.remove());
        Browser.close().catch(() => {});
        resolve(url);
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        listener.then((l) => l.remove());
        Browser.close().catch(() => {});
        reject(new Error("OAuth timeout"));
      }
    }, 5 * 60 * 1000);

    // Open the OAuth URL in an in-app browser
    Browser.open({ url: loginUrl, presentationStyle: "popover" }).catch(
      (err) => {
        if (!resolved) {
          resolved = true;
          listener.then((l) => l.remove());
          reject(err);
        }
      }
    );
  });
};

/**
 * Parses token parameters from an OAuth callback URL.
 */
export const parseOAuthCallbackUrl = (
  url: string
): {
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  state: string | null;
  signupData: string | null;
  emailVerified: string | null;
} => {
  try {
    const urlObj = new URL(url);
    return {
      accessToken: urlObj.searchParams.get("accessToken"),
      refreshToken: urlObj.searchParams.get("refreshToken"),
      error: urlObj.searchParams.get("error"),
      state: urlObj.searchParams.get("state"),
      signupData: urlObj.searchParams.get("signupData"),
      emailVerified: urlObj.searchParams.get("emailVerified"),
    };
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
      error: null,
      state: null,
      signupData: null,
      emailVerified: null,
    };
  }
};
