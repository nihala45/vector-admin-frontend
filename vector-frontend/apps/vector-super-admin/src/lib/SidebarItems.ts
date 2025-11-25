import { LayoutDashboard, UserCircle, AlertTriangle } from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },

  {
    name: "Profile",
    icon: UserCircle,
    href: "/profile",
  },

  {
    name: "Error Page",
    icon: AlertTriangle,
    href: "/error",
  },
];
