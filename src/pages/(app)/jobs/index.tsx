import {createFileRoute} from "@tanstack/react-router";
import {useShallow} from "zustand/react/shallow";

import {
  JobCard,
  useAvailableJobs,
  transformJobToCardProps,
  useJobFiltersStore,
  type JobListParams,
} from "@/entities/Job";

import {JobsFilter} from "@/widgets/JobsFilter";

import {Button, PageHeader} from "@shared/ui";

export const Route = createFileRoute("/(app)/jobs/")({
  component: JobsPage,
});

function JobsPage() {
  const filters = useJobFiltersStore(
    useShallow((state): JobListParams => ({
      job_type: state.jobType,
      bedroom_count: state.bedroomCount,
      skip: state.skip,
      limit: state.limit,
    }))
  );
  const resetFilters = useJobFiltersStore((state) => state.actions.resetFilters);

  const {data, isLoading, isError, error, refetch} = useAvailableJobs(filters);

  const handleViewDetails = (id: string | number) => {
    // TODO: Navigate to job detail page when route is created
    console.log("View details for job:", id);
  };

  const handleClaimJob = (id: string | number) => {
    // TODO: Implement claim job mutation
    console.log("Claim job:", id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handlePostNewJob = () => {
    // TODO: Navigate to new job page when route is created
    console.log("Post new job");
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const jobs = data?.jobs.map(transformJobToCardProps) ?? [];

  return (
    <div>
      <PageHeader
        title="Available Jobs"
        actions={
          <>
            <Button
              variant="secondary"
              size="default"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Refresh Jobs"}
            </Button>
            <Button variant="primary" size="default" onClick={handlePostNewJob}>
              Post New Job
            </Button>
          </>
        }
      />

      {/* Main Layout: Filter Sidebar + Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
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
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="text-gray-500">No jobs available</div>
              <Button variant="secondary" size="default" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>
          )}

          {!isLoading && !isError && jobs.length > 0 && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                <div className="mt-6 text-center text-sm text-gray-500">
                  Showing {data.jobs.length} of {data.total} jobs
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
