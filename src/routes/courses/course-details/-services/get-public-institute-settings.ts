import axios from "axios";
import { BASE_URL } from "@/constants/urls";

export interface PublicInstituteSettings {
  courseDetails?: {
    tabs?: Array<{
      id: string;
      label: string;
      visible: boolean;
    }>;
    defaultTab?: string;
    courseOverview?: {
      visible: boolean;
    };
    ratingsAndReviewsVisible?: boolean;
    showCourseConfiguration?: boolean;
    showCourseContentPrefixes?: boolean;
  };
  signup?: {
    providers?: {
      google?: boolean;
      github?: boolean;
      usernamePassword?: boolean;
      emailOtp?: boolean;
      defaultProvider?: string;
    };
  };
}

export interface PublicInstituteDetails {
  id: string;
  institute_name: string;
  setting?: string;
  [key: string]: any;
}

// Default settings for course details when no settings are available
const DEFAULT_COURSE_DETAILS_SETTINGS: PublicInstituteSettings = {
  courseDetails: {
    tabs: [
      { id: "overview", label: "Overview", visible: true },
      { id: "content", label: "Content", visible: true },
      { id: "ratings", label: "Ratings & Reviews", visible: true }
    ],
    defaultTab: "overview",
    courseOverview: {
      visible: true
    },
    ratingsAndReviewsVisible: true,
    showCourseConfiguration: false,
    showCourseContentPrefixes: true
  }
};

/**
 * Parse institute settings from the setting string
 */
function parseInstituteSettings(settingsString: string): PublicInstituteSettings {
  try {
    if (!settingsString || settingsString.trim() === "") {
      return DEFAULT_COURSE_DETAILS_SETTINGS;
    }

    const settings = JSON.parse(settingsString);
    if (!settings || typeof settings !== "object") {
      return DEFAULT_COURSE_DETAILS_SETTINGS;
    }

    // Extract course details settings from STUDENT_DISPLAY_SETTINGS
    let courseDetailsSettings = null;
    if (settings.setting && typeof settings.setting === "object") {
      if (
        settings.setting.STUDENT_DISPLAY_SETTINGS &&
        settings.setting.STUDENT_DISPLAY_SETTINGS.data &&
        settings.setting.STUDENT_DISPLAY_SETTINGS.data.courseDetails
      ) {
        courseDetailsSettings = settings.setting.STUDENT_DISPLAY_SETTINGS.data.courseDetails;
      }
    }

    // Extract signup settings
    let signupSettings = null;
    if (settings.setting && typeof settings.setting === "object") {
      if (
        settings.setting.STUDENT_DISPLAY_SETTINGS &&
        settings.setting.STUDENT_DISPLAY_SETTINGS.data &&
        settings.setting.STUDENT_DISPLAY_SETTINGS.data.signup
      ) {
        signupSettings = settings.setting.STUDENT_DISPLAY_SETTINGS.data.signup;
      }
    }

    return {
      courseDetails: courseDetailsSettings || DEFAULT_COURSE_DETAILS_SETTINGS.courseDetails,
      signup: signupSettings
    };
  } catch (error) {
    console.warn("Failed to parse institute settings:", error);
    return DEFAULT_COURSE_DETAILS_SETTINGS;
  }
}

/**
 * Get institute details using the public API (no authentication required)
 */
export async function getPublicInstituteDetails(instituteId: string): Promise<PublicInstituteDetails> {
  try {
    const response = await axios.get(
      `${BASE_URL}/admin-core-service/public/institute/v1/details/${instituteId}`,
      {
        headers: {
          accept: "*/*",
        },
        timeout: 10000, // 10 second timeout
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch public institute details:", error);
    throw new Error("Failed to fetch institute details");
  }
}

/**
 * Get course details settings for logout state using public API
 */
export async function getPublicCourseDetailsSettings(
  instituteId: string
): Promise<PublicInstituteSettings & { _source?: string }> {
  try {
    
    const instituteDetails = await getPublicInstituteDetails(instituteId);
    const settings = parseInstituteSettings(instituteDetails.setting || "{}");
    
    
    return { ...settings, _source: 'PUBLIC_API' };
  } catch (error) {
    console.error(`❌ [Public Settings] Failed to fetch settings, using defaults`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      instituteId,
      source: 'DEFAULTS_FALLBACK'
    });
    
    return { ...DEFAULT_COURSE_DETAILS_SETTINGS, _source: 'DEFAULTS_FALLBACK' };
  }
}

/**
 * Get signup settings for logout state using public API
 */
export async function getPublicSignupSettings(
  instituteId: string
): Promise<{ providers?: any; _source?: string }> {
  try {
    const instituteDetails = await getPublicInstituteDetails(instituteId);
    const settings = parseInstituteSettings(instituteDetails.setting || "{}");
    
    return {
      providers: settings.signup?.providers || {
        google: true,
        github: true,
        usernamePassword: true,
        emailOtp: true,
        defaultProvider: "usernamePassword"
      },
      _source: 'PUBLIC_API'
    };
  } catch (error) {
    console.error("Failed to fetch signup settings:", error);
    return {
      providers: {
        google: true,
        github: true,
        usernamePassword: true,
        emailOtp: true,
        defaultProvider: "usernamePassword"
      },
      _source: 'DEFAULTS_FALLBACK'
    };
  }
}
