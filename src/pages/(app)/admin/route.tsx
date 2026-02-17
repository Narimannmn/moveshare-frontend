import { Link, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

import { useLogout } from "@/entities/Auth";

export const Route = createFileRoute("/(app)/admin")({
  component: AdminLayout,
});

interface AdminNavigationItem {
  to: "/admin/review-company" | "/admin/commission" | "/admin/setting" | "/admin/support";
  label: string;
  matchPrefixes: string[];
}

const adminNavigation: AdminNavigationItem[] = [
  {
    to: "/admin/review-company",
    label: "Company Management",
    matchPrefixes: ["/admin/review-company", "/admin/freeze-company"],
  },
  {
    to: "/admin/commission",
    label: "Finance",
    matchPrefixes: ["/admin/commission", "/admin/finance"],
  },
  { to: "/admin/setting", label: "System Settings", matchPrefixes: ["/admin/setting"] },
  { to: "/admin/support", label: "Support", matchPrefixes: ["/admin/support"] },
];

function AdminLayout() {
  const { pathname } = useLocation();
  const { mutate: logout, isPending } = useLogout();

  return (
    <div className="h-screen bg-[#F5F6FA] overflow-hidden flex flex-col">
      <header className="h-[70px] bg-white border-b border-[#D8D8D8] px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="MoveShare logo" className="h-9 w-auto" />
            <span className="text-[#60A5FA] text-[20px] font-extrabold">MoveShare</span>
          </div>

          <nav className="flex items-center gap-4">
            {adminNavigation.map((item) => {
              const isActive = item.matchPrefixes.some((prefix) => pathname.startsWith(prefix));

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "text-[16px] transition-colors",
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
          <div className="flex items-center gap-2">
            <img
              src="/assets/figma/admin/admin-avatar.png"
              alt="Admin avatar"
              className="size-11 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-[#404040] text-[16px] font-bold">Tolebi Baitassov</p>
              <p className="text-[#565656] text-[14px]">Admin</p>
            </div>
          </div>

          <Button variant="secondary" size="default" onClick={() => logout()} disabled={isPending}>
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
