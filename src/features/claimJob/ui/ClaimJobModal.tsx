import { useMemo, useState } from "react";

import { X } from "lucide-react";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui";

interface ClaimJobModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  confirmLoading?: boolean;
  jobId: string | null;
  jobTitle?: string;
  payoutAmount?: number;
  cutAmount?: number;
}

const FIXED_CLAIM_FEE = 30;

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const ClaimJobModal = ({
  open,
  onClose,
  onConfirm,
  confirmLoading = false,
  jobId,
  jobTitle,
  payoutAmount = 0,
  cutAmount = 0,
}: ClaimJobModalProps) => {
  // TODO: restore to false when terms checkbox is re-enabled
  const [acceptedTerms] = useState(true);

  const earnAmount = payoutAmount - cutAmount;

  const resolvedTitle = useMemo(() => {
    const normalized = (jobTitle ?? "").trim();
    return normalized.length > 0 ? normalized : "Furniture Delivery";
  }, [jobTitle]);

  const handleConfirm = () => {
    if (!acceptedTerms) return;
    void onConfirm();
  };

  const handleClose = () => {
    onClose();
  };

  const referenceId = useMemo(() => {
    const normalized = (jobId ?? "").trim();
    if (!normalized) return "MS-4821";

    if (normalized.toLowerCase().startsWith("ms-")) {
      return normalized.toUpperCase();
    }

    return `MS-${normalized.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() || "4821"}`;
  }, [jobId]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        className="max-w-[480px] gap-0 p-0 overflow-hidden rounded-lg"
        showClose={false}
        onClose={handleClose}
        aria-describedby="claim-job-description"
      >
        <DialogHeader className="bg-[#60A5FA] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-[24px] font-bold leading-none text-white">
                Claim Job
              </DialogTitle>
              <p className="mt-3 text-base leading-none text-white">
                You will earn {formatMoney(earnAmount)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="mt-1 text-white/90 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
              aria-label="Close"
            >
              <X className="size-6" />
            </button>
          </div>
        </DialogHeader>

        <p id="claim-job-description" className="sr-only">
          Review claim payment details and accept terms before confirming payment.
        </p>

        <div className="space-y-4 px-4 py-6">
          <div className="rounded-lg border-l-4 border-[#60A5FA] bg-[#F0F7FF] px-4 py-4">
            <p className="text-base font-bold leading-none text-[#1A2B4D]">
              For Job #{referenceId}: {resolvedTitle}
            </p>
            <p className="mt-3 text-xs leading-none text-[#5C6F87]">
              Deliver furniture from warehouse to customer locations
            </p>
          </div>

          <div className="border-b border-[#D8D8D8] pb-2">
            <h3 className="text-[16px] font-bold leading-none text-[#1A2B4D]">Payment Details</h3>
          </div>

          <div className="flex items-center justify-between pb-2 text-base leading-none text-[#5C6F87]">
            <span>Description</span>
            <span>Amount</span>
          </div>

          <div className="flex items-center justify-between pb-2">
            <span className="text-base leading-none text-[#5C6F87]">Fixed Claim Fee</span>
            <span className="text-base font-bold leading-none text-[#1A2B4D]">
              {formatMoney(FIXED_CLAIM_FEE)}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2">
            <span className="text-base font-bold leading-none text-[#1A2B4D]">Total to Pay Now</span>
            <span className="text-[17px] font-bold leading-none text-[#70AEFB]">
              {formatMoney(FIXED_CLAIM_FEE)}
            </span>
          </div>

          <div className="rounded-lg border border-[#EAEFF5] bg-[#F9FBFD] px-4 py-4">
            <p className="text-xs leading-[16px] text-[#5C6F87]">
              MoveShare charges a <span className="font-medium text-[#70AEFB]">{formatMoney(FIXED_CLAIM_FEE)}</span> fixed
              fee per job to cover platform operating costs. You&apos;ll receive{" "}
              <span className="font-medium text-[#70AEFB]">{formatMoney(earnAmount)}</span> after
              completing this job.
            </p>
          </div>

          {/* Terms checkbox — hidden until legal documents are ready
          <label className="flex items-center gap-2 text-base leading-none text-[#5C6F87] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="size-4 rounded-[3px] border border-[#D8D8D8] accent-[#60A5FA]"
            />
            <span>
              I agree to the{" "}
              <button type="button" className="font-bold text-[#70AEFB]">
                Terms of Service
              </button>{" "}
              and{" "}
              <button type="button" className="font-bold text-[#70AEFB]">
                Privacy Policy
              </button>
            </span>
          </label>
          */}

        </div>

        <div className="border-t border-[#D8D8D8] bg-white p-4">
          <Button
            variant="primary"
            size="default"
            onClick={handleConfirm}
            disabled={!acceptedTerms}
            loading={confirmLoading}
            className="h-11 w-full rounded-lg text-[16px] font-normal"
          >
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
