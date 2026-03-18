import { z } from "zod";
import { LOGIN_URL } from "@/constants/urls";
import { Storage } from "@capacitor/storage";
import { TokenKey } from "@/constants/auth/tokens";

// Define the request and response schemas using Zod
const loginRequestSchema = z.object({
    user_name: z.string(),
    password: z.string(),
    client_name: z.literal("ADMIN_PORTAL"),
    institute_id: z.string().uuid(),
});

export interface ActiveSession {
    session_id: string;
    device_type: string;
    ip_address: string;
    login_time: string;
    last_activity_time: string;
}

export interface LoginResponse {
    accessToken?: string;
    refreshToken?: string;
    instituteId?: string;
    session_limit_exceeded?: boolean;
    active_sessions?: ActiveSession[];
}

const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    instituteId: z.string(),
});

// Dummy login function
async function loginUser(
    username: string,
    password: string,
    convertToLowercase?: boolean | null,
): Promise<LoginResponse> {
    // Convert username and password to lowercase if flag is true
    const finalUsername = convertToLowercase === true ? username.toLowerCase() : username;
    const finalPassword = convertToLowercase === true ? password.toLowerCase() : password;

    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_name: finalUsername,
            password: finalPassword,
            client_name: "ADMIN_PORTAL",
        }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const tokenData: LoginResponse = await response.json();

    // If session limit exceeded, return early without saving tokens
    if (tokenData.session_limit_exceeded) {
        return tokenData;
    }

    // --- BUG FIX: Save tokens and instituteId to storage ---
    try {
        if (tokenData.accessToken) {
            await Storage.set({ key: TokenKey.accessToken, value: tokenData.accessToken });
        }
        if (tokenData.refreshToken) {
            await Storage.set({ key: TokenKey.refreshToken, value: tokenData.refreshToken });
        }
        if (tokenData.instituteId) {
            await Storage.set({ key: "instituteId", value: tokenData.instituteId });
        }
    } catch (error) {
        console.error("Error saving tokens to storage", error);
        // If we can't save tokens, the login is effectively failed.
        throw new Error("Failed to save session.");
    }

    return tokenData;
}

export { loginUser, loginRequestSchema, loginResponseSchema };
