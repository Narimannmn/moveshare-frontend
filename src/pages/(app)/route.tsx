import { Header } from "@/widgets/Header";
import { Sidebar } from "@/widgets/Sidebar";
import { redirect, createFileRoute, Outlet } from "@tanstack/react-router";
import { appLocalStorageKey } from "@/shared/config";

export const Route = createFileRoute("/(app)")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(appLocalStorageKey.accessToken);

    if (!accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => (
    <div className="h-screen overflow-hidden">
      <Header />
      <div className="h-full overflow-hidden flex">
        <Sidebar />
        <div className="bg-[#F5F6FA] flex-1 h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  ),
});
