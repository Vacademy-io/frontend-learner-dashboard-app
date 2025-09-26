import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { setToStorage } from "@/components/common/auth/login/forms/page/login-form";
import {
  getTokenDecodedData,
  setTokenInStorage,
} from "@/lib/auth/sessionUtility";
import { TokenKey } from "@/constants/auth/tokens";
import { fetchAndStoreInstituteDetails } from "@/services/fetchAndStoreInstituteDetails";
import { fetchAndStoreStudentDetails } from "@/services/studentDetails";
import { useTheme } from "@/providers/theme/theme-provider";
import { DashboardLoader } from "@/components/core/dashboard-loader";
import { createFileRoute } from "@tanstack/react-router";
import { getStudentDisplaySettings } from "@/services/student-display-settings";
import { getCurrentDomainInfo, resolveDomainRouting } from "@/services/domain-routing";

export const Route = createFileRoute("/login/oauth/modal-learner")({
  component: ModalOAuthRedirectHandler,
});

function ModalOAuthRedirectHandler() {
  const navigate = useNavigate();
  const { setPrimaryColor } = useTheme();

  useEffect(() => {
    handleModalOAuthCallback(navigate, setPrimaryColor);
  }, [navigate, setPrimaryColor]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <DashboardLoader />
    </div>
  );
}

const handleModalOAuthCallback = async (
  navigate: ReturnType<typeof useNavigate>,
  setPrimaryColor: (color: string) => void
) => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  const error = urlParams.get("error");
  const state = urlParams.get("state");
  const signupData = urlParams.get("signupData");
  const emailVerified = urlParams.get("emailVerified");
  
   
  // Parse state to get redirect information
  let redirectTo = "/dashboard";
  let currentUrl = "";
  let type = "";
  let courseId = "";
  let instituteId = "";
   
  if (state) {
    try {
      // Check if state needs URL decoding first
      let decodedState;
      try {
        decodedState = atob(state);
      } catch {
        const urlDecodedState = decodeURIComponent(state);
        decodedState = atob(urlDecodedState);
      }
      
      const stateObj = JSON.parse(decodedState);
      
      
      redirectTo = stateObj.redirectTo || "/dashboard";
      currentUrl = stateObj.currentUrl || "";
      type = stateObj.type || "";
      courseId = stateObj.courseId || "";
      instituteId = stateObj.instituteId || "";
      
    } catch (parseError) {
    }
  }

  // Try to get data from sessionStorage first (new approach)
  const storedModalData = sessionStorage.getItem('modal_oauth_data');
   
  if (storedModalData) {
    try {
      const modalData = JSON.parse(storedModalData);
      
      
      // Use data from sessionStorage
      redirectTo = modalData.redirectTo || redirectTo;
      currentUrl = modalData.currentUrl || currentUrl;
      type = modalData.type || type;
      courseId = modalData.courseId || courseId;
      instituteId = modalData.instituteId || instituteId;
      
    } catch (parseError) {
    }
  }

  // If instituteId is still not available, try to get it from domain routing
  if (!instituteId) {
    try {
      const domainInfo = await getCurrentDomainInfo();
      if (domainInfo) {
        const domainRouting = await resolveDomainRouting(domainInfo.domain, domainInfo.subdomain);
        if (domainRouting) {
          instituteId = domainRouting.instituteId;
        }
      }
    } catch (error) {
    }
  }

  if (error) {
    // Check if we have signup data (user exists but needs to signup)
    const signupDataParam = urlParams.get("signupData");
    const emailVerifiedParam = urlParams.get("emailVerified");
    
    
    if (signupDataParam) {
      try {
        const decodedSignupData = JSON.parse(atob(signupDataParam));
        
        // Add institute ID to signup data if missing and we have it from state/sessionStorage
        if (!decodedSignupData.institute_id && instituteId) {
          decodedSignupData.institute_id = instituteId;
          
          // Re-encode the updated signup data
          const updatedSignupData = btoa(JSON.stringify(decodedSignupData));
          
          // Update the URL parameter (for debugging/logging purposes)
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('signupData', updatedSignupData);
        }
      } catch (error) {
      }
    }
    
    if (signupDataParam && emailVerifiedParam === "true") {
    } else {
    }
    
    // For modal login, send error message and signup modal message to parent tab
    try {
      // Try to send messages to parent tab
      if (window.opener && !window.opener.closed) {
        // First, send error message for user feedback
        const errorMessage = signupData && emailVerified === "true" 
          ? "Account not found. Please sign up to continue."
          : "Account not found. Please sign up to continue.";
          
        window.opener.postMessage({
          action: 'oauth_complete',
          success: false,
          error: errorMessage
        }, window.location.origin);
        
        // Then send message to open signup modal after a short delay
        setTimeout(() => {
          // Prepare signup data with institute ID if available
          let signupDataWithInstituteId = null;
          if (signupDataParam) {
            try {
              const decodedSignupData = JSON.parse(atob(signupDataParam));
              // Add institute ID if missing
              if (!decodedSignupData.institute_id && instituteId) {
                decodedSignupData.institute_id = instituteId;
              }
              signupDataWithInstituteId = decodedSignupData;
            } catch (error) {
            }
          }
          
          const signupModalData = {
            action: 'openSignupModal',
            type: type || '',
            courseId: courseId || '',
            instituteId: instituteId || '',
            fromOAuth: true,
            signupData: signupDataWithInstituteId // Include signup data with institute ID
          };
          
          window.opener.postMessage(signupModalData, window.location.origin);
        }, 500);
        
        
        // Close this popup after sending messages (allow time for both messages to be processed)
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        // Fallback: redirect to signup page with parameters
        const signupUrl = new URL(window.location.origin + "/signup");
        signupUrl.searchParams.set("openModal", "true");
        signupUrl.searchParams.set("type", type || "");
        signupUrl.searchParams.set("courseId", courseId || "");
        // Remove instituteId from URL to avoid exposing it
        // signupUrl.searchParams.set("instituteId", instituteId || "");
        signupUrl.searchParams.set("fromOAuth", "true");
        
        window.location.href = signupUrl.toString();
      }
    } catch (error) {
      // Error communicating with parent tab
    }
    return;
  }

  if (accessToken && refreshToken) {
    
    try {
      await setToStorage("accessToken", accessToken);
      await setToStorage("refreshToken", refreshToken);
      await setTokenInStorage(TokenKey.accessToken, accessToken);
      await setTokenInStorage(TokenKey.refreshToken, refreshToken);

      await handleModalSuccessfulLogin(
        accessToken,
        refreshToken,
        navigate,
        setPrimaryColor,
        redirectTo,
        currentUrl,
        type,
        courseId,
        instituteId
      );
    } catch (error) {
      // Failed to store authentication tokens
    }
  } else {
    // Don't show toast in popup - send error message to parent window instead
    // Send error message to parent window and close popup
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage({
        action: 'oauth_complete',
        success: false,
        error: 'Authentication failed. Please try logging in again.'
      }, window.location.origin);
    }
    setTimeout(() => window.close(), 1000);
  }
};

const handleModalSuccessfulLogin = async (
  accessToken: string,
  refreshToken: string,
  navigate: ReturnType<typeof useNavigate>,
  setPrimaryColor?: (color: string) => void,
  redirectTo?: string,
  currentUrl?: string,
  type?: string,
  courseId?: string,
  instituteId?: string
) => {
  
  try {
    const decodedData = getTokenDecodedData(accessToken);
    const authorities = decodedData?.authorities;
    const userId = decodedData?.user;


    const authorityKeys = authorities ? Object.keys(authorities) : [];

    if (!userId || authorityKeys.length === 0) {
      toast.error("Invalid user or institute data.");
      // Send error message to parent window and close popup
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({
          action: 'oauth_complete',
          success: false,
          error: 'Invalid user or institute data.'
        }, window.location.origin);
      }
      setTimeout(() => window.close(), 1000);
      return;
    }

    // If instituteId is provided, check if user is enrolled in that institute
    if (instituteId) {
      
      if (authorityKeys.includes(instituteId)) {
        // User is enrolled in the specified institute
        const details = await fetchAndStoreInstituteDetails(instituteId, userId);
        if (setPrimaryColor) {
          setPrimaryColor(details?.institute_theme_code ?? "#E67E22");
        }
        await fetchAndStoreStudentDetails(instituteId, userId);

        // Use dynamic redirection logic (same as signup flow)
        await handleDynamicRedirection(window.opener, currentUrl, redirectTo);
      } else {
        // User is not enrolled in the specified institute
        toast.error("You are not enrolled in this institute.");
        // Send error message to parent window and close popup
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({
            action: 'oauth_complete',
            success: false,
            error: 'You are not enrolled in this institute.'
          }, window.location.origin);
        }
        setTimeout(() => window.close(), 1000);
      }
    } else {
      // No instituteId provided, use the first available institute
      const firstInstituteId = authorityKeys[0];
      
      const details = await fetchAndStoreInstituteDetails(firstInstituteId, userId);
      if (setPrimaryColor) {
        setPrimaryColor(details?.institute_theme_code ?? "#E67E22");
      }
      await fetchAndStoreStudentDetails(firstInstituteId, userId);

      // Use dynamic redirection logic (same as signup flow)
      await handleDynamicRedirection(window.opener, currentUrl, redirectTo);
    }
  } catch (error) {
    // Error in modal successful login
  } finally {
    // Clean up sessionStorage after processing is complete
    sessionStorage.removeItem('modal_oauth_data');
  }
};

// Dynamic redirection logic (same as signup flow)
const handleDynamicRedirection = async (
  opener: Window | null,
  currentUrl?: string,
  fallbackRedirect?: string
) => {
  try {
    // 1. Fetch student display settings (same as signup flow)
    const studentSettings = await getStudentDisplaySettings(true);
    
    // 2. Determine the final redirect route
    let finalRedirectRoute = "/dashboard";
    
    // Priority order:
    // 1. Backend postLoginRedirectRoute (highest priority) - but clean it first
    if (studentSettings?.postLoginRedirectRoute) {
      finalRedirectRoute = cleanUrlOfSensitiveData(studentSettings.postLoginRedirectRoute);
    }
    // 2. Fallback redirect from state (this is the cleaned studyLibraryUrl)
    else if (fallbackRedirect && fallbackRedirect !== "/dashboard") {
      finalRedirectRoute = fallbackRedirect;
    }
    // 3. NEVER use currentUrl for redirection as it may contain sensitive data
    // Instead, construct a safe route based on type and courseId
    


    // Send success message to parent window with redirect information
    if (opener && !opener.closed) {
      opener.postMessage({
        action: 'oauth_complete',
        success: true,
        redirectTo: finalRedirectRoute,
        backendRoute: studentSettings?.postLoginRedirectRoute,
        currentUrl: currentUrl
      }, window.location.origin);
    }
    
    // Close popup after sending message
    setTimeout(() => window.close(), 500);
    
  } catch (error) {
    // Error in dynamic redirection
  }
};

// Helper function to clean URLs of sensitive data
const cleanUrlOfSensitiveData = (url: string): string => {
  try {
    const urlObj = new URL(url, window.location.origin);
    
    // Remove sensitive parameters
    urlObj.searchParams.delete("instituteId");
    urlObj.searchParams.delete("accessToken");
    urlObj.searchParams.delete("refreshToken");
    urlObj.searchParams.delete("state");
    
    // Keep only safe parameters
    const safeParams = new URLSearchParams();
    for (const [key, value] of urlObj.searchParams.entries()) {
      if (key === "type" || key === "courseId" || key === "fromOAuth") {
        safeParams.set(key, value);
      }
    }
    
    // Reconstruct URL with only safe parameters
    const cleanUrl = `${urlObj.pathname}${safeParams.toString() ? '?' + safeParams.toString() : ''}`;
    return cleanUrl;
  } catch (error) {
    // Error cleaning URL
    return url;
  }
}; 