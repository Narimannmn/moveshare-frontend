import { Building2, Truck, CreditCard, Bell, Shield, FileCheck } from "lucide-react";

export interface TabNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route: string;
}

export const profileTabs: TabNavigationItem[] = [
  {
    id: "company",
    label: "Company Information",
    icon: <Building2 size={20} />,
    route: "/profile/company",
  },
  {
    id: "fleet",
    label: "Fleet Management",
    icon: <Truck size={20} />,
    route: "/profile/fleet",
  },
  {
    id: "payment",
    label: "Payment Settings",
    icon: <CreditCard size={20} />,
    route: "/profile/payment",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={20} />,
    route: "/profile/notifications",
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield size={20} />,
    route: "/profile/security",
  },
  {
    id: "verification",
    label: "Verification",
    icon: <FileCheck size={20} />,
    route: "/profile/verification",
  },
];
