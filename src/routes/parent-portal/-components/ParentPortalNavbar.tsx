import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Users, Bell, Menu } from "lucide-react";

interface ParentPortalNavbarProps {
    title: string;
    parentName: string;
    onSwitchChild?: () => void;
    canSwitch: boolean;
}

export function ParentPortalNavbar({ title, parentName, onSwitchChild, canSwitch }: ParentPortalNavbarProps) {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 w-full">
            <SidebarTrigger className="-ml-2">
                <Menu className="h-5 w-5 text-muted-foreground" />
            </SidebarTrigger>
            <div className="w-px h-6 bg-border" />
            <h1 className="text-lg font-semibold truncate flex-1">{title}</h1>
            
            <div className="ml-auto flex items-center gap-2">
                 {canSwitch && onSwitchChild && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onSwitchChild} 
                        className="hidden sm:flex items-center gap-2 h-9"
                    >
                        <Users className="h-4 w-4" />
                        <span>Switch Child</span>
                    </Button>
                 )}
                 {canSwitch && onSwitchChild && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={onSwitchChild} 
                        className="sm:hidden h-9 w-9"
                        title="Switch Child"
                    >
                        <Users className="h-5 w-5" />
                    </Button>
                 )}
                  <div className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-full bg-muted/50 border border-border/50">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground pr-1">
                        {parentName}
                    </span>
                  </div>

                 <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-orange-500 rounded-full border-2 border-background" />
                 </Button>
            </div>
        </header>
    );
}
