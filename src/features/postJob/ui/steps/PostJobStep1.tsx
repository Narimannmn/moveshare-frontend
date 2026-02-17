import { useState } from "react";

import type { BedroomCount, JobType } from "@/entities/Job";

import { usePostJobStore } from "../../model/usePostJobStore";
import { MoveDetailsChecklist } from "../MoveDetailsChecklist";

interface PostJobStep1Props {
  onCancel: () => void;
}

type TruckSizeInfo = {
  vehicleLabel: string;
  volume: string;
  items: string[];
  imageSrc: string;
  imageClassName: string;
};

const truckSizeInfo: Record<BedroomCount, TruckSizeInfo> = {
  "1_bedroom": {
    vehicleLabel: "Small Van (15+)",
    volume: "1 Bedroom - 10–15 m³",
    items: ["Bed or sofa", "Small wardrobe", "Up to 10 boxes", "TV, chairs, nightstand"],
    imageSrc: "/assets/figma/post-job/van-1.svg",
    imageClassName: "w-20 h-10",
  },
  "2_bedroom": {
    vehicleLabel: "Medium Truck",
    volume: "2 Bedroom - 20–25 m³",
    items: [
      "2 beds or a bed + sofa",
      "Wardrobe, chest of drawers",
      "Refrigerator, washing machine",
      "Up to 20 boxes",
    ],
    imageSrc: "/assets/figma/post-job/van-1.svg",
    imageClassName: "w-20 h-10",
  },
  "3_bedroom": {
    vehicleLabel: "Medium (20+')",
    volume: "3 Bedroom - 30–35 m³",
    items: [
      "Sofa set, 2–3 beds",
      "Several wardrobes and tables",
      "Home appliances",
      "Up to 30 boxes",
    ],
    imageSrc: "/assets/figma/post-job/trailer-1.svg",
    imageClassName: "w-[73px] h-[37px]",
  },
  "4_bedroom": {
    vehicleLabel: "Medium (20+')",
    volume: "4 Bedroom - 40–45 m³",
    items: [
      "Complete furniture set for a large apartment",
      "Sports or baby equipment",
      "Home appliances",
      "Up to 40 boxes",
    ],
    imageSrc: "/assets/figma/post-job/trailer-1.svg",
    imageClassName: "w-[73px] h-[37px]",
  },
  "5_bedroom": {
    vehicleLabel: "Large (26+')",
    volume: "5 Bedroom - 50–55 m³",
    items: [
      "Full set of furniture and appliances",
      "Outdoor and garage items",
      "Home appliances",
      "Up to 50 boxes",
    ],
    imageSrc: "/assets/figma/post-job/truck-1.svg",
    imageClassName: "w-[78px] h-[42px]",
  },
  "6_plus_bedroom": {
    vehicleLabel: "Large (26+')",
    volume: "6+ Bedroom - 65+ m³",
    items: [
      "Furniture and appliances for the entire house",
      "Garden and garage equipment",
      "Large volume of boxes and miscellaneous items",
    ],
    imageSrc: "/assets/figma/post-job/truck-1.svg",
    imageClassName: "w-[78px] h-[42px]",
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
  const [bedroomCount, setBedroomCount] = useState<BedroomCount | null>(
    formData.bedroomCount ?? "1_bedroom"
  );
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
            label="Residential"
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
          <div className="border border-[#D8D8D8] flex gap-4 items-center p-4 rounded-md">
            <div className="flex flex-col gap-3 items-center justify-center shrink-0 min-w-[92px]">
              <img
                src={truckInfo.imageSrc}
                alt={truckInfo.vehicleLabel}
                className={`${truckInfo.imageClassName} object-contain`}
              />
              <p className="text-sm font-bold text-[#202224] leading-[100%] text-center whitespace-nowrap">
                {truckInfo.vehicleLabel}
              </p>
            </div>
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <p className="text-sm font-bold text-[#2C3E50] leading-[100%]">{truckInfo.volume}</p>
              <ul className="flex flex-col gap-2 pl-[18px]">
                {truckInfo.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs font-normal text-[#202224] leading-[100%] list-disc"
                  >
                    {item}
                  </li>
                ))}
              </ul>
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
        <div className="flex gap-4 justify-end pt-2">
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
              isValid
                ? "bg-[#60A5FA] hover:bg-[#5094E0]"
                : "bg-[rgba(96,165,250,0.6)] cursor-not-allowed"
            }`}
          >
            Next Step
          </button>
        </div>
      </div>

      {/* Right Column: Move Details Checklist */}
      <MoveDetailsChecklist
        step={1}
        preview={{
          jobType,
          bedroomCount,
          description,
        }}
      />
    </div>
  );
};
