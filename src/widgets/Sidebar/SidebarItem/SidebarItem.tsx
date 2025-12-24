import type { SidebarItem as SidebarItemType } from "@/shared/config";
import { Link } from "@tanstack/react-router";

export const SidebarItem = ({ item }: { item: SidebarItemType }) => {
  return (
    <Link
      to={item.route}
      activeOptions={{ exact: true }}
      activeProps={{ className: "bg-blue-500 text-white" }}
      className="flex items-center gap-3 p-4 rounded-lg cursor-pointer text-gray-700 hover:bg-blue-500 hover:text-white transition-all duration-200 ease-in-out"
    >
      {item.icon}
      <span>{item.name}</span>
    </Link>
  );
};
