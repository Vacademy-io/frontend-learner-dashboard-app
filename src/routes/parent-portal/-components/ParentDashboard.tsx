// ─────────────────────────────────────────────────────────────
// Parent Dashboard — Per-child overview
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import type { ChildProfile } from "@/types/parent-portal";
import { useAdmissionOverview } from "@/hooks/use-parent-portal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  ClipboardList,
  CalendarCheck,
  DollarSign,
  FileText,
  ArrowRight,
  AlertTriangle,
  PartyPopper,
  Info,
} from "lucide-react";

import { type TabId } from "./navigation-config";

interface ParentDashboardProps {
  child: ChildProfile;
  onNavigate: (tab: TabId) => void;
}

export function ParentDashboard({ child, onNavigate }: ParentDashboardProps) {
  const { data: overview, isLoading } = useAdmissionOverview(child.id);

  const statusInfo = getAdmissionStatusInfo(child.admission_status);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6 pb-20 lg:pb-8">
      {/* ── Welcome Header ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {child.full_name}&apos;s Admission
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {child.grade_applying
              ? `Applying for ${child.grade_applying}`
              : "Admission in progress"}
            {child.academic_year ? ` • ${child.academic_year}` : ""}
          </p>
        </div>
        <Badge
          className={`${statusInfo.badge} self-start sm:self-auto text-xs font-medium px-3 py-1`}
        >
          {statusInfo.label}
        </Badge>
      </motion.div>

      {/* ── Status Banner ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card
          className={`border-l-4 ${statusInfo.borderColor} shadow-sm overflow-hidden`}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${statusInfo.iconBg} shrink-0 mt-0.5`}
              >
                {statusInfo.bannerIcon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">
                  {statusInfo.bannerTitle}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {statusInfo.bannerDescription}
                </p>
                {statusInfo.actionTab && (
                  <Button
                    size="sm"
                    onClick={() => onNavigate(statusInfo.actionTab!)}
                    className="mt-3 h-8 text-xs rounded-lg gap-1.5"
                  >
                    {statusInfo.actionLabel}
                    <ArrowRight size={12} />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Admission Progress ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Admission Progress</CardTitle>
            <CardDescription className="text-xs">
              Track each step of the admission journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <AdmissionProgressSteps
                currentStatus={child.admission_status}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Quick Action Cards ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            id: "registration" as TabId,
            icon: ClipboardList,
            label: "Registration",
            description: "Form & payment",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/30",
            delay: 0.15,
          },
          {
            id: "schedule" as TabId,
            icon: CalendarCheck,
            label: "Interviews & Tests",
            description: "Schedule & results",
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-950/30",
            delay: 0.2,
          },
          {
            id: "admission" as TabId,
            icon: FileText,
            label: "Admission Form",
            description: "Admission details",
            color: "text-indigo-600 dark:text-indigo-400",
            bg: "bg-indigo-50 dark:bg-indigo-950/30",
            delay: 0.25,
          },
          {
            id: "documents" as TabId,
            icon: FileText,
            label: "Verification",
            description: "Upload & verify",
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-950/30",
            delay: 0.3,
          },
          {
            id: "payments" as TabId,
            icon: DollarSign,
            label: "Fee Payment",
            description: "Fees & receipts",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            delay: 0.35,
          },
        ].map((card) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay }}
          >
            <Card
              className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group active:scale-[0.98]"
              onClick={() => onNavigate(card.id)}
            >
              <CardContent className="p-4 flex flex-col items-start gap-2.5">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon size={20} className={card.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {card.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Timeline Preview ──────────────────────────────────── */}
      {overview?.timeline && overview.timeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="shadow-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription className="text-xs">
                  Latest updates on the admission
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7"
                onClick={() => onNavigate("tracker")}
              >
                View All
                <ArrowRight size={12} className="ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {overview.timeline.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                      event.status === "COMPLETED"
                        ? "bg-emerald-500"
                        : event.status === "CURRENT"
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground/30"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {event.description}
                      </p>
                    )}
                    {event.timestamp && (
                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                        {new Date(event.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Admission Progress Steps ─────────────────────────────────────

const PROGRESS_STEPS = [
  { key: "INQUIRY_SUBMITTED", label: "Inquiry Submitted" },
  { key: "REGISTRATION_SUBMITTED", label: "Registration" },
  { key: "INTERVIEW_COMPLETED", label: "Interview & Assessment" },
  { key: "ADMISSION_ACCEPTED", label: "Admission Form" },
  { key: "DOCUMENTS_VERIFIED", label: "Documents Verification" },
  { key: "PAYMENT_COMPLETED", label: "Fee Payment" },
  { key: "ENROLLED", label: "Enrolled" },
];

const STATUS_ORDER = [
  "INQUIRY_SUBMITTED",
  "INQUIRY_REVIEWED",
  "REGISTRATION_PENDING",
  "REGISTRATION_IN_PROGRESS",
  "REGISTRATION_SUBMITTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEW_COMPLETED",
  "ASSESSMENT_SCHEDULED",
  "ASSESSMENT_COMPLETED",
  "ADMISSION_OFFERED",
  "ADMISSION_ACCEPTED",
  "DOCUMENTS_PENDING",
  "DOCUMENTS_SUBMITTED",
  "DOCUMENTS_VERIFIED",
  "PAYMENT_PENDING",
  "PAYMENT_PARTIAL",
  "PAYMENT_COMPLETED",
  "ENROLLED",
];

function AdmissionProgressSteps({
  currentStatus,
}: {
  currentStatus: string;
}) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {PROGRESS_STEPS.map((step, idx) => {
        const stepIndex = STATUS_ORDER.indexOf(step.key);
        const isCompleted = currentIndex >= stepIndex;
        const isCurrent =
          !isCompleted &&
          (idx === 0 ||
            currentIndex >=
              STATUS_ORDER.indexOf(PROGRESS_STEPS[idx - 1]!.key));
        const isLast = idx === PROGRESS_STEPS.length - 1;

        return (
          <div key={step.key} className="flex items-start gap-3">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-muted border-2 border-border"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle size={14} />
                ) : isCurrent ? (
                  <Clock size={12} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>
              {!isLast && (
                <div
                  className={`w-0.5 h-8 ${
                    isCompleted ? "bg-emerald-500" : "bg-border"
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-6">
              <p
                className={`text-sm font-medium ${
                  isCompleted
                    ? "text-foreground"
                    : isCurrent
                      ? "text-primary font-semibold"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-[11px] text-primary/70 mt-0.5">
                  In progress
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Status Info Helper ───────────────────────────────────────────

function getAdmissionStatusInfo(status: string) {
  const map: Record<
    string,
    {
      label: string;
      badge: string;
      borderColor: string;
      iconBg: string;
      bannerIcon: React.ReactNode;
      bannerTitle: string;
      bannerDescription: string;
      actionTab?: TabId;
      actionLabel?: string;
    }
  > = {
    INQUIRY_SUBMITTED: {
      label: "Inquiry Submitted",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      borderColor: "border-l-blue-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      bannerIcon: <Info size={20} className="text-blue-600" />,
      bannerTitle: "Inquiry Under Review",
      bannerDescription:
        "Your inquiry has been received and is being reviewed by the admissions team. You will be notified once registration opens.",
    },
    REGISTRATION_PENDING: {
      label: "Registration Open",
      badge:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
      borderColor: "border-l-amber-500",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      bannerIcon: <AlertTriangle size={20} className="text-amber-600" />,
      bannerTitle: "Registration Required",
      bannerDescription:
        "Complete the registration form to proceed with the admission process. All sections must be filled.",
      actionTab: "registration",
      actionLabel: "Start Registration",
    },
    REGISTRATION_IN_PROGRESS: {
      label: "Registration In Progress",
      badge:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      borderColor: "border-l-yellow-500",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      bannerIcon: <ClipboardList size={20} className="text-yellow-600" />,
      bannerTitle: "Continue Registration",
      bannerDescription:
        "You have a draft registration. Continue filling the form and submit when ready.",
      actionTab: "registration",
      actionLabel: "Continue",
    },
    PAYMENT_PENDING: {
      label: "Payment Required",
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      borderColor: "border-l-orange-500",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      bannerIcon: <DollarSign size={20} className="text-orange-600" />,
      bannerTitle: "Payment Pending",
      bannerDescription:
        "Complete your fee payment to finalize the admission process.",
      actionTab: "payments",
      actionLabel: "View & Pay",
    },
    ENROLLED: {
      label: "Enrolled",
      badge:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      borderColor: "border-l-emerald-500",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      bannerIcon: <PartyPopper size={20} className="text-emerald-600" />,
      bannerTitle: "Admission Complete!",
      bannerDescription:
        "Congratulations! Your child has been successfully enrolled.",
    },
  };

  return (
    map[status] || {
      label: status.replace(/_/g, " "),
      badge: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
      borderColor: "border-l-gray-400",
      iconBg: "bg-gray-100 dark:bg-gray-900/30",
      bannerIcon: <Info size={20} className="text-gray-600" />,
      bannerTitle: "Status Update",
      bannerDescription: "Your admission is being processed.",
    }
  );
}
