import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { removeTokensAndLogout, getAccessToken } from "@/lib/auth/sessionUtility";
import { pushNotificationService } from "@/services/push-notifications/push-notification-service";
import { useNavigate } from "@tanstack/react-router";
import { NAMING_SETTINGS_KEY } from "@/types/naming-settings";
import { useDomainRouting } from "@/hooks/use-domain-routing";
import { useDripConditionStore } from "@/stores/study-library/drip-conditions-store";
import { LEARNER_LOGOUT_URL } from "@/constants/urls";

export const Route = createFileRoute("/logout/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    return {
      redirect:
        typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const domainRouting = useDomainRouting();
  const { redirect } = Route.useSearch();
  const { clearAll } = useDripConditionStore();

  // Perform logout side-effects once on mount
  useEffect(() => {
    const performLogout = async () => {
      // Call backend logout API to invalidate the session
      try {
        const accessToken = await getAccessToken();
        if (accessToken) {
          await fetch(LEARNER_LOGOUT_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
        }
      } catch (e) {
        console.error("Logout failed on server, cleaning up locally anyway", e);
      }

      localStorage.removeItem(NAMING_SETTINGS_KEY);
      clearAll();
      pushNotificationService.deactivateToken().catch(() => {});
      removeTokensAndLogout();
    };

    performLogout();
  }, [clearAll]);

  // After logout, navigate once domain routing has resolved (or honor explicit redirect)
  useEffect(() => {
    // Prefer explicit redirect param if provided
    if (redirect && typeof redirect === "string") {
      if (/^https?:\/\//.test(redirect)) {
        window.location.assign(redirect);
      } else {
        navigate({ to: redirect });
      }
      return;
    }

    // Wait until domain routing finishes resolving to avoid defaulting to /login prematurely
    if (domainRouting.isLoading) {
      return;
    }

    const target = domainRouting.redirectPath || "/login";
    if (/^https?:\/\//.test(target)) {
      window.location.assign(target);
    } else {
      navigate({ to: target });
    }
  }, [redirect, domainRouting.isLoading, domainRouting.redirectPath, navigate]);
  return <div>Loging out ....</div>;
}
