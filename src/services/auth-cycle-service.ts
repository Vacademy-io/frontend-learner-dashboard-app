import { Preferences } from "@capacitor/preferences";
import {
    setTokenInStorage,
    setAuthorizationCookie,
    getTokenDecodedData
} from "@/lib/auth/sessionUtility";
import { TokenKey } from "@/constants/auth/tokens";
import { fetchAndStoreInstituteDetails } from "@/services/fetchAndStoreInstituteDetails";
import { fetchAndStoreStudentDetails } from "@/services/studentDetails";
import { getStudentDisplaySettings } from "@/services/student-display-settings";

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user?: {
        id: string;
        username: string;
        email: string;
        full_name: string;
        roles: string[];
    };
}

/**
 * Performs a complete authentication cycle:
 * 1. Stores access and refresh tokens in Preferences and Cookies.
 * 2. Decodes the token to find the User ID.
 * 3. Fetches and stores Institute and Student details in local storage.
 * 4. Loads student display settings for the dashboard.
 */
export const performFullAuthCycle = async (
    loginResponse: LoginResponse,
    instituteId: string
) => {
    console.log("[AuthCycle] Starting full auth cycle");

    // 1. Store tokens
    await setTokenInStorage(TokenKey.accessToken, loginResponse.accessToken);
    await setTokenInStorage(TokenKey.refreshToken, loginResponse.refreshToken);
    setAuthorizationCookie(TokenKey.accessToken, loginResponse.accessToken);
    setAuthorizationCookie(TokenKey.refreshToken, loginResponse.refreshToken);

    // 2. Decode token to get userId
    const decodedData = getTokenDecodedData(loginResponse.accessToken);
    const userId = decodedData?.user;

    if (userId) {
        console.log("[AuthCycle] Populating user and institute details for:", userId);

        // 3. Store InstituteId
        await Preferences.set({ key: "InstituteId", value: instituteId });
        await Preferences.set({ key: "instituteId", value: instituteId });

        // 4. Fetch and store institute & student details (crucial for dashboard)
        await fetchAndStoreInstituteDetails(instituteId, userId);

        // Pass the user object from loginResponse as a fallback if the API fails
        await fetchAndStoreStudentDetails(instituteId, userId, loginResponse.user);

        // 5. Load display settings
        try {
            await getStudentDisplaySettings(true, instituteId);
        } catch (e) {
            console.warn("[AuthCycle] Failed to load display settings:", e);
        }
    }

    console.log("[AuthCycle] Auth cycle complete");
};
