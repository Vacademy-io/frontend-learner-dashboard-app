import {
  Home,
  ClipboardList,
  CalendarCheck,
  DollarSign,
  FileText,
  RefreshCw,
} from "lucide-react";

export type TabId =
  | "dashboard"
  | "registration"
  | "schedule"
  | "admission"
  | "documents"
  | "payments"
  | "tracker";

export interface NavTab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  mobileLabel: string;
}

export const NAV_TABS: NavTab[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, mobileLabel: "Home" },
  {
    id: "registration",
    label: "Registration",
    icon: ClipboardList,
    mobileLabel: "Register",
  },
  {
    id: "schedule",
    label: "Interviews & Tests",
    icon: CalendarCheck,
    mobileLabel: "Interviews",
  },
  {
    id: "admission",
    label: "Admission Form",
    icon: FileText,
    mobileLabel: "Admission",
  },
  {
    id: "documents",
    label: "Verification",
    icon: ClipboardList,
    mobileLabel: "Verify",
  },
  {
    id: "payments",
    label: "Fee Payment",
    icon: DollarSign,
    mobileLabel: "Fees",
  },
  {
    id: "tracker",
    label: "Status",
    icon: RefreshCw,
    mobileLabel: "Status",
  },
];
