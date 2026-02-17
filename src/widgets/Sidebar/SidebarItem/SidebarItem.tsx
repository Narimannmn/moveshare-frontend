import { Link, useMatchRoute } from "@tanstack/react-router";

import type { SidebarItem as SidebarItemType } from "@/shared/config";

export const SidebarItem = ({ item }: { item: SidebarItemType }) => {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to: item.route, fuzzy: true });
  const Icon = item.icon;

  return (
    <Link
      to={item.route}
      className={`flex items-center gap-4 h-[52px] px-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out font-['Onest',sans-serif] text-base ${isActive
          ? "bg-[#60A5FA] text-white"
          : "text-[#202224] hover:bg-blue-50"
        }`}
    >
      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-[#60A5FA]"}`} />
      <span>{item.name}</span>
    </Link>
  );
};
