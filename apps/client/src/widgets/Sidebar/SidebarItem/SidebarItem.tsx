import { Link, useMatchRoute } from "@tanstack/react-router";

import type { SidebarItem as SidebarItemType } from "@/shared/config";
import { cn } from "@/shared/lib/utils";

export const SidebarItem = ({ item }: { item: SidebarItemType }) => {
  const matchRoute = useMatchRoute();
  const isActive = !!matchRoute({ to: item.route, fuzzy: true });

  return (
    <Link
      to={item.route}
      className={`flex items-center gap-4 h-[52px] px-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out font-['Onest',sans-serif] text-base ${
        isActive ? "bg-[#60A5FA] text-white" : "text-[#202224] hover:bg-blue-50"
      }`}
    >
      <img
        src={item.iconSrc}
        alt={`${item.name} icon`}
        className={cn("w-5 h-5 shrink-0", isActive && "brightness-0 invert")}
      />
      <span>{item.name}</span>
    </Link>
  );
};
