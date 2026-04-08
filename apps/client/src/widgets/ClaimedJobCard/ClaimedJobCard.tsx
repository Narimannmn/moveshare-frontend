import { memo, useCallback, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Clock, FileText, MessageSquare, Package, Truck, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { useCreateDirectConversation } from "@/entities/Chat/api/mutations";
import { getJobTitle } from "@/entities/Job";
import type { AppliedJobItem, JobResponse } from "@/entities/Job/schemas";
import { Button, InfoPanel, InfoRow, ProgressStepper, StarRating, Textarea } from "@/shared/ui";

// ============================================
// Types & Constants
// ============================================

export type ClaimedTab = "active" | "in_transit" | "delivered" | "completed" | "disputed";

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
  return `${Math.round(meters / 1609.34)} miles`;
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
    case "documents_ready": return 2;
    case "in_progress":
    case "in_transit": return 3;
    case "delivered":
    case "completed": return 4;
    case "disputed": return 2;
    default: return 1;
  }
};

// ============================================
// DocumentUploadSection (mock)
// ============================================

const DocumentUploadSection = memo(({ onConfirm }: { onConfirm: () => void }) => {
  const [docs, setDocs] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setDocs((prev) => [...prev, `Document_${prev.length + 1}.pdf`]);
      setUploading(false);
      toast.success("Document uploaded");
    }, 800);
  };

  const handleRemove = (index: number) => {
    setDocs((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#D8D8D8] p-4">
      <div className="flex items-center gap-2">
        <FileText className="size-5 text-[#60A5FA]" />
        <h4 className="text-base font-bold text-[#263238]">Documents</h4>
        <span className="text-xs text-[#90A4AE]">Upload required documents (Bill of Lading is mandatory)</span>
      </div>

      {docs.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-[#D8D8D8] bg-[#F9F9F9] px-3 py-2">
              <FileText className="size-4 text-[#60A5FA]" />
              <span className="text-sm text-[#202224]">{doc}</span>
              <button type="button" onClick={() => handleRemove(i)} className="text-[#90A4AE] hover:text-red-500">
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
        className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#D8D8D8] bg-[#F9FAFB] px-4 py-6 text-sm text-[#202224] hover:border-[#60A5FA] hover:bg-[#F0F7FF] transition-colors"
      >
        <Upload className="size-5 text-[#90A4AE]" />
        {uploading ? "Uploading..." : "Click to upload document"}
      </button>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            if (docs.length === 0) {
              toast.error("Please upload at least one document");
              return;
            }
            onConfirm();
          }}
          disabled={docs.length === 0}
        >
          Confirm Documents
        </Button>
      </div>
    </div>
  );
});
DocumentUploadSection.displayName = "DocumentUploadSection";

// ============================================
// StatusBanner
// ============================================

const StatusBanner = memo(({ status }: { status: string }) => {
  const banners: Record<string, { bg: string; border: string; icon: React.ReactNode; title: string; desc: string } | undefined> = {
    assigned: { bg: "bg-[#FFF8E1]", border: "border-[#FFE082]", icon: <Package className="size-5 text-[#F59E0B] shrink-0" />, title: "Waiting for Documents", desc: "Upload required documents and confirm to proceed" },
    documents_ready: { bg: "bg-[#E8F5E9]", border: "border-[#A5D6A7]", icon: <Truck className="size-5 text-[#4CAF50] shrink-0" />, title: "Documents Confirmed — Ready for Pickup", desc: "Start transit when you've picked up the cargo" },
    in_progress: { bg: "bg-[#E3F2FD]", border: "border-[#90CAF9]", icon: <Truck className="size-5 text-[#2196F3] shrink-0" />, title: "In Transit", desc: "Mark as delivered when cargo reaches destination" },
    in_transit: { bg: "bg-[#E3F2FD]", border: "border-[#90CAF9]", icon: <Truck className="size-5 text-[#2196F3] shrink-0" />, title: "In Transit", desc: "Mark as delivered when cargo reaches destination" },
    delivered: { bg: "bg-[#F3E5F5]", border: "border-[#CE93D8]", icon: <Clock className="size-5 text-[#9C27B0] shrink-0" />, title: "Delivered — Waiting for Confirmation", desc: "The poster has 72 hours to confirm delivery. Auto-confirms after that." },
  };

  const b = banners[status];
  if (!b) return null;

  return (
    <div className={`flex items-center gap-3 rounded-lg ${b.bg} border ${b.border} px-4 py-3`}>
      {b.icon}
      <div>
        <p className="text-sm font-semibold text-[#202224]">{b.title}</p>
        <p className="text-xs text-[#666C72] mt-0.5">{b.desc}</p>
      </div>
    </div>
  );
});
StatusBanner.displayName = "StatusBanner";

// ============================================
// ClaimedJobCard
// ============================================

export interface ClaimedJobCardProps {
  item: AppliedJobItem;
  tab: ClaimedTab;
}

export const ClaimedJobCard = memo(({ item, tab }: ClaimedJobCardProps) => {
  const { job } = item;
  const [mockStatus, setMockStatus] = useState<string>(job.status);
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
  const completedSteps = getCompletedSteps(mockStatus);
  const isDisputed = tab === "disputed";

  const handleConfirmDocuments = () => {
    setMockStatus("documents_ready");
    toast.success("Documents confirmed", { description: "You can now start transit" });
  };

  const handleStartTransit = () => {
    setMockStatus("in_transit");
    toast.success("Transit started", { description: "The poster has been notified" });
  };

  const handleMarkDelivered = () => {
    setMockStatus("delivered");
    toast.success("Marked as delivered", { description: "Waiting for poster to confirm" });
  };

  const ChatButton = (
    <Button variant="outline" onClick={handleOpenChat} disabled={createConversation.isPending}>
      <MessageSquare className="mr-2 size-4" />
      {createConversation.isPending ? "Opening..." : "Open Chat"}
    </Button>
  );

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-[#263238]">{title}</h3>
          <span className="text-sm text-[#90A4AE]">Job {toPublicJobId(job.id)}</span>
        </div>
        <span className="text-xl font-bold text-[#202224]">{formatMoney(job.payout_amount)}</span>
      </div>

      <StatusBanner status={mockStatus} />
      <ProgressStepper steps={PROGRESS_STEPS} completedSteps={completedSteps} isDisputed={isDisputed} />

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

      {/* ASSIGNED */}
      {mockStatus === "assigned" && <DocumentUploadSection onConfirm={handleConfirmDocuments} />}

      {/* DOCUMENTS_READY */}
      {mockStatus === "documents_ready" && (
        <div className="flex items-center justify-between">
          {ChatButton}
          <Button variant="primary" onClick={handleStartTransit}>
            <Truck className="mr-2 size-4" /> Start Transit
          </Button>
        </div>
      )}

      {/* IN_TRANSIT */}
      {(mockStatus === "in_progress" || mockStatus === "in_transit") && (
        <div className="flex items-center justify-between">
          {ChatButton}
          <Button variant="primary" onClick={handleMarkDelivered}>
            <Package className="mr-2 size-4" /> Mark as Delivered
          </Button>
        </div>
      )}

      {/* DELIVERED */}
      {mockStatus === "delivered" && (
        <div className="flex items-center justify-between">
          {ChatButton}
          <div className="flex items-center gap-2 text-sm text-[#90A4AE]">
            <Clock className="size-4" /> Waiting for poster to confirm delivery
          </div>
        </div>
      )}

      {/* COMPLETED */}
      {tab === "completed" && (
        <div className="flex flex-col gap-4 rounded-lg bg-[#F8F9FA] p-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-bold text-[#202224]">Leave a Review</h4>
            <p className="text-sm text-[#666C72]">How was your experience with {job.company?.name ?? "this company"}?</p>
            <StarRating rating={reviewRating} onRate={setReviewRating} />
          </div>
          <Textarea bg={false} placeholder="Share your experience..." className="h-25" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline">Skip</Button>
            <Button variant="primary" onClick={() => toast.success("Review submitted!")}>Submit Review</Button>
          </div>
        </div>
      )}

      {/* DISPUTED */}
      {tab === "disputed" && (
        <div className="flex flex-col gap-4 rounded-lg bg-[#FFEBEE] p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-[#EF4444]" />
            <h4 className="text-lg font-bold text-[#202224]">Dispute Details</h4>
          </div>
          <p className="text-sm text-[#202224]">The client claims that 3 pieces of equipment arrived damaged. Our driver reported the equipment was loaded securely and arrived without incident.</p>
          <div className="rounded-lg bg-white border border-[#FFCDD2] p-3">
            <p className="text-xs font-medium text-[#EF4444] uppercase tracking-wide">Payout Status</p>
            <p className="text-sm text-[#202224] mt-1">Payout is frozen until dispute is resolved by admin</p>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline">View Evidence</Button>
            <Button variant="danger" onClick={() => toast.info("Escalated to admin")}>Escalate to Admin</Button>
          </div>
        </div>
      )}
    </div>
  );
});
ClaimedJobCard.displayName = "ClaimedJobCard";
