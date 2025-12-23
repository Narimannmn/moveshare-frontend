import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/my/")({
  component: MyJobsPage,
});

function MyJobsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#202224] mb-6">My Jobs</h1>
      {/* TODO: Add MyJobsList component */}
      <p className="text-sm text-gray-500">My jobs list to be implemented</p>
    </div>
  );
}
