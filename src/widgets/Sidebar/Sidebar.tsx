import { sidebarItems } from "@/shared/config";
import { SidebarItem } from "./SidebarItem/SidebarItem";

export const Sidebar = () => {
  return (
    <div className="flex flex-col w-60 p-4 border-r border-gray-200 h-full">
      {sidebarItems.map((item) => (
        <SidebarItem key={item.name} item={item} />
      ))}
    </div>
  );
};
