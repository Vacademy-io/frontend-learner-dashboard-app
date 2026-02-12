import axios from "axios";
import { RESOLVE_SHORT_LINK } from "@/constants/urls";

/**
 * Service specifically for resolving short links via Media Service.
 */
export const MediaService = {
    /**
     * Resolves a short code to its destination URL.
     * @param code The short code (e.g. 'VV6nrE')
     * @returns The destination URL if found, or throws an error.
     */
    resolveShortLink: async (code: string): Promise<string> => {
        console.log(`[MediaService] Starting resolution for code: ${code}`);
        try {
            const url = `${RESOLVE_SHORT_LINK}/${code}`;
            console.log(`[MediaService] Calling URL: ${url}`);

            const response = await axios.get(url);

            console.log("[MediaService] Response received:", {
                status: response.status,
                type: typeof response.data,
                data: response.data
            });

            // Handle multiple response formats (plain text URL or JSON object)
            const data = response.data;
            let resultUrl = '';

            if (typeof data === 'string') {
                if (data.startsWith('http') || data.startsWith('/')) {
                    resultUrl = data;
                } else {
                    console.warn("[MediaService] Response is string but not a URL:", data);
                    resultUrl = data; // Fallback
                }
            } else if (typeof data === 'object' && data !== null) {
                if (data.destination_url) {
                    resultUrl = data.destination_url;
                } else if (data.url) {
                    resultUrl = data.url;
                } else {
                    console.warn("[MediaService] Response is object but missing destination_url:", data);
                    // Fallback: maybe the entire data? No, probably empty string or throw
                }
            } else {
                console.warn("[MediaService] Unexpected response type:", typeof data);
            }

            console.log(`[MediaService] Resolved URL: ${resultUrl}`);
            return resultUrl;
        } catch (error: any) {
            console.error("[MediaService] Error resolving short link:", error);
            if (error.response) {
                console.error("[MediaService] Error response status:", error.response.status);
                console.error("[MediaService] Error response data:", error.response.data);
            } else if (error.request) {
                console.error("[MediaService] No response received:", error.request);
            } else {
                console.error("[MediaService] Error setting up request:", error.message);
            }
            throw error;
        }
    }
};
