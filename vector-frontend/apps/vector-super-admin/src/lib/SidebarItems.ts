import { LayoutDashboard, AlertTriangle, User } from "lucide-react";

export const navigation = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    name: "Users",
    icon: User,
    href: "/users",
  },
  {
    name: "Staff",
    icon: User,
    href: "/staff",
  },
  {
    name: "Courses",
    icon: User,
    href: "/courses",
  },
  {
    name: "Error Page",
    icon: AlertTriangle,
    href: "/error",
  },
];
