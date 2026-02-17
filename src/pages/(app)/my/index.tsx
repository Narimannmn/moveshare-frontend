import { useEffect, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Edit, Eye, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/Button/Button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/Pagination/Pagination";

import {
  type BedroomCount,
  type JobStatus,
  useCancelJobs,
  useExportJobsCsv,
  useMyJobs,
} from "@/entities/Job";

import { PostJobModal } from "@/features/postJob";

export const Route = createFileRoute("/(app)/my/")({
  component: MyJobsPage,
});

const statusTabs: Array<{
  id: JobStatus | "all";
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "listed", label: "Listed" },
  { id: "assigned", label: "Assigned" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const bedroomLabelMap: Record<BedroomCount, string> = {
  "1_bedroom": "1 Bedroom",
  "2_bedroom": "2 Bedroom",
  "3_bedroom": "3 Bedroom",
  "4_bedroom": "4 Bedroom",
  "5_bedroom": "5 Bedroom",
  "6_plus_bedroom": "6+ Bedroom",
};

const buildPageItems = (currentPage: number, totalPages: number): Array<number | "ellipsis"> => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
};

const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case "listed":
      return "bg-blue-100 text-blue-700";
    case "assigned":
      return "bg-purple-100 text-purple-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "draft":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case "listed":
      return "Listed";
    case "assigned":
      return "Assigned";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "draft":
      return "Draft";
    default:
      return status;
  }
};

function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<JobStatus | "all">("all");
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const cancelJobsMutation = useCancelJobs({
    onSuccess: () => {
      setSelectedJobs(new Set());
      setSelectAll(false);
    },
  });
  const exportJobsCsvMutation = useExportJobsCsv();

  const { data, isLoading, isError, error, refetch } = useMyJobs({
    status: activeTab === "all" ? undefined : activeTab,
    offset,
    limit,
  });

  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const fromJob = jobs.length > 0 ? offset + 1 : 0;
  const toJob = offset + jobs.length;
  const pageItems = buildPageItems(currentPage, totalPages);

  useEffect(() => {
    setSelectedJobs(new Set());
    setSelectAll(false);
  }, [offset, activeTab, limit]);

  useEffect(() => {
    if (isLoading) return;
    if (jobs.length > 0) return;
    if (total === 0) return;
    if (offset < total) return;

    setOffset(Math.max(0, offset - limit));
  }, [isLoading, jobs.length, total, offset, limit]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(jobs.map((job) => job.id)));
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
    setSelectAll(newSelected.size === jobs.length);
  };

  const handleViewJob = (jobId: string) => {
    console.log("View job", jobId);
    // TODO: Open view modal
  };

  const handleEditJob = (jobId: string) => {
    console.log("Edit job", jobId);
    // TODO: Open edit modal
  };

  const handleDeleteJob = (jobId: string) => {
    console.log("Delete job", jobId);
    // TODO: Implement delete mutation
  };

  const handleCancelSelected = async () => {
    if (selectedJobs.size === 0 || cancelJobsMutation.isPending) return;

    try {
      await cancelJobsMutation.mutateAsync({
        job_ids: Array.from(selectedJobs),
      });
    } catch (error) {
      console.error("Failed to cancel selected jobs:", error);
    }
  };

  const handleExportToCSV = async () => {
    if (selectedJobs.size === 0 || exportJobsCsvMutation.isPending) return;

    try {
      const blob = await exportJobsCsvMutation.mutateAsync({
        job_ids: Array.from(selectedJobs),
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `jobs_export_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export jobs csv:", error);
    }
  };

  const handlePostNewJob = () => {
    setIsPostJobModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setOffset((currentPage - 2) * limit);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) return;
    setOffset(currentPage * limit);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getBedroomLabel = (bedroomCount: BedroomCount | null) => {
    if (!bedroomCount) return "N/A";
    return bedroomLabelMap[bedroomCount] ?? bedroomCount;
  };

  return (
    <div>
      <PostJobModal open={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#202224]">My Jobs</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRefresh} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
          <Button variant="primary" onClick={handlePostNewJob}>
            Post New Job
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          {statusTabs.map((tab) => {
            const count =
              tab.id === "all" ? total : jobs.filter((job) => job.status === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setOffset(0);
                }}
                className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}{" "}
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading jobs...</div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="text-red-500">
            Failed to load jobs: {error?.message || "Unknown error"}
          </div>
          <Button variant="secondary" onClick={handleRefresh}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-500">No jobs found</div>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && jobs.length > 0 && (
        <>
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
                      Job Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                      Pickup Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">
                      Size
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
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedJobs.has(job.id)}
                          onChange={() => handleSelectJob(job.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#202224] capitalize">
                        {job.job_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="max-w-xs truncate">
                          {job.pickup_address} → {job.delivery_address}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(job.pickup_datetime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {getBedroomLabel(job.bedroom_count)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#202224]">
                        ${job.payout_amount}
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

          <div className="mt-4 flex flex-col gap-4">
            <div className="text-center text-sm text-gray-500">
              Showing {fromJob}-{toJob} of {total} jobs
            </div>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Pagination className="w-auto mx-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1 || isLoading}
                    />
                  </PaginationItem>

                  {pageItems.map((item, index) => (
                    <PaginationItem key={`${item}-${index}`}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={item === currentPage}
                          onClick={() => setOffset((item - 1) * limit)}
                          disabled={isLoading}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || isLoading}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <select
                value={limit}
                onChange={(event) => {
                  const nextLimit = Number(event.target.value);
                  setLimit(nextLimit);
                  setOffset(0);
                }}
                className="h-10 rounded-lg border border-[#D8D8D8] px-3 text-sm text-[#202224] bg-white focus:outline-none focus:border-[#60A5FA]"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          {selectedJobs.size > 0 && (
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                {selectedJobs.size} job{selectedJobs.size > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleCancelSelected}
                  disabled={cancelJobsMutation.isPending || exportJobsCsvMutation.isPending}
                >
                  {cancelJobsMutation.isPending ? "Cancelling..." : "Cancel Selected"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleExportToCSV}
                  disabled={cancelJobsMutation.isPending || exportJobsCsvMutation.isPending}
                >
                  {exportJobsCsvMutation.isPending ? "Exporting..." : "Export to CSV"}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
