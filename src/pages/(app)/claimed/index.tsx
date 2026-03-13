import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Star, X } from "lucide-react";
import { toast } from "sonner";

import { useCreateDirectConversation } from "@/entities/Chat/api/mutations";
import { useAppliedJobs } from "@/entities/Job";
import type { AppliedJobItem, JobResponse } from "@/entities/Job/schemas";
import { Button, Textarea } from "@/shared/ui";

export const Route = createFileRoute("/(app)/claimed/")({
  component: ClaimedJobsPage,
});

// ============================================
// Constants
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

const BEDROOM_LABELS: Record<string, string> = {
  "1_bedroom": "1 Bedroom Move",
  "2_bedroom": "2 Bedroom Move",
  "3_bedroom": "3 Bedroom Move",
  "4_bedroom": "4 Bedroom Move",
  "5_bedroom": "5 Bedroom Move",
  "6_plus_bedroom": "6+ Bedroom Move",
};

const JOB_TYPE_LABELS: Record<string, string> = {
  residential: "Residential Move",
  office: "Office Move",
  storage: "Storage Move",
};

const PROGRESS_STEPS = ["Claimed", "Documents Shared", "In Transit", "Completed"];

// ============================================
// Helpers
// ============================================

const toCityState = (address: string): string => {
  const parts = address
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
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

const toPublicJobId = (id: string): string => `#MS-${id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;

const getJobTitle = (job: JobResponse): string =>
  job.bedroom_count
    ? (BEDROOM_LABELS[job.bedroom_count] ?? JOB_TYPE_LABELS[job.job_type] ?? "Move")
    : (JOB_TYPE_LABELS[job.job_type] ?? "Move");

const getCompletedSteps = (status: string): number => {
  switch (status) {
    case "assigned":
      return 1;
    case "in_progress":
      return 3;
    case "completed":
      return 4;
    case "disputed":
      return 2;
    default:
      return 1;
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

interface ProgressStepperProps {
  completedSteps: number;
  isDisputed?: boolean;
}

const ProgressStepper = memo(({ completedSteps, isDisputed = false }: ProgressStepperProps) => (
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
                isCompleted ? "bg-[#60A5FA]" : isDisputedStep ? "bg-[#D8D8D8]" : "bg-[#D8D8D8]"
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
// InfoField
// ============================================

interface InfoFieldProps {
  label: string;
  value: string;
}

const InfoField = memo(({ label, value }: InfoFieldProps) => (
  <div className="flex items-center gap-6">
    <span className="w-[95px] shrink-0 text-[15px] font-medium text-[#263238]">{label}</span>
    <span className="text-[15px] text-[#263238]">{value}</span>
  </div>
));
InfoField.displayName = "InfoField";

// ============================================
// InfoCard
// ============================================

interface InfoCardProps {
  title: string;
  fields: InfoFieldProps[];
  highlighted?: boolean;
}

const InfoCard = memo(({ title, fields, highlighted = false }: InfoCardProps) => (
  <div className="flex flex-1 flex-col gap-4 rounded-lg bg-[#F9F9F9] p-4">
    <h4 className="text-base font-bold text-[#263238]">{title}</h4>
    <div className={`flex flex-col gap-3.5 ${highlighted ? "rounded-lg bg-[#E6F2FF] p-4" : ""}`}>
      {fields.map((f) => (
        <InfoField key={f.label} label={f.label} value={f.value} />
      ))}
    </div>
  </div>
));
InfoCard.displayName = "InfoCard";

// ============================================
// StarRating
// ============================================

interface StarRatingProps {
  rating: number;
  onRate: (value: number) => void;
}

const StarRating = memo(({ rating, onRate }: StarRatingProps) => (
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
// DocumentCard
// ============================================

const DocumentCard = memo(({ name }: { name: string }) => (
  <div className="w-[160px] shrink-0 overflow-hidden rounded-lg border border-[#D8D8D8]">
    <div className="relative flex h-[80px] items-center justify-center rounded-t-lg bg-[#F5F5F5]">
      <span className="text-lg">📑</span>
      <button
        type="button"
        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center text-[#90A4AE] hover:text-[#263238]"
      >
        <X className="size-3" />
      </button>
    </div>
    <div className="flex items-center justify-center p-2.5">
      <span className="text-center text-[13px] text-black">{name}</span>
    </div>
  </div>
));
DocumentCard.displayName = "DocumentCard";

// ============================================
// ClaimedJobCard
// ============================================

interface ClaimedJobCardProps {
  item: AppliedJobItem;
  tab: ClaimedTab;
}

const ClaimedJobCard = memo(({ item, tab }: ClaimedJobCardProps) => {
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

  const title = getJobTitle(job);
  const completedSteps = getCompletedSteps(job.status);
  const isDisputed = tab === "disputed";

  const routeFields: InfoFieldProps[] = [
    { label: "Origin:", value: toCityState(job.pickup_address) },
    { label: "Destination:", value: toCityState(job.delivery_address) },
    { label: "Distance:", value: "N/A" },
    { label: "Est. Duration:", value: "N/A" },
  ];

  const scheduleFields: InfoFieldProps[] = [
    { label: "Pickup:", value: formatDate(job.pickup_datetime) },
    { label: "Delivery:", value: formatDate(job.delivery_datetime) },
    { label: "Payout:", value: formatMoney(job.payout_amount) },
    { label: "Claim Fee:", value: formatMoney(job.cut_amount) },
  ];

  const contactFields: InfoFieldProps[] = [
    { label: "Company:", value: job.company?.name ?? "N/A" },
    { label: "Contact:", value: job.company?.contact_person ?? "N/A" },
    { label: "Phone:", value: job.company?.phone_number ?? "N/A" },
    { label: "Email:", value: "N/A" },
  ];

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

      {/* Info Columns */}
      <div className="flex gap-4">
        <InfoCard title="Route Details" fields={routeFields} />
        <InfoCard title="Schedule" fields={scheduleFields} />
        <InfoCard title="Contact Info" fields={contactFields} highlighted />
      </div>

      {/* Documents Section (active tab only) */}
      {tab === "active" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm">📄</span>
            <h4 className="text-xl font-bold text-[#263238]">Documents</h4>
          </div>
          <div className="flex gap-4">
            <DocumentCard name="Bill of Lading.pdf" />
            <DocumentCard name="Bill of Lading.pdf" />
            <DocumentCard name="Bill of Lading.pdf" />
            <div className="flex w-[160px] shrink-0 flex-col items-center justify-center gap-2.5 rounded-lg border border-dashed border-[#D8D8D8] px-4 py-6">
              <span className="text-center text-sm text-[#202224]">Upload Document</span>
              <span className="text-center text-xs text-[#A6A6A6]">Click to upload or drag & drop</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions (active tab) */}
      {tab === "active" && (
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleOpenChat} disabled={createConversation.isPending}>
            {createConversation.isPending ? "Opening..." : "Open Chat"}
          </Button>
          <Button variant="primary">Mark as Delivered</Button>
        </div>
      )}

      {/* Review Section (completed tab) */}
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

      {/* Dispute Section (disputed tab) */}
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
// Tab Component
// ============================================

interface TabButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const TabButton = memo(({ label, count, isActive, onClick }: TabButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-10 items-center gap-1.5 border-b-2 px-4 transition-colors ${
      isActive
        ? "border-[#60A5FA] text-[#60A5FA] font-bold"
        : "border-[#DDD] text-[#90A4AE] font-normal hover:text-[#263238]"
    }`}
  >
    <span className="text-base">{label}</span>
    <span
      className={`flex h-[18px] min-w-[22px] items-center justify-center rounded-[10px] px-1.5 text-xs ${
        isActive ? "bg-[#60A5FA] text-white" : "bg-[#E0E0E0] text-[#202224] font-medium"
      }`}
    >
      {count}
    </span>
  </button>
));
TabButton.displayName = "TabButton";

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

  // Count per tab
  const tabCounts = useMemo(() => {
    const counts: Record<ClaimedTab, number> = { active: 0, in_transit: 0, completed: 0, disputed: 0 };
    for (const item of items) {
      const tab = getTabForStatus(item.job.status);
      counts[tab]++;
    }
    return counts;
  }, [items]);

  // Filtered items for current tab
  const filteredItems = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab];
    return items.filter((item) => statuses.includes(item.job.status));
  }, [items, activeTab]);

  const handleTabChange = useCallback((tab: ClaimedTab) => {
    setActiveTab(tab);
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return <div className="py-8 text-center text-base text-[#90A4AE]">Loading claimed jobs...</div>;
    }

    if (isError) {
      return <div className="py-8 text-center text-base text-[#90A4AE]">Unable to load jobs</div>;
    }

    if (filteredItems.length === 0) {
      return (
        <div className="py-8 text-center text-base text-[#90A4AE]">
          No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} jobs
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {filteredItems.map((item) => (
          <ClaimedJobCard key={item.application.id} item={item} tab={activeTab} />
        ))}
      </div>
    );
  }, [isLoading, isError, filteredItems, activeTab]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-[#D8D8D8]">
        {TABS.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            count={tabCounts[tab.key]}
            isActive={activeTab === tab.key}
            onClick={() => handleTabChange(tab.key)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">{content}</div>
    </div>
  );
}
