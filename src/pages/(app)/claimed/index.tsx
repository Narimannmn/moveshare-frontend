import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

import { useCreateDirectConversation } from "@/entities/Chat/api/mutations";
import { getJobTitle, useAppliedJobs } from "@/entities/Job";
import type { AppliedJobItem, JobResponse } from "@/entities/Job/schemas";
import { Button, PageHeader, Textarea } from "@/shared/ui";

export const Route = createFileRoute("/(app)/claimed/")({
  component: ClaimedJobsPage,
});

// ============================================
// Types & Constants
// ============================================

type ClaimedTab = "active" | "in_transit" | "completed" | "disputed";

const TABS: { key: ClaimedTab; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "in_transit", label: "In Transit" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
];

const TAB_STATUS_MAP: Record<ClaimedTab, string[]> = {
  active: ["assigned"],
  in_transit: ["in_progress"],
  completed: ["completed"],
  disputed: ["disputed"],
};

const PROGRESS_STEPS = ["Claimed", "Documents Shared", "In Transit", "Completed"];


// ============================================
// Helpers
// ============================================

const toCityState = (address: string): string => {
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return address;
  const city = parts[parts.length - 2] ?? "";
  const state = (parts[parts.length - 1] ?? "").split(" ")[0] ?? "";
  return `${city}, ${state}`.trim();
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", year: "numeric" }).format(d);
};

const formatMoney = (value: string): string => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$0";
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatDistance = (meters: number | null | undefined): string => {
  if (!meters) return "N/A";
  const miles = meters / 1609.34;
  return `${Math.round(miles)} miles`;
};

const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds) return "N/A";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours === 0) return `${minutes} min`;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hours`;
};

const toPublicJobId = (id: string): string => `#MS-${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;

const getJobCardTitle = (job: JobResponse): string =>
  getJobTitle(job.bedroom_count, job.job_type);

const getCompletedSteps = (status: string): number => {
  switch (status) {
    case "assigned": return 1;
    case "in_progress": return 3;
    case "completed": return 4;
    case "disputed": return 2;
    default: return 1;
  }
};

const getTabForStatus = (status: string): ClaimedTab => {
  for (const [tab, statuses] of Object.entries(TAB_STATUS_MAP)) {
    if (statuses.includes(status)) return tab as ClaimedTab;
  }
  return "active";
};

// ============================================
// ProgressStepper
// ============================================

const ProgressStepper = memo(({ completedSteps, isDisputed = false }: { completedSteps: number; isDisputed?: boolean }) => (
  <div className="w-full">
    <div className="flex items-center px-4">
      {PROGRESS_STEPS.map((_, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum <= completedSteps;
        const isDisputedStep = isDisputed && stepNum > completedSteps;

        return (
          <div key={stepNum} className="contents">
            {index > 0 && (
              <div className={`h-px flex-1 ${isCompleted ? "bg-[#60A5FA]" : "bg-[#D8D8D8]"}`} />
            )}
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                isCompleted ? "bg-[#60A5FA]" : "bg-[#D8D8D8]"
              }`}
            >
              {isCompleted ? (
                <Check className="size-4" strokeWidth={3} />
              ) : isDisputedStep ? (
                "!"
              ) : (
                stepNum
              )}
            </div>
          </div>
        );
      })}
    </div>
    <div className="mt-2 flex justify-between px-0">
      {PROGRESS_STEPS.map((label, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum <= completedSteps;
        const isDisputedStep = isDisputed && stepNum > completedSteps;
        return (
          <span
            key={label}
            className={`text-center text-sm ${
              isCompleted ? "text-[#263238]" : isDisputedStep ? "text-[#A6A6A6]" : "text-[#90A4AE]"
            }`}
            style={{ width: `${100 / PROGRESS_STEPS.length}%` }}
          >
            {label}
          </span>
        );
      })}
    </div>
  </div>
));
ProgressStepper.displayName = "ProgressStepper";

// ============================================
// InfoRow
// ============================================

const InfoRow = memo(({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center gap-6">
    <span className="w-24 shrink-0 text-sm font-medium text-[#263238]">{label}</span>
    <span className="text-sm text-[#263238]">{value}</span>
  </div>
));
InfoRow.displayName = "InfoRow";

// ============================================
// InfoPanel
// ============================================

const InfoPanel = memo(({ title, children, highlighted = false }: { title: string; children: React.ReactNode; highlighted?: boolean }) => (
  <div className="flex flex-1 flex-col gap-4 rounded-lg bg-[#F9F9F9] p-4">
    <h4 className="text-base font-bold text-[#263238]">{title}</h4>
    <div className={`flex flex-col gap-3.5 ${highlighted ? "rounded-lg bg-[#E6F2FF] p-4" : ""}`}>
      {children}
    </div>
  </div>
));
InfoPanel.displayName = "InfoPanel";

// ============================================
// StarRating
// ============================================

const StarRating = memo(({ rating, onRate }: { rating: number; onRate: (v: number) => void }) => (
  <div className="flex gap-2">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onRate(star)}
        className="text-[#FADB14] transition-transform hover:scale-110"
      >
        <Star className="size-6" fill={star <= rating ? "#FADB14" : "none"} strokeWidth={1.5} />
      </button>
    ))}
  </div>
));
StarRating.displayName = "StarRating";

// ============================================
// ClaimedJobCard
// ============================================

const ClaimedJobCard = memo(({ item, tab }: { item: AppliedJobItem; tab: ClaimedTab }) => {
  const { job } = item;
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const navigate = useNavigate();
  const createConversation = useCreateDirectConversation();

  const handleOpenChat = useCallback(() => {
    const posterUserId = job.company?.user_id;
    if (!posterUserId) {
      toast.error("Unable to open chat", { description: "Company contact information is not available." });
      return;
    }
    createConversation.mutate(posterUserId, {
      onSuccess: (conversation) => {
        navigate({ to: "/chat/$id", params: { id: conversation.id } });
      },
      onError: () => {
        toast.error("Failed to open chat");
      },
    });
  }, [job.company?.user_id, createConversation, navigate]);

  const title = getJobCardTitle(job);
  const completedSteps = getCompletedSteps(job.status);
  const isDisputed = tab === "disputed";

  return (
    <div className="flex flex-col gap-6 rounded-lg bg-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-[#263238]">{title}</h3>
          <span className="text-base text-[#90A4AE]">Job {toPublicJobId(job.id)}</span>
        </div>
        <span className="text-xl font-bold text-[#202224]">{formatMoney(job.payout_amount)}</span>
      </div>

      {/* Progress Stepper */}
      <ProgressStepper completedSteps={completedSteps} isDisputed={isDisputed} />

      {/* Info Panels */}
      <div className="flex gap-4">
        <InfoPanel title="Route Details">
          <InfoRow label="Origin:" value={toCityState(job.pickup_address)} />
          <InfoRow label="Destination:" value={toCityState(job.delivery_address)} />
          <InfoRow label="Distance:" value={formatDistance(job.distance_meters)} />
          <InfoRow label="Est. Duration:" value={formatDuration(job.duration_seconds)} />
        </InfoPanel>

        <InfoPanel title="Schedule">
          <InfoRow label="Pickup:" value={formatDate(job.pickup_datetime)} />
          <InfoRow label="Delivery:" value={formatDate(job.delivery_datetime)} />
          <InfoRow label="Payout:" value={formatMoney(job.payout_amount)} />
          <InfoRow label="Claim Fee:" value={formatMoney(job.cut_amount)} />
        </InfoPanel>

        <InfoPanel title="Contact Info" highlighted>
          <InfoRow label="Company:" value={job.company?.name ?? "N/A"} />
          <InfoRow label="Contact:" value={job.company?.contact_person ?? "N/A"} />
          <InfoRow label="Phone:" value={job.company?.phone_number ?? "N/A"} />
        </InfoPanel>
      </div>

      {/* Active: Actions */}
      {tab === "active" && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleOpenChat} disabled={createConversation.isPending}>
            <MessageSquare className="mr-2 size-4" />
            {createConversation.isPending ? "Opening..." : "Open Chat"}
          </Button>
          <Button variant="primary">Mark as Delivered</Button>
        </div>
      )}

      {/* In Transit: Actions */}
      {tab === "in_transit" && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleOpenChat} disabled={createConversation.isPending}>
            <MessageSquare className="mr-2 size-4" />
            {createConversation.isPending ? "Opening..." : "Open Chat"}
          </Button>
          <Button variant="primary">Complete Delivery</Button>
        </div>
      )}

      {/* Completed: Review */}
      {tab === "completed" && (
        <div className="flex flex-col gap-4 rounded-lg bg-[#F8F9FA] p-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-bold text-[#202224]">Leave a Review</h4>
            <p className="text-base text-[#202224]">
              How was your experience with {job.company?.name ?? "this company"}?
            </p>
            <StarRating rating={reviewRating} onRate={setReviewRating} />
          </div>
          <Textarea
            bg={false}
            placeholder="Share your experience with this company..."
            className="h-[120px]"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline">Skip</Button>
            <Button variant="primary">Submit Review</Button>
          </div>
        </div>
      )}

      {/* Disputed: Details */}
      {tab === "disputed" && (
        <div className="flex flex-col gap-6 rounded-lg bg-[#FFEBEE] p-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-bold text-[#202224]">Dispute Details</h4>
            <p className="text-base text-[#202224]">
              The client claims that 3 pieces of equipment arrived damaged. Our driver reported the
              equipment was loaded securely and arrived without incident.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline">View Evidence</Button>
            <Button variant="danger">Escalate to Admin</Button>
          </div>
        </div>
      )}
    </div>
  );
});
ClaimedJobCard.displayName = "ClaimedJobCard";

// ============================================
// Page Component
// ============================================

function ClaimedJobsPage() {
  const [activeTab, setActiveTab] = useState<ClaimedTab>("active");
  const [offset] = useState(0);
  const limit = 50;

  const { data, isLoading, isError, error } = useAppliedJobs({
    status: "accepted",
    skip: offset,
    limit,
  });

  useEffect(() => {
    if (isError && error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to Load", { description: `Failed to load claimed jobs: ${msg}` });
    }
  }, [isError, error]);

  const items = data?.items ?? [];

  const tabCounts = useMemo(() => {
    const counts: Record<ClaimedTab, number> = { active: 0, in_transit: 0, completed: 0, disputed: 0 };
    for (const item of items) {
      const tab = getTabForStatus(item.job.status);
      counts[tab]++;
    }
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab];
    return items.filter((item) => statuses.includes(item.job.status));
  }, [items, activeTab]);

  return (
    <div>
      <PageHeader title="Claimed Jobs" />

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.key ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}{" "}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tabCounts[tab.key]}
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading claimed jobs...</div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Failed to load jobs: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && filteredItems.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">
            No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} jobs
          </div>
        </div>
      )}

      {/* Cards */}
      {!isLoading && !isError && filteredItems.length > 0 && (
        <div className="flex flex-col gap-6">
          {filteredItems.map((item) => (
            <ClaimedJobCard key={item.application.id} item={item} tab={activeTab} />
          ))}
        </div>
      )}
    </div>
  );
}
