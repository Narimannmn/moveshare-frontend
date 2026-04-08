import { Link, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";
import { Avatar, Button } from "@/shared/ui";
import { ProtectedRoute } from "@/shared/components";

import { useLogout } from "@/entities/Auth";
import { useAuthStore } from "@/entities/Auth/model/store/authStore";

export const Route = createFileRoute("/(app)")({
  component: () => (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  ),
});

interface AdminNavigationItem {
  to: "/companies" | "/jobs" | "/finance" | "/settings" | "/support";
  label: string;
  matchPrefixes: string[];
}

const adminNavigation: AdminNavigationItem[] = [
  { to: "/companies", label: "Companies", matchPrefixes: ["/companies"] },
  { to: "/jobs", label: "Jobs", matchPrefixes: ["/jobs"] },
  { to: "/finance", label: "Finance", matchPrefixes: ["/finance"] },
];

function AdminLayout() {
  const { pathname } = useLocation();
  const { mutate: logout, isPending } = useLogout();
  const companyProfile = useAuthStore((s) => s.companyProfile);

  return (
    <div className="h-screen bg-[#F5F6FA] overflow-hidden flex flex-col">
      <header className="h-[70px] bg-white border-b border-[#D8D8D8] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="MoveShare logo" className="h-9 w-auto" />
            <span className="text-[#60A5FA] text-xl font-semibold">MoveShare</span>
            <span className="text-xs text-[#90A4AE] bg-[#F5F6FA] px-2 py-0.5 rounded-full font-medium ml-1">Admin</span>
          </div>

          <nav className="flex items-center gap-5">
            {adminNavigation.map((item) => {
              const isActive = item.matchPrefixes.some((prefix) => pathname.startsWith(prefix));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "text-sm transition-colors",
                    isActive ? "text-[#60A5FA] font-bold" : "text-[#2C3E50] hover:text-[#60A5FA]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={() => logout()} disabled={isPending}>
            {isPending ? "Logging out..." : "Logout"}
          </Button>
          <Avatar
            name={companyProfile?.name ?? "Admin"}
            avatar={companyProfile?.profile_image_url}
            size="md"
          />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
