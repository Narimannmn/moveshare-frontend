import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import { ProtectedRoute } from "@/shared/components";

import { Header } from "@/widgets/Header";
import { Sidebar } from "@/widgets/Sidebar";

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <Outlet />;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden flex">
        <Sidebar />
        <div className="bg-[#F5F6FA] flex-1 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/(app)")({
  component: () => (
    <ProtectedRoute>
      <AppShell />
    </ProtectedRoute>
  ),
});
