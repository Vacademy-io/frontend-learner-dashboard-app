import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import {
  resolveChannel,
  SUPPORT_EMAIL,
  type ChannelDescriptor,
} from "../-constants/channels";
import { maskIdentifier } from "../-utils/text";
import { getUnsubscribeErrorMessage } from "../-utils/errors";
import {
  updateAnnouncementPreferences,
  type AnnouncementPreferenceUpdateRequest,
  type AnnouncementPreferenceUpdateResponse,
} from "@/services/unsubscribe/unsubscribe-service";

type PreferenceAction = "UNSUBSCRIBE" | "RESUBSCRIBE";

export interface UseUnsubscribeFlowParams {
  channel?: string;
  username?: string;
  category?: string;
  instituteId?: string | null;
}

export interface UseUnsubscribeFlowResult {
  channelInfo: ChannelDescriptor | null;
  maskedRecipient: string;
  displayCategory: string;
  rawCategoryKey: string;
  activeAction: PreferenceAction;
  unsubscribeDisabled: boolean;
  formattedDate: string;
  supportEmail: string;
  status: "idle" | "pending" | "error" | "success";
  messages: {
    success: string;
    error: string;
  };
  retry: () => void;
  resubscribe: () => void;
  mutationError: unknown;
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  unsubscribeResult?: AnnouncementPreferenceUpdateResponse;
}

export const useUnsubscribeFlow = ({
  channel,
  username,
  category,
  instituteId,
}: UseUnsubscribeFlowParams): UseUnsubscribeFlowResult => {
  const decodedUsername = useMemo(
    () => decodeURIComponent(username ?? "").trim(),
    [username]
  );

  const decodedCategory = useMemo(
    () => decodeURIComponent(category ?? "").trim(),
    [category]
  );

  const channelInfo = useMemo(() => resolveChannel(channel), [channel]);

  const maskedRecipient = useMemo(
    () => maskIdentifier(decodedUsername),
    [decodedUsername]
  );

  const rawCategoryKey = decodedCategory || "GENERAL";
  const displayCategory = rawCategoryKey;

  const formattedDate = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

  const unsubscribePayloadRef =
    useRef<AnnouncementPreferenceUpdateRequest | null>(null);
  const hasTriggeredRef = useRef(false);
  const lastActionRef = useRef<PreferenceAction>("UNSUBSCRIBE");
  const [activeAction, setActiveAction] = useState<PreferenceAction>("UNSUBSCRIBE");

  const mutation = useMutation<
    AnnouncementPreferenceUpdateResponse,
    AxiosError | Error,
    AnnouncementPreferenceUpdateRequest
  >({
    mutationFn: (request) => updateAnnouncementPreferences(request),
  });

  const buildPayload = (
    action: PreferenceAction,
    effectiveInstituteId: string
  ): AnnouncementPreferenceUpdateRequest | null => {
    if (!channelInfo || !decodedUsername || !effectiveInstituteId) {
      return null;
    }

    const emailPayload =
      channelInfo.channel === "EMAIL"
        ? {
            emailSenders: [
              {
                emailType: rawCategoryKey,
                unsubscribed: action === "UNSUBSCRIBE",
              },
            ],
          }
        : undefined;

    const whatsappPayload =
      channelInfo.channel === "WHATSAPP"
        ? { whatsappUnsubscribed: action === "UNSUBSCRIBE" }
        : undefined;

    return {
      username: decodedUsername,
      instituteId: effectiveInstituteId,
      payload: {
        username: decodedUsername,
        preferences: {
          ...(emailPayload ?? {}),
          ...(whatsappPayload ?? {}),
        },
      },
    };
  };

  useEffect(() => {
    if (!channelInfo || hasTriggeredRef.current || !decodedUsername) {
      return;
    }

    const resolvedInstituteId = instituteId ?? new URLSearchParams(window.location.search).get("instituteId");
    if (!resolvedInstituteId) {
      return;
    }

    const request = buildPayload("UNSUBSCRIBE", resolvedInstituteId);
    if (!request) return;

    unsubscribePayloadRef.current = request;
    hasTriggeredRef.current = true;
    lastActionRef.current = "UNSUBSCRIBE";
    setActiveAction("UNSUBSCRIBE");
    mutation.mutate(request);
  }, [
    category,
    channel,
    channelInfo,
    decodedUsername,
    mutation,
  ]);

  const retry = () => {
    const payload = unsubscribePayloadRef.current;
    if (!payload) {
      return;
    }
    lastActionRef.current = "UNSUBSCRIBE";
    setActiveAction("UNSUBSCRIBE");
    mutation.mutate(payload);
  };

  const resubscribe = () => {
    const resolvedInstituteId =
      instituteId ?? new URLSearchParams(window.location.search).get("instituteId");
    if (!resolvedInstituteId) return;
    const request = buildPayload("RESUBSCRIBE", resolvedInstituteId);
    if (!request) {
      return;
    }
    lastActionRef.current = "RESUBSCRIBE";
    setActiveAction("RESUBSCRIBE");
    mutation.mutate(request);
  };

  const status: UseUnsubscribeFlowResult["status"] = mutation.isPending
    ? "pending"
    : mutation.isSuccess
      ? "success"
      : mutation.isError
        ? "error"
        : "idle";

  const successMessage =
    lastActionRef.current === "RESUBSCRIBE"
      ? `You're subscribed again to the ${channelInfo?.label ?? "notification"} updates.`
      : `You've unsubscribed from the ${channelInfo?.label ?? "notification"} updates.`;

  return {
    channelInfo,
    maskedRecipient,
    displayCategory,
    rawCategoryKey,
    activeAction,
    formattedDate,
    supportEmail: SUPPORT_EMAIL,
    status,
    messages: {
      success: successMessage,
      error: getUnsubscribeErrorMessage(mutation.error),
    },
    retry,
    resubscribe,
  mutationError: mutation.error,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    unsubscribeDisabled: mutation.isPending && activeAction === "UNSUBSCRIBE",
    unsubscribeResult: mutation.data,
  };
};

