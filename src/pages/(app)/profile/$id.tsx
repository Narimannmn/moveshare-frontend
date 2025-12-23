import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/profile/$id")({
  component: ProfilePage,
});

function ProfilePage() {
  const { id } = Route.useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#202224] mb-6">User Profile</h1>
      {/* TODO: Add UserProfile component */}
      <p className="text-sm text-gray-500">Profile for user ID: {id}</p>
    </div>
  );
}
