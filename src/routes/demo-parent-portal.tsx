import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
// Import from the parent-portal components directory
import { MOCK_CHILDREN } from "./parent-portal/-components/mock-data";
import { ChildSelectionScreen } from "./parent-portal/-components/ChildSelectionScreen";
import { ParentPortalDemoShell } from "./parent-portal/-components/ParentPortalDemoShell";
import type { ChildProfile } from "@/types/parent-portal";

export const Route = createFileRoute("/demo-parent-portal")({
  component: ParentPortalDemo,
});

function ParentPortalDemo() {
  const [selected, setSelected] = useState<ChildProfile | null>(null);

  if (!selected) {
    return (
      <ChildSelectionScreen
        children={MOCK_CHILDREN}
        onSelect={(child: ChildProfile) => setSelected(child)}
      />
    );
  }

  return (
    <ParentPortalDemoShell
      child={selected}
      allChildren={MOCK_CHILDREN}
      onSwitchChild={() => setSelected(null)}
    />
  );
}
