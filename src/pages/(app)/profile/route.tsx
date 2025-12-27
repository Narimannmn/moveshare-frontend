import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProfileCard } from "@/entities/Profile";
import { TabNavigation } from "@/shared/ui/TabNavigation";
import { profileTabs } from "@/shared/config/profile/profileTabs";

export const Route = createFileRoute("/(app)/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <div className="flex gap-6 h-full">
      {/* Left: Profile Card + Tab Navigation */}
      <aside className="w-[400px] shrink-0 flex flex-col gap-6">
        <ProfileCard />
        <TabNavigation items={profileTabs} />
      </aside>

      {/* Right: Tab Content */}
      <main className="flex-1 bg-white rounded-lg border border-gray-200 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
