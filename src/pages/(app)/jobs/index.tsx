import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { useShallow } from "zustand/react/shallow";

import {
  JobCard,
  JobDetailsModal,
  type JobListParams,
  createEmptyJobDetailsData,
  transformJobToDetailsData,
  transformJobToCardProps,
  useAvailableJobs,
  useJob,
  useJobFiltersStore,
} from "@/entities/Job";

import { PostJobModal } from "@/features/postJob";

import { JobsFilter } from "@/widgets/JobsFilter";

import {
  Button,
  PageHeader,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shared/ui";

export const Route = createFileRoute("/(app)/jobs/")({
  component: JobsPage,
});

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

function JobsPage() {
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const setPage = useJobFiltersStore((state) => state.actions.setPage);
  const setLimit = useJobFiltersStore((state) => state.actions.setLimit);

  const filters = useJobFiltersStore(
    useShallow(
      (state): JobListParams => ({
        job_type: state.jobType,
        bedroom_count: state.bedroomCount,
        offset: state.offset,
        limit: state.limit,
      })
    )
  );

  const { data, isLoading, isError, error, refetch } = useAvailableJobs(filters);
  const { data: selectedJobData } = useJob(selectedJobId ?? "");

  const handleViewDetails = (id: string | number) => {
    setSelectedJobId(String(id));
  };

  const handleClaimJob = (id: string | number) => {
    // TODO: Implement claim job mutation
    console.log("Claim job:", id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePostNewJob = () => {
    setIsPostJobModalOpen(true);
  };

  const jobs = data?.jobs.map(transformJobToCardProps) ?? [];
  const selectedJobDetails = selectedJobData
    ? transformJobToDetailsData(selectedJobData)
    : createEmptyJobDetailsData();
  const effectiveOffset = filters.offset;
  const currentPage = Math.floor(effectiveOffset / filters.limit) + 1;
  const totalJobs = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalJobs / filters.limit));
  const fromJob = jobs.length > 0 ? effectiveOffset + 1 : 0;
  const toJob = effectiveOffset + jobs.length;
  const pageItems = buildPageItems(currentPage, totalPages);

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    setPage(currentPage - 2);
  };

  const handleNextPage = () => {
    if (currentPage >= totalPages) return;
    setPage(currentPage);
  };

  return (
    <div>
      <PageHeader
        title="Available Jobs"
        actions={
          <>
            <Button variant="secondary" size="default" onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh Jobs"}
            </Button>
            <Button variant="primary" size="default" onClick={handlePostNewJob}>
              Post New Job
            </Button>
          </>
        }
      />

      <PostJobModal open={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} />

      <JobDetailsModal
        open={selectedJobId !== null}
        onClose={() => setSelectedJobId(null)}
        onClaimJob={() => {
          if (selectedJobId) handleClaimJob(selectedJobId);
        }}
        data={selectedJobDetails}
      />

      {/* Main Layout: Filter Sidebar + Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left Column: Filters */}
        <aside className="sticky self-start">
          <JobsFilter />
        </aside>

        {/* Right Column: Jobs Grid */}
        <div>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading jobs...</div>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-red-500">
                Failed to load jobs: {error?.message || "Unknown error"}
              </div>
              <Button variant="secondary" size="default" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !isError && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500">No jobs available</div>
            </div>
          )}

          {!isLoading && !isError && jobs.length > 0 && (
            <>
              <div
                className="grid gap-6"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))" }}
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    {...job}
                    onViewDetails={handleViewDetails}
                    onClaimJob={handleClaimJob}
                  />
                ))}
              </div>

              {/* Pagination info */}
              {data && (
                <div className="mt-6 flex flex-col gap-4">
                  <div className="text-center text-sm text-gray-500">
                    Showing {fromJob}-{toJob} of {totalJobs} jobs
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
                                onClick={() => setPage(item - 1)}
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
                      value={filters.limit}
                      onChange={(event) => setLimit(Number(event.target.value))}
                      className="h-10 rounded-lg border border-[#D8D8D8] px-3 text-sm text-[#202224] bg-white focus:outline-none focus:border-[#60A5FA]"
                    >
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
