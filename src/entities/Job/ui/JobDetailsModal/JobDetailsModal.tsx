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
    reviews: number;
    avgResponseTime: string;
    completedJobs: number;
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
    payout: number;
    cut: number;
    platformFee: number;
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
      <span className="text-xs font-bold text-[#90a4ae]">{label}</span>
      <span className="text-sm text-[#202224]">{value}</span>
    </div>
  )
);

DetailField.displayName = "DetailField";

export const JobDetailsModal = memo(
  ({ open, onClose, onClaimJob, data }: JobDetailsModalProps) => {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent
          className="max-w-[800px] max-h-[90vh] overflow-y-auto p-0"
          showClose={false}
        >
          {/* Header */}
          <div className="bg-[#60a5fa] flex items-center justify-between px-4 py-4 rounded-t-lg">
            <div className="flex items-center gap-2 text-white">
              <span className="text-2xl font-bold">{data.title}</span>
              <span className="text-base">{data.route}</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 px-4 py-6">
            {/* Company Info */}
            <div className="bg-[#f5f6fa] rounded-lg p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#e3f2fd] rounded-[10px] size-12 flex items-center justify-center">
                    <span className="text-xl font-bold text-[#2196f3]">
                      {data.company.initials}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-bold text-[#333]">
                      {data.company.name}
                    </span>
                    <span className="text-xs text-[#90a4ae]">
                      {data.company.reviews} reviews
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#90a4ae]">
                      Average Response Time
                    </span>
                    <span className="text-sm text-[#202224]">
                      {data.company.avgResponseTime}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#90a4ae]">
                      Completed Jobs
                    </span>
                    <span className="text-sm text-[#202224]">
                      {data.company.completedJobs}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                {data.company.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs",
                      badgeStyles[badge.type]
                    )}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Three Column Details */}
            <div className="grid grid-cols-3 gap-10">
              {/* Locations */}
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#263238]">
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

              {/* Job Details */}
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#263238]">
                  Job Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <DetailField
                    label="Job ID"
                    value={data.jobDetails.jobId}
                  />
                  <DetailField
                    label="Posted"
                    value={data.jobDetails.posted}
                  />
                  <DetailField
                    label="Distance"
                    value={data.jobDetails.distance}
                  />
                  <DetailField
                    label="Estimated Time"
                    value={data.jobDetails.estimatedTime}
                  />
                  <DetailField
                    label="Truck Size"
                    value={data.jobDetails.truckSize}
                  />
                  <DetailField
                    label="Cargo Type"
                    value={data.jobDetails.cargoType}
                  />
                  <DetailField
                    label="Weight"
                    value={data.jobDetails.weight}
                  />
                  <DetailField
                    label="Volume"
                    value={data.jobDetails.volume}
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="flex flex-col gap-4">
                <h3 className="text-base font-bold text-[#263238]">
                  Schedule
                </h3>
                <div className="grid grid-cols-1 gap-4">
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

            {/* Description */}
            <div className="flex flex-col gap-2">
              <span className="text-base text-[#202224]">Description</span>
              <div className="border border-[#d8d8d8] rounded-lg px-4 py-2.5 min-h-[120px]">
                <p className="text-base text-[#a6a6a6]">
                  {data.description ||
                    "Brief description of the additional services indicated above..."}
                </p>
              </div>
            </div>

            {/* Additional Services + Payment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#2c3e50]">
                  Additional Services
                </h3>
                <div className="flex flex-wrap gap-4">
                  {data.additionalServices.map((service) => (
                    <span
                      key={service}
                      className="bg-[#f1f4f9] px-4 py-2 rounded-full text-sm text-[#202224] text-center"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#2c3e50]">
                  Payment Details
                </h3>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#90a4ae]">
                      Payout
                    </span>
                    <span className="text-base font-bold text-[#202224]">
                      ${data.payment.payout.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#90a4ae]">
                      CUT
                    </span>
                    <span className="text-base font-bold text-[#202224]">
                      ${data.payment.cut.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#90a4ae]">
                      Platform Fee
                    </span>
                    <span className="text-base font-bold text-[#202224]">
                      ${data.payment.platformFee.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#d8d8d8] flex justify-end p-4 rounded-b-lg">
            <Button
              variant="primary"
              size="default"
              className="w-[400px]"
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
