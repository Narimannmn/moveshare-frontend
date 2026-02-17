import { useMemo } from "react";

import type { PostJobFormData } from "../model/usePostJobStore";
import { usePostJobStore } from "../model/usePostJobStore";

type ChecklistStep = 1 | 2 | 3 | 4;

interface MoveDetailsChecklistProps {
  step: ChecklistStep;
  preview?: Partial<PostJobFormData>;
}

interface ChecklistItemView {
  label: string;
  value: string;
  isCompleted: boolean;
  requiredStep: ChecklistStep;
}

const formatJobType = (jobType: string | null): string => {
  if (!jobType) return "Select";

  return jobType.charAt(0).toUpperCase() + jobType.slice(1);
};

const formatBedroomCount = (bedroomCount: string | null): string => {
  if (!bedroomCount) return "Select the number of rooms";

  if (bedroomCount === "6_plus_bedroom") return "6+ bedroom";

  return bedroomCount.replace("_bedroom", " bedroom").replace("_", " ");
};

const getTruckLabel = (bedroomCount: string | null): string => {
  if (!bedroomCount) return "Select";

  if (bedroomCount === "1_bedroom" || bedroomCount === "2_bedroom") return "Small Van";
  if (bedroomCount === "3_bedroom" || bedroomCount === "4_bedroom") return "Medium (20+')";

  return "Large (26+')";
};

const formatDescription = (description: string): string => {
  const normalized = description.trim().replace(/\s+/g, " ");
  if (!normalized) return "Select";
  if (normalized.length <= 38) return normalized;
  return `${normalized.slice(0, 35)}...`;
};

const formatAdditionalServices = (servicesRaw: string): string => {
  const services = servicesRaw
    .split(",")
    .map((service) => service.trim())
    .filter(Boolean);

  if (services.length === 0) return "Select";

  const labelMap: Record<string, string> = {
    packing_boxes: "Packing boxes",
    bulky_items: "Bulky items",
    inventory_list: "Inventory list",
    hosting: "Hoisting",
    hoisting: "Hoisting",
  };

  return services.map((service) => labelMap[service] ?? service).join(", ");
};

const formatHelpers = (count: number): string => {
  if (count <= 0) return "Select";
  return `${count} helper${count > 1 ? "s" : ""}`;
};

const formatFileCount = (count: number): string => {
  if (count <= 0) return "Select";
  return `${count} photo${count > 1 ? "s" : ""}`;
};

const formatDate = (value: string): string => {
  if (!value) return "Select";
  const [date] = value.split("T");
  return date || "Select";
};

const formatTime = (value: string): string => {
  if (!value) return "Select";
  const time = value.split("T")[1]?.substring(0, 5);
  return time || "Select";
};

const formatMoney = (value: string): string => {
  if (!value.trim()) return "Select";
  return `$${value}`;
};

const CheckIcon = ({ completed }: { completed: boolean }) => {
  return (
    <div className="size-6 flex items-center justify-center shrink-0">
      <div className={`size-4 rounded-full flex items-center justify-center ${completed ? "bg-[#2ECC71]" : "bg-[#D8D8D8]"}`}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M2 5L4 7L8 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export const MoveDetailsChecklist = ({ step, preview }: MoveDetailsChecklistProps) => {
  const formData = usePostJobStore((state) => state.formData);
  const viewData = useMemo(() => ({ ...formData, ...(preview ?? {}) }), [formData, preview]);

  const items = useMemo<ChecklistItemView[]>(
    () => [
      {
        label: "Job Title:",
        value: formatJobType(viewData.jobType),
        isCompleted: !!viewData.jobType,
        requiredStep: 1,
      },
      {
        label: "Number of rooms:",
        value: formatBedroomCount(viewData.bedroomCount),
        isCompleted: !!viewData.bedroomCount,
        requiredStep: 1,
      },
      {
        label: "Truck:",
        value: getTruckLabel(viewData.bedroomCount),
        isCompleted: !!viewData.bedroomCount,
        requiredStep: 1,
      },
      {
        label: "Job Description:",
        value: formatDescription(viewData.description),
        isCompleted: viewData.description.trim().length > 0,
        requiredStep: 1,
      },
      {
        label: "Pickup Location:",
        value: viewData.pickupAddress.trim() || "Select",
        isCompleted: viewData.pickupAddress.trim().length > 0,
        requiredStep: 2,
      },
      {
        label: "Delivery Location:",
        value: viewData.deliveryAddress.trim() || "Select",
        isCompleted: viewData.deliveryAddress.trim().length > 0,
        requiredStep: 2,
      },
      {
        label: "Additional Services:",
        value: formatAdditionalServices(viewData.additionalServices),
        isCompleted: viewData.additionalServices.trim().length > 0,
        requiredStep: 3,
      },
      {
        label: "Loading Assistance:",
        value: formatHelpers(viewData.loadingAssistanceCount),
        isCompleted: viewData.loadingAssistanceCount > 0,
        requiredStep: 3,
      },
      {
        label: "Images of Items / PDF of Inventory List:",
        value: formatFileCount(viewData.uploadedFilesCount),
        isCompleted: viewData.uploadedFilesCount > 0,
        requiredStep: 3,
      },
      {
        label: "Pickup Date:",
        value: formatDate(viewData.pickupDatetime),
        isCompleted: !!viewData.pickupDatetime,
        requiredStep: 4,
      },
      {
        label: "Pickup Time Window:",
        value: formatTime(viewData.pickupDatetime),
        isCompleted: !!viewData.pickupDatetime,
        requiredStep: 4,
      },
      {
        label: "Delivery Date:",
        value: formatDate(viewData.deliveryDatetime),
        isCompleted: !!viewData.deliveryDatetime,
        requiredStep: 4,
      },
      {
        label: "Delivery Time Window:",
        value: formatTime(viewData.deliveryDatetime),
        isCompleted: !!viewData.deliveryDatetime,
        requiredStep: 4,
      },
      {
        label: "Payout Amount:",
        value: formatMoney(viewData.payoutAmount),
        isCompleted: viewData.payoutAmount.trim().length > 0,
        requiredStep: 4,
      },
      {
        label: "Payment ($):",
        value: formatMoney(viewData.cutAmount),
        isCompleted: viewData.cutAmount.trim().length > 0,
        requiredStep: 4,
      },
    ],
    [viewData]
  );

  return (
    <div className="flex-1 bg-[#F1F4F9] rounded-lg p-4 h-fit space-y-6">
      <p className="text-base font-bold text-[#263238] leading-[100%]">Move details</p>

      <div className="space-y-4">
        {items.map((item) => {
          const isEnabled = step >= item.requiredStep;

          return (
            <div key={item.label} className={`flex gap-1 items-center ${!isEnabled ? "opacity-50" : ""}`}>
              <div className="flex gap-2 items-center shrink-0">
                <CheckIcon completed={item.isCompleted} />
                <p className="text-sm font-bold text-[#2C3E50] leading-[100%]">{item.label}</p>
              </div>

              <p
                className={`text-sm font-normal leading-[100%] ${
                  item.isCompleted ? "text-[#202224]" : "text-[#A6A6A6]"
                }`}
              >
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
