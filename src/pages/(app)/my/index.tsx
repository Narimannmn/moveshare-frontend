import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/Button/Button";

export const Route = createFileRoute("/(app)/my/")({
  component: MyJobsPage,
});

type JobStatus = "active" | "pending" | "completed" | "canceled";

interface Job {
  id: string;
  jobId: string;
  route: string;
  dates: string;
  truckSize: string;
  payout: string;
  status: JobStatus;
}

const mockJobs: Job[] = [
  {
    id: "1",
    jobId: "#MS-4821",
    route: "Chicago, IL → Indianapolis, IN",
    dates: "Aug 12-14, 2023",
    truckSize: "Medium (40')",
    payout: "$1,850",
    status: "active",
  },
  {
    id: "2",
    jobId: "#MS-4821",
    route: "Chicago, IL → Indianapolis, IN",
    dates: "Aug 12-14, 2023",
    truckSize: "Medium (40')",
    payout: "$1,850",
    status: "pending",
  },
  {
    id: "3",
    jobId: "#MS-4821",
    route: "Chicago, IL → Indianapolis, IN",
    dates: "Aug 12-14, 2023",
    truckSize: "Medium (40')",
    payout: "$1,850",
    status: "active",
  },
];

const statusTabs: Array<{
  id: JobStatus;
  label: string;
  count: number;
}> = [
  { id: "active", label: "Active", count: 3 },
  { id: "pending", label: "Pending", count: 3 },
  { id: "completed", label: "Completed", count: 3 },
  { id: "canceled", label: "Canceled", count: 3 },
];

const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "canceled":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case "active":
      return "Claimed";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "canceled":
      return "Unclaimed";
    default:
      return status;
  }
};

function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<JobStatus>("active");
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(mockJobs.map((job) => job.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectJob = (jobId: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(jobId)) {
      newSelected.delete(jobId);
    } else {
      newSelected.add(jobId);
    }
    setSelectedJobs(newSelected);
    setSelectAll(newSelected.size === mockJobs.length);
  };

  const handleViewJob = (jobId: string) => {
    console.log("View job", jobId);
  };

  const handleEditJob = (jobId: string) => {
    console.log("Edit job", jobId);
  };

  const handleDeleteJob = (jobId: string) => {
    console.log("Delete job", jobId);
  };

  const handleCancelSelected = () => {
    console.log("Cancel selected jobs", Array.from(selectedJobs));
  };

  const handleExportToCSV = () => {
    console.log("Export to CSV");
  };

  const handlePostNewJob = () => {
    console.log("Post new job");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#202224]">My Jobs</h1>
        <Button variant="primary" onClick={handlePostNewJob}>
          Post New Job
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}{" "}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Job ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Truck Size
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Payout
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(job.id)}
                      onChange={() => handleSelectJob(job.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#202224]">
                    {job.jobId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.route}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.dates}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {job.truckSize}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">
                    {job.payout}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {getStatusLabel(job.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-green-50 text-green-500 hover:bg-green-100 transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Actions */}
      {selectedJobs.size > 0 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-600">
            {selectedJobs.size} job{selectedJobs.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleCancelSelected}>
              Cancel Selected
            </Button>
            <Button variant="secondary" onClick={handleExportToCSV}>
              Export to CSV
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
