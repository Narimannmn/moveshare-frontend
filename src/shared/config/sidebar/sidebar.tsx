import type { FileRouteTypes } from "@/app/routeTree.gen";

export type AppRoutePaths = FileRouteTypes["to"];
export interface SidebarItem {
  route: AppRoutePaths;
  iconSrc: string;
  name: string;
}

export const sidebarItems: SidebarItem[] = [
  { route: "/dashboard", name: "Dashboard", iconSrc: "/assets/figma/icons/dashboard.svg" },
  { route: "/jobs", name: "Available Jobs", iconSrc: "/assets/figma/icons/available-jobs.svg" },
  { route: "/my", name: "My Jobs", iconSrc: "/assets/figma/icons/my-jobs.svg" },
  { route: "/chat", name: "Chats", iconSrc: "/assets/figma/icons/chats.svg" },
  { route: "/claimed", name: "Claimed Jobs", iconSrc: "/assets/figma/icons/claimed-jobs.svg" },
  { route: "/profile", name: "Profile", iconSrc: "/assets/figma/icons/profile.svg" },
];
