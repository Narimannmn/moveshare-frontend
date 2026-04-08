import { useMemo } from "react";

import { Check } from "lucide-react";

import { Button, Dialog, DialogContent, DialogTitle } from "@shared/ui";

interface ClaimJobSuccessModalProps {
  open: boolean;
  onClose: () => void;
  jobId?: string | null;
  sessionId?: string | null;
  paymentMethodLabel?: string;
  onViewReceipt?: () => void;
  onMessageCompany?: () => void;
}

const FIXED_CLAIM_FEE = 30;

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatJobReference = (jobId?: string | null) => {
  const normalized = (jobId ?? "").trim();
  if (!normalized) return "MS-4821";

  if (normalized.toLowerCase().startsWith("ms-")) {
    return normalized.toUpperCase();
  }

  return `MS-${normalized.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() || "4821"}`;
};

const formatTransactionId = (sessionId?: string | null) => {
  const normalized = (sessionId ?? "").trim();
  if (!normalized) return "TX-789456123";

  const clean = normalized.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `TX-${clean.slice(-9) || "789456123"}`;
};

const formatPaymentDate = () =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

export const ClaimJobSuccessModal = ({
  open,
  onClose,
  jobId,
  sessionId,
  paymentMethodLabel = "Card via Stripe",
  onViewReceipt,
  onMessageCompany,
}: ClaimJobSuccessModalProps) => {
  const jobReference = useMemo(() => formatJobReference(jobId), [jobId]);
  const transactionId = useMemo(() => formatTransactionId(sessionId), [sessionId]);
  const paidAt = useMemo(() => formatPaymentDate(), []);

  const handleViewReceipt = () => {
    if (onViewReceipt) {
      onViewReceipt();
      return;
    }
    onClose();
  };

  const handleMessageCompany = () => {
    if (onMessageCompany) {
      onMessageCompany();
      return;
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="max-w-[430px] gap-0 p-0"
        showClose={false}
        onClose={onClose}
        aria-describedby="claim-job-success-description"
      >
        <div className="flex flex-col items-center gap-4 px-6 py-6">
          <div
            className="flex h-[70px] w-[70px] items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #00B09B 0%, #96C93D 100%)",
            }}
          >
            <Check className="h-8 w-8 text-white" strokeWidth={3} />
          </div>

          <DialogTitle className="text-center text-[24px] font-bold leading-none text-[#2C3E50]">
            Payment Successful!
          </DialogTitle>

          <p
            id="claim-job-success-description"
            className="max-w-[320px] text-center text-[16px] leading-tight text-[#2C3E50]"
          >
            Your payment of {formatMoney(FIXED_CLAIM_FEE)} for claiming the Job #{jobReference} has
            been processed successfully.
          </p>

          <div className="w-full rounded-xl bg-[#F8F9FA] px-6 py-3">
            <div className="flex items-center justify-between gap-4 py-1 text-[16px] leading-none text-[#333333]">
              <span>Transaction ID</span>
              <span>{transactionId}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-1 text-[16px] leading-none text-[#333333]">
              <span>Payment Method</span>
              <span>{paymentMethodLabel}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-1 text-[16px] leading-none text-[#333333]">
              <span>Date</span>
              <span>{paidAt}</span>
            </div>
          </div>

          <div className="flex w-full items-center gap-2">
            <Button
              type="button"
              variant="primary"
              size="default"
              className="h-11 flex-1 rounded-lg text-[16px]"
              onClick={handleViewReceipt}
            >
              View Receipt
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="default"
              className="h-11 flex-1 rounded-lg text-[16px]"
              onClick={handleMessageCompany}
            >
              Message Company
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
