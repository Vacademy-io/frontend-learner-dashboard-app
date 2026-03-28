import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Smartphone, Monitor, Globe, Clock, LogOut, RefreshCw } from "lucide-react";
import { SESSION_LOGOUT_URL } from "@/constants/urls";
import type { ActiveSession } from "@/components/common/auth/login/hooks/login-button";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function getDeviceIcon(deviceType: string) {
  const type = deviceType?.toUpperCase();
  if (type === "MOBILE") return <Smartphone className="w-5 h-5" />;
  if (type === "WEB") return <Monitor className="w-5 h-5" />;
  return <Globe className="w-5 h-5" />;
}

function getDeviceLabel(deviceType: string) {
  const type = deviceType?.toUpperCase();
  if (type === "MOBILE") return "Mobile Device";
  if (type === "WEB") return "Web Browser";
  return deviceType || "Unknown Device";
}

interface ActiveSessionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeSessions: ActiveSession[];
  onRetryLogin: () => void;
}

export function ActiveSessionsModal({
  open,
  onOpenChange,
  activeSessions,
  onRetryLogin,
}: ActiveSessionsModalProps) {
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const handleKillSession = async (sessionId: string) => {
    setLoadingSessionId(sessionId);
    try {
      const response = await fetch(
        `${SESSION_LOGOUT_URL}?sessionId=${encodeURIComponent(sessionId)}`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to log out device");
      }

      toast.success("Device logged out successfully");
      onOpenChange(false);
      onRetryLogin();
    } catch {
      toast.error("Failed to log out device. Please try again.");
    } finally {
      setLoadingSessionId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Session Limit Reached
          </DialogTitle>
          <DialogDescription>
            You have reached the maximum number of active sessions. Please log
            out from one of your other devices to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {activeSessions.map((session) => (
            <div
              key={session.session_id}
              className="flex items-start justify-between gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50/50"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex-shrink-0 mt-0.5 text-gray-600">
                  {getDeviceIcon(session.device_type)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {getDeviceLabel(session.device_type)}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      Last active{" "}
                      {formatRelativeTime(session.last_activity_time)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    IP: {session.ip_address}
                  </p>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                disabled={loadingSessionId === session.session_id}
                onClick={() => handleKillSession(session.session_id)}
                className="flex-shrink-0 text-xs"
              >
                {loadingSessionId === session.session_id ? (
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                ) : (
                  <LogOut className="w-3 h-3 mr-1" />
                )}
                Log Out
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
