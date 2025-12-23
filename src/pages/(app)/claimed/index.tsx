import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/claimed/")({
  component: ClaimedJobsPage,
});

function ClaimedJobsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#202224] mb-6">Claimed Jobs</h1>
      {/* TODO: Add ClaimedJobsList component */}
      <p className="text-sm text-gray-500">Claimed jobs list to be implemented</p>
    </div>
  );
}
