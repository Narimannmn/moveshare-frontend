import type { ReactNode } from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { BsClipboardCheck, BsChatDots } from "react-icons/bs";
import type { FileRouteTypes } from "@/app/routeTree.gen";

export type AppRoutePaths = FileRouteTypes["to"];
export interface SidebarItem {
  route: AppRoutePaths;
  icon?: ReactNode;
  name: string;
}

export const sidebarItems: SidebarItem[] = [
  { route: "/", name: "Welcome", icon: <AiOutlineLineChart /> },
  { route: "/dashboard", name: "Dashboard", icon: <AiOutlineLineChart /> },
  { route: "/jobs", name: "Available Jobs", icon: <BsClipboardCheck /> },
  { route: "/my", name: "My Jobs", icon: <BsClipboardCheck /> },
  { route: "/chat", name: "Chats", icon: <BsChatDots /> },
  { route: "/claimed", name: "Claimed Jobs", icon: <BsClipboardCheck /> },
];
