import { createFileRoute } from "@tanstack/react-router";
import type { ChildProfile } from "@/types/parent-portal";
import { useEffect, useState, useMemo } from "react";
import { useParentPortalStore } from "@/stores/parent-portal-store";
import { useChildProfiles } from "@/hooks/use-parent-portal";
import { ChildSelectionScreen } from "@/routes/parent-portal/-components/ChildSelectionScreen";
import { ParentPortalShell } from "@/routes/parent-portal/-components/ParentPortalShell";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

import { MOCK_CHILDREN } from "./-components/mock-data";

export const Route = createFileRoute("/parent-portal/")({
  component: ParentPortalIndex,
});

function ParentPortalIndex() {
  const { data: apiData, isLoading: apiLoading, error: apiError } = useChildProfiles();
  const [isDemoMode, setIsDemoMode] = useState(false);

  const data = useMemo<ChildProfileListResponse | undefined>(() => (
    isDemoMode 
      ? { children: MOCK_CHILDREN, parent_name: "Rajesh Sharma", total_count: MOCK_CHILDREN.length } as ChildProfileListResponse
      : apiData
  ), [isDemoMode, apiData]);
  const isLoading = isDemoMode ? false : apiLoading;
  const error = isDemoMode ? null : apiError;
  const { selectedChild, selectChild, setChildren, setLoadingChildren } =
    useParentPortalStore();
  const [showSelection, setShowSelection] = useState(false);

  useEffect(() => {
    setLoadingChildren(isLoading);
  }, [isLoading, setLoadingChildren]);

  useEffect(() => {
    if (data?.children) {
      setChildren(data.children);

      if (data.children.length === 0) {
        // No children linked — show empty state
        setShowSelection(false);
      } else if (data.children.length === 1 && !selectedChild) {
        // Single child → auto-select, skip selection screen
        selectChild(data.children[0]);
        setShowSelection(false);
      } else if (!selectedChild) {
        // Multiple children → show selection screen
        setShowSelection(true);
      }
    }
  }, [data, selectedChild, selectChild, setChildren]);

  // Loading state
  if (isLoading) {
    return <ParentPortalLoading />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Something went wrong
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We couldn&apos;t load your children&apos;s information. Please try
            again.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Enter Demo Mode
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // No children linked
  if (data?.children.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            No Children Linked Yet
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-2">
            Your children will appear here once an inquiry form has been
            submitted with your contact information.
          </p>
          <p className="text-muted-foreground/70 text-xs">
            Contact the school administration if you believe this is an error.
          </p>
        </motion.div>
      </div>
    );
  }

  const parentName = data?.parent_name || "Parent";

  // Child selection screen (multiple children)
  if (showSelection && !selectedChild) {
    return (
      <AnimatePresence mode="wait">
        <ChildSelectionScreen
          children={data?.children ?? []}
          parentName={parentName}
          onSelect={(child: ChildProfile) => {
            selectChild(child);
            setShowSelection(false);
          }}
        />
      </AnimatePresence>
    );
  }

  // Child selected — render the parent dashboard shell
  if (selectedChild) {
    return (
      <ParentPortalShell
        child={selectedChild}
        allChildren={data?.children ?? []}
        parentName={parentName}
        onSwitchChild={() => {
          selectChild(null);
          setShowSelection(true);
        }}
      />
    );
  }

  return null;
}

// ── Loading Skeleton ─────────────────────────────────────────

function ParentPortalLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </div>
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </motion.div>
    </div>
  );
}
