import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";

import { apiClient } from "@/shared/api/client";
import { Button, Dialog, DialogContent } from "@/shared/ui";

export const Route = createFileRoute("/(app)/jobs/")({
  component: JobsPage,
});

type JobStatus = "listed" | "assigned" | "in_progress" | "completed" | "cancelled";

interface AdminJob {
  id: string;
  job_type: string;
  bedroom_count: string | null;
  pickup_address: string;
  delivery_address: string;
  pickup_datetime: string;
  payout_amount: string;
  cut_amount: string;
  status: JobStatus;
  created_at: string;
  company_name: string;
}

const statusTabs: Array<{ id: JobStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "listed", label: "Listed" },
  { id: "assigned", label: "Assigned" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const statusStyles: Record<JobStatus, string> = {
  listed: "bg-blue-100 text-blue-700",
  assigned: "bg-purple-100 text-purple-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<JobStatus, string> = {
  listed: "Listed",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const toPublicJobId = (id: string) => `#MS-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

function JobsPage() {
  const [activeTab, setActiveTab] = useState<JobStatus | "all">("all");
  const [offset, setOffset] = useState(0);
  const [selectedJob, setSelectedJob] = useState<AdminJob | null>(null);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "jobs", activeTab, offset],
    queryFn: async () => {
      const params: Record<string, string | number> = { offset, limit };
      if (activeTab !== "all") params.status = activeTab;
      const res = await apiClient.get("/api/v1/admin/jobs", { params });
      return res.data as { jobs: AdminJob[]; total: number };
    },
  });

  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202224]">Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage all jobs across the platform.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setOffset(0); }}
                className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Job ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Route</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Pickup Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Payout</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Cut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              )}
              {isError && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-red-500">Failed to load jobs</td></tr>
              )}
              {!isLoading && !isError && jobs.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No jobs found</td></tr>
              )}
              {!isLoading && !isError && jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#60A5FA]">{toPublicJobId(job.id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">{job.job_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="max-w-xs truncate">{job.pickup_address} → {job.delivery_address}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{job.company_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(job.pickup_datetime)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${job.payout_amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${job.cut_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[job.status]}`}>
                      {statusLabels[job.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages} ({total} jobs)</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setOffset(Math.max(0, offset - limit))} disabled={currentPage <= 1}>Previous</Button>
              <Button variant="secondary" size="sm" onClick={() => setOffset(offset + limit)} disabled={currentPage >= totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-[560px] p-6" showClose={false}>
          <h3 className="text-lg font-bold text-[#202224]">Job Details</h3>
          {selectedJob && (
            <div className="space-y-3 mt-4">
              <DetailRow label="Job ID" value={toPublicJobId(selectedJob.id)} />
              <DetailRow label="Type" value={selectedJob.job_type} />
              <DetailRow label="From" value={selectedJob.pickup_address} />
              <DetailRow label="To" value={selectedJob.delivery_address} />
              <DetailRow label="Company" value={selectedJob.company_name} />
              <DetailRow label="Pickup Date" value={formatDate(selectedJob.pickup_datetime)} />
              <DetailRow label="Payout" value={`$${selectedJob.payout_amount}`} />
              <DetailRow label="Cut" value={`$${selectedJob.cut_amount}`} />
              <DetailRow label="Status" value={statusLabels[selectedJob.status]} />
              <DetailRow label="Created" value={formatDate(selectedJob.created_at)} />
            </div>
          )}
          <div className="flex justify-end mt-5">
            <Button variant="primary" size="sm" onClick={() => setSelectedJob(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-[#202224] capitalize">{value}</span>
    </div>
  );
}
