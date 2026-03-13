import { useEffect, useMemo, useRef, useState } from "react";

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
  useConfirmClaimCheckoutSession,
  useCreateClaimCheckoutSession,
  useJob,
  useJobFiltersStore,
} from "@/entities/Job";

import { useCreateDirectConversation } from "@/entities/Chat";
import { ClaimJobModal, ClaimJobSuccessModal } from "@/features/claimJob";
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
  const [claimJobId, setClaimJobId] = useState<string | null>(null);
  const setPage = useJobFiltersStore((state) => state.actions.setPage);
  const setLimit = useJobFiltersStore((state) => state.actions.setLimit);
  const createClaimCheckoutSessionMutation = useCreateClaimCheckoutSession();
  const confirmClaimCheckoutSessionMutation = useConfirmClaimCheckoutSession();
  const createDirectConversationMutation = useCreateDirectConversation();
  const navigate = Route.useNavigate();

  const filters = useJobFiltersStore(
    useShallow(
      (state): JobListParams => ({
        job_type: state.jobType,
        bedroom_count: state.bedroomCount,
        origin: state.origin,
        destination: state.destination,
        offset: state.offset,
        limit: state.limit,
      })
    )
  );

  const { data, isLoading, isError, error, refetch } = useAvailableJobs(filters);
  const { data: selectedJobData } = useJob(selectedJobId ?? "");

  const initialClaimSuccessData = useMemo(() => {
    if (typeof window === "undefined") return null;

    const params = new URLSearchParams(window.location.search);
    if (params.get("claim_success") !== "1") return null;

    return {
      jobId: params.get("job_id"),
      sessionId: params.get("session_id"),
    };
  }, []);

  const [claimSuccessData, setClaimSuccessData] = useState<{
    jobId: string | null;
    sessionId: string | null;
    receiptUrl: string | null;
    posterUserId: string | null;
  } | null>(null);
  const isConfirmingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !initialClaimSuccessData) return;

    const params = new URLSearchParams(window.location.search);
    params.delete("claim_success");
    params.delete("claim_cancelled");
    params.delete("job_id");
    params.delete("session_id");

    const search = params.toString();
    const cleanedUrl = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", cleanedUrl);
  }, [initialClaimSuccessData]);

  useEffect(() => {
    const sessionId = initialClaimSuccessData?.sessionId;
    if (!sessionId || isConfirmingRef.current) return;

    isConfirmingRef.current = true;

    const confirmCheckout = async () => {
      try {
        const result = await confirmClaimCheckoutSessionMutation.mutateAsync({
          session_id: sessionId,
          job_id: initialClaimSuccessData.jobId,
        });

        setClaimSuccessData({
          jobId: result.job_id,
          sessionId,
          receiptUrl: result.receipt_url ?? null,
          posterUserId: result.poster_user_id ?? null,
        });
        refetch();
      } catch (error) {
        console.error("Failed to confirm claim checkout session:", error);
      }
    };

    void confirmCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClaimSuccessData]);

  const handleViewDetails = (id: string | number) => {
    setSelectedJobId(String(id));
  };

  const handleClaimJob = (id: string | number) => {
    setClaimJobId(String(id));
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
  const claimJobTitle =
    jobs.find((job) => String(job.id) === claimJobId)?.title ??
    (claimJobId && selectedJobId === claimJobId ? selectedJobDetails.title : undefined);
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
          if (!selectedJobId) return;
          handleClaimJob(selectedJobId);
          setSelectedJobId(null);
        }}
        data={selectedJobDetails}
      />
      <ClaimJobModal
        open={claimJobId !== null}
        onClose={() => setClaimJobId(null)}
        onConfirm={async () => {
          if (!claimJobId) return;

          try {
            const origin = window.location.origin;
            const checkout = await createClaimCheckoutSessionMutation.mutateAsync({
              jobId: claimJobId,
              request: {
                success_url: `${origin}/jobs?claim_success=1&job_id=${claimJobId}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/jobs?claim_cancelled=1&job_id=${claimJobId}`,
              },
            });

            window.location.href = checkout.checkout_url;
          } catch (error) {
            console.error("Failed to create claim checkout session:", error);
          }
        }}
        confirmLoading={createClaimCheckoutSessionMutation.isPending}
        jobId={claimJobId}
        jobTitle={claimJobTitle}
      />
      <ClaimJobSuccessModal
        open={claimSuccessData !== null}
        onClose={() => setClaimSuccessData(null)}
        jobId={claimSuccessData?.jobId}
        sessionId={claimSuccessData?.sessionId}
        onViewReceipt={() => {
          if (claimSuccessData?.receiptUrl) {
            window.open(claimSuccessData.receiptUrl, "_blank", "noopener,noreferrer");
          }
        }}
        onMessageCompany={async () => {
          const posterUserId = claimSuccessData?.posterUserId;
          setClaimSuccessData(null);

          if (posterUserId) {
            try {
              const conversation = await createDirectConversationMutation.mutateAsync(posterUserId);
              void navigate({ to: "/chat/$id", params: { id: conversation.id } });
            } catch {
              void navigate({ to: "/chat" });
            }
          } else {
            void navigate({ to: "/chat" });
          }
        }}
      />

      {/* Main Layout: Filter Sidebar + Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-4 xl:gap-5">
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
                className="grid gap-4 xl:gap-5"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 290px), 1fr))" }}
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
