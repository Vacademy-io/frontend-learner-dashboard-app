import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChildProfile } from "@/types/parent-portal";
import { ParentDashboard } from "./ParentDashboard";
import { RegistrationModule } from "./RegistrationModule";
import { InterviewAssessmentModule } from "./InterviewAssessmentModule";
import { PaymentsModule } from "./PaymentsModule";
import { DocumentsModule } from "./DocumentsModule";
import { AdmissionTracker } from "./AdmissionTracker";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ParentPortalSidebar } from "./ParentPortalSidebar";
import { ParentPortalNavbar } from "./ParentPortalNavbar";
import { type TabId, NAV_TABS } from "./navigation-config";

interface ParentPortalShellProps {
  child: ChildProfile;
  allChildren: ChildProfile[];
  parentName: string;
  onSwitchChild: () => void;
}

export function ParentPortalShell({
  child,
  allChildren,
  parentName,
  onSwitchChild,
}: ParentPortalShellProps) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  // Current tab content
  const tabContent = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return <ParentDashboard child={child} onNavigate={setActiveTab} />;
      case "registration":
        return <RegistrationModule child={child} />;
      case "schedule":
        return <InterviewAssessmentModule child={child} />;
      case "admission":
        return <RegistrationModule child={child} />;
      case "payments":
        return <PaymentsModule child={child} />;
      case "documents":
        return <DocumentsModule child={child} />;
      case "tracker":
        return <AdmissionTracker child={child} />;
      default:
        return <ParentDashboard child={child} onNavigate={setActiveTab} />;
    }
  }, [activeTab, child]);
  
  const currentTabLabel = NAV_TABS.find(t => t.id === activeTab)?.label || "Dashboard";

  return (
    <SidebarProvider>
      <ParentPortalSidebar 
        child={child} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <SidebarInset className="overflow-hidden flex flex-col h-screen">
         <ParentPortalNavbar 
            title={currentTabLabel} 
            parentName={parentName}
            canSwitch={allChildren.length > 1}
            onSwitchChild={onSwitchChild}
         />
         <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-7xl mx-auto"
              >
                {tabContent}
              </motion.div>
            </AnimatePresence>
         </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
