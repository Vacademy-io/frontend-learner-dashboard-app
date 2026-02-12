// ─────────────────────────────────────────────────────────────
// Admission Tracker — Full timeline view
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import type { ChildProfile } from "@/types/parent-portal";
import { useAdmissionTimeline } from "@/hooks/use-parent-portal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Circle,
  CalendarDays,
  Flag,
  PartyPopper,
} from "lucide-react";

interface AdmissionTrackerProps {
  child: ChildProfile;
}

export function AdmissionTracker({ child }: AdmissionTrackerProps) {
  const { data: timeline, isLoading } = useAdmissionTimeline(child.id);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const completedCount =
    timeline?.filter((e) => e.status === "COMPLETED").length ?? 0;
  const totalCount = timeline?.length ?? 0;
  const progressPercent = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-5 pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Admission Tracker
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Full journey timeline for {child.full_name}
        </p>
      </div>

      {/* ── Progress Bar ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flag
                  size={16}
                  className="text-primary"
                />
                <p className="text-sm font-semibold text-foreground">
                  Overall Progress
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-medium"
              >
                {completedCount} / {totalCount} steps
              </Badge>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-emerald-500 rounded-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 text-right">
              {progressPercent}% complete
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* ── Timeline ──────────────────────────────────────────── */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays size={16} />
            Journey Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timeline && timeline.length > 0 ? (
            <div className="relative">
              {timeline.map((event, idx) => {
                const isCompleted = event.status === "COMPLETED";
                const isCurrent = event.status === "CURRENT";
                const isUpcoming = event.status === "UPCOMING";
                const isSkipped = event.status === "SKIPPED";
                const isLast = idx === timeline.length - 1;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="flex gap-4"
                  >
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      {/* Dot / Icon */}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900"
                            : isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/15 shadow-sm"
                              : isSkipped
                                ? "bg-muted border-2 border-dashed border-border"
                                : "bg-muted border-2 border-border"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={16} />
                        ) : isCurrent ? (
                          <Clock size={14} />
                        ) : isSkipped ? (
                          <ArrowRight
                            size={12}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <Circle
                            size={8}
                            className="text-muted-foreground/40"
                          />
                        )}
                      </div>

                      {/* Line */}
                      {!isLast && (
                        <div
                          className={`w-0.5 flex-1 min-h-[24px] ${
                            isCompleted
                              ? "bg-emerald-400"
                              : "bg-border"
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`flex-1 pb-6 min-w-0 ${
                        isUpcoming ? "opacity-50" : ""
                      } ${isSkipped ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold ${
                              isCurrent
                                ? "text-primary"
                                : isCompleted
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {event.title}
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>

                        {/* Status chip */}
                        {isCurrent && (
                          <Badge className="bg-primary/10 text-primary text-[9px] shrink-0 animate-pulse">
                            Current
                          </Badge>
                        )}
                        {isSkipped && (
                          <Badge
                            variant="outline"
                            className="text-[9px] shrink-0"
                          >
                            Skipped
                          </Badge>
                        )}
                      </div>

                      {/* Timestamp */}
                      {event.timestamp && (
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(event.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <CalendarDays
                size={28}
                className="mx-auto text-muted-foreground/40 mb-3"
              />
              <p className="text-sm font-medium text-muted-foreground">
                Timeline will appear here
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Events are added as the admission progresses
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Enrolled Celebration ──────────────────────────────── */}
      {child.admission_status === "ENROLLED" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-sm bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6 text-center">
              <PartyPopper
                size={36}
                className="mx-auto text-emerald-600 mb-3"
              />
              <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                Congratulations!
              </h3>
              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                {child.full_name} has been successfully enrolled.
                {child.batch_name && ` Welcome to ${child.batch_name}!`}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
