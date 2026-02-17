import { useState } from "react";

import type { JobType, BedroomCount } from "@/entities/Job";

import { Button, Textarea } from "@shared/ui";

import { usePostJobStore } from "../../model/usePostJobStore";

interface PostJobStep1Props {
  onCancel: () => void;
}

const truckSizeInfo: Record<BedroomCount, { name: string; volume: string; items: string[][] }> = {
  "1_bedroom": {
    name: "Small Van (15+)",
    volume: "1 Bedroom - 10–15 m³",
    items: [
      ["Bed or sofa", "Up to 10 boxes"],
      ["Small wardrobe", "TV, chairs, nightstand"],
    ],
  },
  "2_bedroom": {
    name: "Medium Van (20+)",
    volume: "2 Bedrooms - 20–25 m³",
    items: [
      ["2 Beds or sofas", "Up to 20 boxes"],
      ["Medium wardrobe", "Appliances"],
    ],
  },
  "3_bedroom": {
    name: "Large Van (30+)",
    volume: "3 Bedrooms - 30–35 m³",
    items: [
      ["3 Beds", "Up to 30 boxes"],
      ["Large wardrobe", "Full kitchen"],
    ],
  },
  "4_bedroom": {
    name: "Small Truck (40+)",
    volume: "4 Bedrooms - 40–45 m³",
    items: [
      ["4 Beds", "Up to 40 boxes"],
      ["Multiple wardrobes", "Full apartment"],
    ],
  },
  "5_bedroom": {
    name: "Medium Truck (50+)",
    volume: "5 Bedrooms - 50–55 m³",
    items: [
      ["5 Beds", "Up to 50 boxes"],
      ["Large wardrobes", "Large house"],
    ],
  },
  "6_plus_bedroom": {
    name: "Large Truck (60+)",
    volume: "6+ Bedrooms - 60+ m³",
    items: [
      ["6+ Beds", "60+ boxes"],
      ["Multiple large wardrobes", "Very large house"],
    ],
  },
};

interface RadioBoxProps {
  label: string;
  value: string;
  selectedValue: string | null;
  onChange: (value: string) => void;
}

const RadioBox = ({ label, value, selectedValue, onChange }: RadioBoxProps) => {
  const isSelected = selectedValue === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`border border-[#D8D8D8] flex gap-2 h-11 items-center px-4 rounded-lg w-full ${
        isSelected ? "bg-white" : "bg-white"
      }`}
    >
      <div className="relative size-6 shrink-0">
        {isSelected ? (
          <div className="bg-white border-2 border-[#60A5FA] rounded-full size-6 flex items-center justify-center">
            <div className="bg-[#60A5FA] rounded-full size-[14px]" />
          </div>
        ) : (
          <div className="bg-white border border-[#D8D8D8] rounded-full size-6" />
        )}
      </div>
      <p className="font-normal text-sm text-[#202224]">{label}</p>
    </button>
  );
};

export const PostJobStep1 = ({ onCancel }: PostJobStep1Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const nextStep = usePostJobStore((state) => state.actions.nextStep);

  const [jobType, setJobType] = useState<JobType | null>(formData.jobType);
  const [bedroomCount, setBedroomCount] = useState<BedroomCount | null>(formData.bedroomCount);
  const [description, setDescription] = useState(formData.description);

  const handleNext = () => {
    updateFormData({
      jobType: jobType!,
      bedroomCount,
      description,
    });
    nextStep();
  };

  const isValid = jobType && bedroomCount && description.trim().length > 0;

  const truckInfo = bedroomCount ? truckSizeInfo[bedroomCount] : null;

  return (
    <div className="flex gap-6">
      {/* Left Column: Form */}
      <div className="flex-1 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <p className="text-sm font-normal text-[#202224]">Step 1/4</p>
          <div className="w-full flex">
            <div className="flex-1 h-1.5 bg-[#60A5FA] rounded-bl-[98px] rounded-tl-[98px] rounded-br-[50px] rounded-tr-[50px]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
          </div>
        </div>

        {/* Job Type */}
        <div className="flex gap-4">
          <RadioBox
            label="Resdential"
            value="residential"
            selectedValue={jobType}
            onChange={(value) => setJobType(value as JobType)}
          />
          <RadioBox
            label="Office"
            value="office"
            selectedValue={jobType}
            onChange={(value) => setJobType(value as JobType)}
          />
          <RadioBox
            label="Storage"
            value="storage"
            selectedValue={jobType}
            onChange={(value) => setJobType(value as JobType)}
          />
        </div>

        {/* Number of Rooms */}
        <div className="space-y-2">
          <p className="text-base font-bold text-[#202224]">
            Number of rooms <span className="text-red-600">*</span>
          </p>
          <div className="flex gap-4">
            <div className="flex-1 space-y-4">
              <RadioBox
                label="1 Bedroom"
                value="1_bedroom"
                selectedValue={bedroomCount}
                onChange={(value) => setBedroomCount(value as BedroomCount)}
              />
              <RadioBox
                label="3 Bedroom"
                value="3_bedroom"
                selectedValue={bedroomCount}
                onChange={(value) => setBedroomCount(value as BedroomCount)}
              />
              <RadioBox
                label="5 Bedroom"
                value="5_bedroom"
                selectedValue={bedroomCount}
                onChange={(value) => setBedroomCount(value as BedroomCount)}
              />
            </div>
            <div className="flex-1 space-y-4">
              <RadioBox
                label="2 Bedroom"
                value="2_bedroom"
                selectedValue={bedroomCount}
                onChange={(value) => setBedroomCount(value as BedroomCount)}
              />
              <RadioBox
                label="4 Bedroom"
                value="4_bedroom"
                selectedValue={bedroomCount}
                onChange={(value) => setBedroomCount(value as BedroomCount)}
              />
              <RadioBox
                label="6 + Bedroom"
                value="6_plus_bedroom"
                selectedValue={bedroomCount}
                onChange={(value) => setBedroomCount(value as BedroomCount)}
              />
            </div>
          </div>
        </div>

        {/* Truck Size Info */}
        {truckInfo && (
          <div className="border border-[#D8D8D8] flex gap-4 h-[124px] items-center p-4 rounded-md">
            <div className="flex flex-col gap-2 items-center justify-center shrink-0">
              <div className="h-10 w-20 flex items-center justify-center">
                <svg className="w-20 h-10 -scale-y-100 rotate-180" viewBox="0 0 80 40" fill="none">
                  <path
                    d="M10 25h15l5-10h20v10h5a5 5 0 110 10h-5v-5H10v5H5a5 5 0 110-10h5v-10z"
                    fill="#60A5FA"
                  />
                </svg>
              </div>
              <p className="text-sm font-bold text-[#2C3E50] whitespace-nowrap">{truckInfo.name}</p>
            </div>
            <div className="flex-1 flex flex-col gap-4 justify-center">
              <p className="text-sm font-bold text-[#2C3E50]">{truckInfo.volume}</p>
              <div className="flex gap-4 text-xs font-normal text-[#202224]">
                {truckInfo.items.map((column, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {column.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start gap-1">
                        <span className="text-[#202224]">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">Label</p>
          <div className="border border-[#D8D8D8] rounded-lg px-4 py-2.5 h-[120px]">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the job requirements, special instructions, and any important details..."
              className="w-full h-full resize-none text-base font-normal text-[#202224] placeholder:text-[#A6A6A6] focus:outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-lg px-4 py-2.5 text-base font-normal text-[#202224] border border-[#D8D8D8] bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!isValid}
            className={`h-11 rounded-lg px-4 py-2.5 text-base font-normal text-white min-w-[120px] ${
              isValid ? "bg-[#60A5FA] hover:bg-[#5094E0]" : "bg-[rgba(96,165,250,0.6)] cursor-not-allowed"
            }`}
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Right Column: Move Details Checklist */}
      <div className="flex-1 bg-[#F1F4F9] rounded-lg p-4 h-fit space-y-6">
        <p className="text-base font-bold text-[#263238]">Move details</p>
        <div className="space-y-4">
          <ChecklistItem label="Job Title:" completed status="Select" />
          <ChecklistItem label="Number of rooms:" completed status="Select the number of rooms" />
          <ChecklistItem label="Truck:" completed status="Select" />
          <ChecklistItem label="Job Description:" completed status="Select" />
          <ChecklistItem label="Pickup Location:" status="Select" />
          <ChecklistItem label="Delivery Location:" status="Select" />
          <ChecklistItem label="Additional Services:" status="Select" />
          <ChecklistItem label="Loading Assistance:" status="Select" />
          <ChecklistItem label="Images of Items / PDF of Inventory List:" status="Select" />
          <ChecklistItem label="Pickup Date:" status="Select" />
          <ChecklistItem label="Pickup Time Window:" status="Select" />
          <ChecklistItem label="Delivery Date:" status="Select" />
          <ChecklistItem label="Delivery Time Window:" status="Select" />
          <ChecklistItem label="Payout Amount:" status="Select" />
          <ChecklistItem label="Payment ($):" status="Select" />
        </div>
      </div>
    </div>
  );
};

interface ChecklistItemProps {
  label: string;
  status: string;
  completed?: boolean;
}

const ChecklistItem = ({ label, status, completed = false }: ChecklistItemProps) => {
  return (
    <div className={`flex gap-1 items-center ${!completed ? "opacity-50" : ""}`}>
      <div className="flex gap-2 items-center shrink-0">
        <div className="size-6 flex items-center justify-center">
          <svg className="size-6" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4"
              stroke="#60A5FA"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm font-bold text-[#2C3E50]">{label}</p>
      </div>
      <p className="text-sm font-normal text-[#A6A6A6]">{status}</p>
    </div>
  );
};
