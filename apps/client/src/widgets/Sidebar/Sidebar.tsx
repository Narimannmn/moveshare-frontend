import { useLogout } from "@/entities/Auth";
import { sidebarItems } from "@/shared/config";

import { SidebarItem } from "./SidebarItem/SidebarItem";

export const Sidebar = () => {
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col justify-between w-60 p-4 border-r border-gray-200 h-full bg-white">
      <div className="flex flex-col">
        {sidebarItems.map((item) => (
          <SidebarItem key={item.name} item={item} />
        ))}
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="text-[#202224] text-sm font-bold tracking-[0.3px] hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-2"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};
