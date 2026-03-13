import { memo } from "react";

import { X } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { Button, Dialog, DialogContent } from "@shared/ui";

export interface JobDetailsData {
  id: string;
  title: string;
  route: string;
  company: {
    initials: string;
    name: string;
    reviews: number | null;
    avgResponseTime: string;
    completedJobs: number | null;
    badges: { label: string; type: "blue" | "green" | "yellow" }[];
  };
  locations: {
    pickupAddress: string;
    pickupAccess: string;
    pickupWalkDistance: string;
    deliveryAddress: string;
    deliveryAccess: string;
    deliveryWalkDistance: string;
  };
  jobDetails: {
    jobId: string;
    posted: string;
    distance: string;
    estimatedTime: string;
    truckSize: string;
    cargoType: string;
    volume: string;
  };
  schedule: {
    pickupDate: string;
    deliveryDate: string;
    pickupTime: string;
    deliveryTime: string;
  };
  description: string;
  additionalServices: string[];
  payment: {
    payout: number | null;
    cut: number | null;
    platformFee: number | null;
  };
}

interface JobDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onClaimJob?: () => void;
  data: JobDetailsData;
}

const badgeStyles = {
  blue: "bg-[#E3F2FD] text-[#333333]",
  green: "bg-[#E8F5E9] text-[#333333]",
  yellow: "bg-[#FFF8E1] text-[#333333]",
} as const;

const ensureText = (value: string | null | undefined) => {
  const normalized = (value ?? "").trim();
  return normalized.length > 0 ? normalized : "N/A";
};

const formatNumber = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) return "N/A";
  return value.toLocaleString();
};

const formatMoney = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) return "N/A";
  return `$${value.toLocaleString()}`;
};

const DetailField = memo(({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-0 flex-col gap-2">
    <span className="text-[12px] font-bold leading-none text-[#90A4AE]">{label}</span>
    <span className="text-[14px] leading-[18px] text-[#202224] break-words">{ensureText(value)}</span>
  </div>
));

DetailField.displayName = "DetailField";

export const JobDetailsModal = memo(({ open, onClose, onClaimJob, data }: JobDetailsModalProps) => {
  const badges =
    data.company.badges.length > 0
      ? data.company.badges
      : [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showClose={false}
        className="w-[min(1024px,calc(100vw-48px))] max-w-[1024px] border-0 bg-transparent p-0 shadow-none rounded-none overflow-visible data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
      >
        <div className="overflow-hidden rounded-[8px] bg-white">
          <div className="flex h-[70px] items-center justify-between bg-[#60A5FA] px-4">
            <div className="flex min-w-0 items-center gap-2 text-white">
              <span className="truncate text-[20px] font-bold leading-tight">{ensureText(data.title)}</span>
              <span className="truncate text-[14px] font-normal leading-tight">{ensureText(data.route)}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 border-0 bg-transparent p-0 text-white/90 transition-colors hover:text-white focus:outline-none"
              aria-label="Close"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="bg-white px-6 py-4">
            <div className="rounded-[8px] bg-[#F5F6FA] p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-[10px] bg-[#E3F2FD]">
                    <span className="text-[20px] font-bold leading-none text-[#2196F3]">
                      {ensureText(data.company.initials)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[18px] font-bold leading-none text-[#333333]">
                      {ensureText(data.company.name)}
                    </p>
                    <p className="mt-2 text-[12px] leading-none text-[#90A4AE]">
                      {data.company.reviews === null ? "N/A" : `${data.company.reviews} reviews`}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-8">
                  <div>
                    <p className="text-[12px] font-bold leading-none text-[#90A4AE]">Completed Jobs</p>
                    <p className="mt-2 text-[14px] leading-none text-[#202224]">
                      {formatNumber(data.company.completedJobs)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={cn(
                      "inline-flex h-7 items-center rounded-[76px] px-4 text-[12px] leading-none",
                      badgeStyles[badge.type]
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-6" style={{ gridTemplateColumns: "1.2fr 1fr 0.9fr" }}>
              <div className="min-w-0">
                <h3 className="text-[16px] font-bold leading-none text-[#263238]">Locations</h3>
                <div className="mt-3 flex flex-col gap-3">
                  <DetailField label="Pickup Address" value={data.locations.pickupAddress} />
                  <DetailField label="House/Stairs/Elevator (Pickup)" value={data.locations.pickupAccess} />
                  <DetailField
                    label="Estimated Walk Distance (Pickup)"
                    value={data.locations.pickupWalkDistance}
                  />
                  <DetailField label="Delivery Address" value={data.locations.deliveryAddress} />
                  <DetailField label="House/Stairs/Elevator (Delivery)" value={data.locations.deliveryAccess} />
                  <DetailField
                    label="Estimated Walk Distance (Delivery)"
                    value={data.locations.deliveryWalkDistance}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[16px] font-bold leading-none text-[#263238]">Job Details</h3>
                <div className="mt-3 grid min-w-0 grid-cols-2 gap-x-8">
                  <div className="flex min-w-0 flex-col gap-3">
                    <DetailField label="Job ID" value={data.jobDetails.jobId} />
                    <DetailField label="Distance" value={data.jobDetails.distance} />
                    <DetailField label="Truck Size" value={data.jobDetails.truckSize} />

                  </div>
                  <div className="flex min-w-0 flex-col gap-3">
                    <DetailField label="Posted" value={data.jobDetails.posted} />
                    <DetailField label="Estimated Time" value={data.jobDetails.estimatedTime} />
                    <DetailField label="Cargo Type" value={data.jobDetails.cargoType} />
                    <DetailField label="Volume" value={data.jobDetails.volume} />
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[16px] font-bold leading-none text-[#263238]">Schedule</h3>
                <div className="mt-3 flex min-w-0 flex-col gap-3">
                  <DetailField label="Pickup Date" value={data.schedule.pickupDate} />
                  <DetailField label="Delivery Date" value={data.schedule.deliveryDate} />
                  <DetailField label="Pickup Time" value={data.schedule.pickupTime} />
                  <DetailField label="Delivery Time" value={data.schedule.deliveryTime} />
                </div>
              </div>
            </div>

            <div className="mt-3 min-w-0">
              <p className="text-[16px] leading-none text-[#202224]">Description</p>
              <div className="mt-2 flex h-10 items-center rounded-[8px] border border-[#D8D8D8] px-4">
                <p className="min-w-0 truncate text-[16px] leading-none text-[#A6A6A6]">
                  {ensureText(data.description) === "N/A"
                    ? "Brief description of the additional services indicated above..."
                    : ensureText(data.description)}
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-6 pt-3" style={{ gridTemplateColumns: "1fr 380px" }}>
              <div className="min-w-0">
                <h3 className="text-[20px] font-bold leading-none text-[#2C3E50]">Additional Services</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {data.additionalServices.length > 0 ? (
                    data.additionalServices.map((service) => (
                      <span
                        key={service}
                        className="inline-flex h-[34px] items-center rounded-[64px] bg-[#F1F4F9] px-4 text-[14px] text-[#202224]"
                      >
                        {service}
                      </span>
                    ))
                  ) : (
                    <span className="text-[14px] text-[#90A4AE]">No additional services</span>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <h3 className="text-[20px] font-bold leading-none text-[#2C3E50]">Payment Details</h3>
                <div className="mt-3 flex gap-8">
                  <div>
                    <p className="text-[12px] font-bold leading-none text-[#90A4AE]">Payout</p>
                    <p className="mt-2 text-[16px] font-bold leading-none text-[#202224]">
                      {formatMoney(data.payment.payout)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-none text-[#90A4AE]">CUT</p>
                    <p className="mt-2 text-[16px] font-bold leading-none text-[#202224]">
                      {formatMoney(data.payment.cut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold leading-none text-[#90A4AE]">Platform Fee</p>
                    <p className="mt-2 text-[16px] font-bold leading-none text-[#202224]">
                      {formatMoney(data.payment.platformFee)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-[64px] items-center justify-end bg-white px-6">
            <Button
              variant="primary"
              size="default"
              onClick={onClaimJob}
              className="h-[42px] min-w-[110px] rounded-[8px] text-[16px]"
            >
              Claim Job
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

JobDetailsModal.displayName = "JobDetailsModal";
