import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/jobs/")({
  component: JobsPage,
});

function JobsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#202224] mb-6">Available Jobs</h1>
      {/* TODO: Add JobsList component */}
      <p className="text-sm text-gray-500">Jobs list to be implemented</p>
    </div>
  );
}
