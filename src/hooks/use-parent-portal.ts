// ─────────────────────────────────────────────────────────────
// Parent Portal — React Query Hooks
// ─────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getChildProfiles,
  getChildProfile,
  getAdmissionOverview,
  getAdmissionTimeline,
  getRegistrationForm,
  saveRegistrationSection,
  submitRegistration,
  getInterviewSchedule,
  getAssessmentSchedule,
  getPaymentSummary,
  getPaymentHistory,
  initiatePayment,
  verifyPayment,
  getDocuments,
  uploadDocument,
  deleteDocument,
  getParentNotifications,
  markNotificationRead as markNotifReadApi,
  markAllNotificationsRead as markAllReadApi,
} from "@/services/parent-portal/parent-api";
import type {
  RegistrationSavePayload,
  InitiatePaymentPayload,
  DocumentUploadPayload,
} from "@/types/parent-portal";

// ── Query Keys ─────────────────────────────────────────────────

export const parentQueryKeys = {
  all: ["parent-portal"] as const,
  children: () => [...parentQueryKeys.all, "children"] as const,
  child: (id: string) => [...parentQueryKeys.children(), id] as const,
  admissionOverview: (childId: string) =>
    [...parentQueryKeys.child(childId), "admission-overview"] as const,
  timeline: (childId: string) =>
    [...parentQueryKeys.child(childId), "timeline"] as const,
  registration: (childId: string) =>
    [...parentQueryKeys.child(childId), "registration"] as const,
  interview: (childId: string) =>
    [...parentQueryKeys.child(childId), "interview"] as const,
  assessment: (childId: string) =>
    [...parentQueryKeys.child(childId), "assessment"] as const,
  paymentSummary: (childId: string) =>
    [...parentQueryKeys.child(childId), "payment-summary"] as const,
  paymentHistory: (childId: string, page: number) =>
    [...parentQueryKeys.child(childId), "payment-history", page] as const,
  documents: (childId: string) =>
    [...parentQueryKeys.child(childId), "documents"] as const,
  notifications: (page: number) =>
    [...parentQueryKeys.all, "notifications", page] as const,
};

// ── Children Hooks ─────────────────────────────────────────────

/** Fetch all children linked to the parent account. */
export function useChildProfiles() {
  return useQuery({
    queryKey: parentQueryKeys.children(),
    queryFn: getChildProfiles,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/** Fetch single child profile. */
export function useChildProfile(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.child(childId ?? ""),
    queryFn: () => getChildProfile(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Admission Hooks ────────────────────────────────────────────

/** Fetch full admission overview for a child. */
export function useAdmissionOverview(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.admissionOverview(childId ?? ""),
    queryFn: () => getAdmissionOverview(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000,
  });
}

/** Fetch admission timeline events. */
export function useAdmissionTimeline(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.timeline(childId ?? ""),
    queryFn: () => getAdmissionTimeline(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000,
  });
}

// ── Registration Hooks ─────────────────────────────────────────

/** Fetch registration form. */
export function useRegistrationForm(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.registration(childId ?? ""),
    queryFn: () => getRegistrationForm(childId!),
    enabled: !!childId,
    staleTime: 1 * 60 * 1000,
  });
}

/** Save a registration section (draft or final). */
export function useSaveRegistrationSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegistrationSavePayload) =>
      saveRegistrationSection(payload),
    onSuccess: (_data, variables) => {
      if (variables.is_draft) {
        toast.success("Draft saved");
      } else {
        toast.success("Section saved successfully");
      }
      // Invalidate registration data cache
      queryClient.invalidateQueries({
        queryKey: parentQueryKeys.all,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save form");
    },
  });
}

/** Submit the complete registration. */
export function useSubmitRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registrationId: string) => submitRegistration(registrationId),
    onSuccess: () => {
      toast.success("Registration submitted successfully!");
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit registration");
    },
  });
}

// ── Interview & Assessment Hooks ───────────────────────────────

export function useInterviewSchedule(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.interview(childId ?? ""),
    queryFn: () => getInterviewSchedule(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAssessmentSchedule(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.assessment(childId ?? ""),
    queryFn: () => getAssessmentSchedule(childId!),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
  });
}

// ── Payment Hooks ──────────────────────────────────────────────

export function usePaymentSummary(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.paymentSummary(childId ?? ""),
    queryFn: () => getPaymentSummary(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000,
  });
}

export function usePaymentHistory(
  childId: string | undefined,
  page: number = 0
) {
  return useQuery({
    queryKey: parentQueryKeys.paymentHistory(childId ?? "", page),
    queryFn: () => getPaymentHistory(childId!, page),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InitiatePaymentPayload) => initiatePayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate payment");
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentSessionId,
      gatewayPaymentId,
    }: {
      paymentSessionId: string;
      gatewayPaymentId: string;
    }) => verifyPayment(paymentSessionId, gatewayPaymentId),
    onSuccess: () => {
      toast.success("Payment verified successfully!");
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Payment verification failed");
    },
  });
}

// ── Document Hooks ─────────────────────────────────────────────

export function useDocuments(childId: string | undefined) {
  return useQuery({
    queryKey: parentQueryKeys.documents(childId ?? ""),
    queryFn: () => getDocuments(childId!),
    enabled: !!childId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DocumentUploadPayload) => uploadDocument(payload),
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload document");
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      childId,
      requirementId,
    }: {
      childId: string;
      requirementId: string;
    }) => deleteDocument(childId, requirementId),
    onSuccess: () => {
      toast.success("Document removed");
      queryClient.invalidateQueries({ queryKey: parentQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove document");
    },
  });
}

// ── Notification Hooks ─────────────────────────────────────────

export function useParentNotifications(page: number = 0) {
  return useQuery({
    queryKey: parentQueryKeys.notifications(page),
    queryFn: () => getParentNotifications(page),
    staleTime: 1 * 60 * 1000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotifReadApi(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...parentQueryKeys.all, "notifications"],
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllReadApi(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({
        queryKey: [...parentQueryKeys.all, "notifications"],
      });
    },
  });
}
