import type { ComponentType, SVGProps } from "react";

import type { FileRouteTypes } from "@/app/routeTree.gen";
import {
  AvailableJobsIcon,
  ChatsIcon,
  ClaimedJobsIcon,
  DashboardIcon,
  MyJobsIcon,
  ProfileIcon,
} from "@/shared/assets/icons/sidebar/SidebarIcons";

export type AppRoutePaths = FileRouteTypes["to"];
export interface SidebarItem {
  route: AppRoutePaths;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  name: string;
}

export const sidebarItems: SidebarItem[] = [
  { route: "/dashboard", name: "Dashboard", icon: DashboardIcon },
  { route: "/jobs", name: "Available Jobs", icon: AvailableJobsIcon },
  { route: "/my", name: "My Jobs", icon: MyJobsIcon },
  { route: "/chat", name: "Chats", icon: ChatsIcon },
  { route: "/claimed", name: "Claimed Jobs", icon: ClaimedJobsIcon },
  { route: "/profile", name: "Profile", icon: ProfileIcon },
];
