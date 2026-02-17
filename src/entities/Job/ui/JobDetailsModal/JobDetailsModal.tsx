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
    weight: string;
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
  blue: "bg-[#e3f2fd] text-[#333]",
  green: "bg-[#e8f5e9] text-[#333]",
  yellow: "bg-[#fff8e1] text-[#333]",
} as const;

const DetailField = memo(
  ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-bold text-[#90A4AE] leading-none">{label}</span>
      <span className="text-[14px] text-[#202224] leading-[18px]">{value}</span>
    </div>
  )
);

DetailField.displayName = "DetailField";

const formatNumber = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) return "N/A";
  return value.toLocaleString();
};

const formatMoney = (value: number | null): string => {
  if (value === null || Number.isNaN(value)) return "N/A";
  return `$${value.toLocaleString()}`;
};

export const JobDetailsModal = memo(
  ({ open, onClose, onClaimJob, data }: JobDetailsModalProps) => {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent
          className="w-[min(820.96px,calc(100vw-48px))] max-w-[820.96px] gap-0 p-0 overflow-hidden border border-[#D8D8D8] rounded-[8px]"
          showClose={false}
        >
          <div className="bg-[#60A5FA] h-[63px] flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-white min-w-0">
              <span className="text-[24px] leading-none font-bold truncate">{data.title}</span>
              <span className="text-[16px] leading-none font-normal truncate">{data.route}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border-0 p-0 text-white/95 hover:text-white transition-colors shrink-0 focus:outline-none"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-6 pb-0">
            <div className="bg-[#F5F6FA] rounded-[8px] px-4 py-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-[11px] min-w-0">
                  <div className="bg-[#E3F2FD] rounded-[10px] size-12 flex items-center justify-center shrink-0">
                    <span className="text-[32px] leading-none font-bold text-[#2196F3]">
                      {data.company.initials}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[20px] leading-none font-bold text-[#333333] truncate">
                      {data.company.name}
                    </span>
                    <span className="text-[12px] text-[#90A4AE] leading-none">
                      {data.company.reviews === null ? "N/A" : `${data.company.reviews} reviews`}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-6 shrink-0">
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold text-[#90A4AE] leading-none whitespace-nowrap">
                      Average Response Time
                    </span>
                    <span className="text-[14px] text-[#202224] leading-none">
                      {data.company.avgResponseTime}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-bold text-[#90A4AE] leading-none whitespace-nowrap">
                      Completed Jobs
                    </span>
                    <span className="text-[14px] text-[#202224] leading-none">
                      {formatNumber(data.company.completedJobs)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                {data.company.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={cn(
                      "h-6 px-4 rounded-[76px] text-[12px] leading-none inline-flex items-center",
                      badgeStyles[badge.type]
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-[237px_326.79px_145.17px] justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#263238] leading-none">
                  Locations
                </h3>
                <div className="flex flex-col gap-4">
                  <DetailField
                    label="Pickup Address"
                    value={data.locations.pickupAddress}
                  />
                  <DetailField
                    label="House/Stairs/Elevator (Pickup)"
                    value={data.locations.pickupAccess}
                  />
                  <DetailField
                    label="Estimated Walk Distance (Pickup)"
                    value={data.locations.pickupWalkDistance}
                  />
                  <DetailField
                    label="Delivery Address"
                    value={data.locations.deliveryAddress}
                  />
                  <DetailField
                    label="House/Stairs/Elevator (Delivery)"
                    value={data.locations.deliveryAccess}
                  />
                  <DetailField
                    label="Estimated Walk Distance (Delivery)"
                    value={data.locations.deliveryWalkDistance}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#263238] leading-none">
                  Job Details
                </h3>
                <div className="grid grid-cols-[141.62px_145.17px] gap-x-10">
                  <div className="flex flex-col gap-4">
                    <DetailField
                      label="Job ID"
                      value={data.jobDetails.jobId}
                    />
                    <DetailField
                      label="Distance"
                      value={data.jobDetails.distance}
                    />
                    <DetailField
                      label="Truck Size"
                      value={data.jobDetails.truckSize}
                    />
                    <DetailField
                      label="Weight"
                      value={data.jobDetails.weight}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <DetailField
                      label="Posted"
                      value={data.jobDetails.posted}
                    />
                    <DetailField
                      label="Estimated Time"
                      value={data.jobDetails.estimatedTime}
                    />
                    <DetailField
                      label="Cargo Type"
                      value={data.jobDetails.cargoType}
                    />
                    <DetailField
                      label="Volume"
                      value={data.jobDetails.volume}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-[16px] font-bold text-[#263238] leading-none">
                  Schedule
                </h3>
                <div className="flex flex-col gap-4">
                  <DetailField
                    label="Pickup Date"
                    value={data.schedule.pickupDate}
                  />
                  <DetailField
                    label="Delivery Date"
                    value={data.schedule.deliveryDate}
                  />
                  <DetailField
                    label="Pickup Time"
                    value={data.schedule.pickupTime}
                  />
                  <DetailField
                    label="Delivery Time"
                    value={data.schedule.deliveryTime}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <span className="text-[16px] text-[#202224] leading-none">Description</span>
              <div className="border border-[#D8D8D8] rounded-[8px] h-10 px-4 flex items-center">
                <p className="text-[16px] text-[#A6A6A6] leading-none truncate">
                  {data.description ||
                    "Brief description of the additional services indicated above..."}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-bold text-[#2C3E50] leading-none">
                  Additional Services
                </h3>
                <div className="flex flex-wrap gap-4">
                  {data.additionalServices.length > 0 ? data.additionalServices.map((service) => (
                    <span
                      key={service}
                      className="bg-[#F1F4F9] h-[34px] px-4 rounded-[64px] text-[14px] text-[#202224] text-center leading-none inline-flex items-center"
                    >
                      {service}
                    </span>
                  )) : (
                    <span className="text-[14px] text-[#90A4AE]">No additional services</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-[20px] font-bold text-[#2C3E50] leading-none">
                  Payment Details
                </h3>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2 min-w-[84px]">
                    <span className="text-[12px] font-bold text-[#90A4AE] leading-none">
                      Payout
                    </span>
                    <span className="text-[16px] leading-none font-bold text-[#202224]">
                      {formatMoney(data.payment.payout)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[84px]">
                    <span className="text-[12px] font-bold text-[#90A4AE] leading-none">
                      CUT
                    </span>
                    <span className="text-[16px] leading-none font-bold text-[#202224]">
                      {formatMoney(data.payment.cut)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[84px]">
                    <span className="text-[12px] font-bold text-[#90A4AE] leading-none">
                      Platform Fee
                    </span>
                    <span className="text-[16px] leading-none font-bold text-[#202224]">
                      {formatMoney(data.payment.platformFee)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#D8D8D8] h-[76px] px-4 py-4 flex justify-end items-start bg-white">
            <Button
              variant="primary"
              size="default"
              className="w-[105px] h-[44px] text-[16px] font-normal rounded-[8px]"
              onClick={onClaimJob}
            >
              Claim Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

JobDetailsModal.displayName = "JobDetailsModal";
