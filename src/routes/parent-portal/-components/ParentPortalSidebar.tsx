import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import type { ChildProfile } from "@/types/parent-portal";
import { type TabId, NAV_TABS } from "./navigation-config";

interface ParentPortalSidebarProps {
  child: ChildProfile;
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function ParentPortalSidebar({
  child,
  activeTab,
  onTabChange,
}: ParentPortalSidebarProps) {
  const childInitials = child.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  {childInitials}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{child.full_name}</span>
                  <span className="truncate text-xs">{child.grade_applying || "Admission"}</span>
                </div>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
               {NAV_TABS.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                        isActive={activeTab === item.id}
                        onClick={() => onTabChange(item.id)}
                        tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
