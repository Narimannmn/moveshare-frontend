import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#60A5FA] flex items-center justify-center">
      <Outlet />
    </div>
  );
}
