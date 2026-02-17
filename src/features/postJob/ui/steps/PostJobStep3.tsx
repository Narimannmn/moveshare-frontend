import { useState } from "react";

import { Checkbox } from "@shared/ui";

import { usePostJobStore } from "../../model/usePostJobStore";

interface PostJobStep3Props {
  onCancel: () => void;
}

export const PostJobStep3 = ({ onCancel }: PostJobStep3Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const nextStep = usePostJobStore((state) => state.actions.nextStep);
  const prevStep = usePostJobStore((state) => state.actions.prevStep);

  const [packingBoxes, setPackingBoxes] = useState(true);
  const [bulkyItems, setBulkyItems] = useState(false);
  const [inventoryList, setInventoryList] = useState(false);
  const [hoisting, setHoisting] = useState(false);

  const [loadingAssistance, setLoadingAssistance] = useState(formData.loadingAssistanceCount || 1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleNext = () => {
    const services = [];
    if (packingBoxes) services.push("packing_boxes");
    if (bulkyItems) services.push("bulky_items");
    if (inventoryList) services.push("inventory_list");
    if (hoisting) services.push("hosting");

    updateFormData({
      additionalServices: services.join(","),
      loadingAssistanceCount: loadingAssistance,
    });
    nextStep();
  };

  const handleBack = () => {
    prevStep();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const isValid = loadingAssistance > 0;

  return (
    <div className="flex gap-6">
      {/* Left Column: Form */}
      <div className="flex-1 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <p className="text-sm font-normal text-[#202224]">Step 3/4</p>
          <div className="w-full flex">
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA] rounded-br-[50px] rounded-tr-[50px]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
          </div>
        </div>

        {/* Additional Services */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Additional Services <span className="text-red-600">*</span>
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#D8D8D8] rounded-lg p-4 flex items-center gap-3">
              <Checkbox checked={packingBoxes} onCheckedChange={(checked) => setPackingBoxes(!!checked)} />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#202224]">Packing Boxes</p>
                <p className="text-xs text-[#A6A6A6]">(hourly fee)</p>
              </div>
            </div>

            <div className="border border-[#D8D8D8] rounded-lg p-4 flex items-center gap-3">
              <Checkbox checked={bulkyItems} onCheckedChange={(checked) => setBulkyItems(!!checked)} />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#202224]">Bulky Items (piano, safe)</p>
                <p className="text-xs text-[#A6A6A6]">(add. fee)</p>
              </div>
            </div>

            <div className="border border-[#D8D8D8] rounded-lg p-4 flex items-center gap-3">
              <Checkbox checked={inventoryList} onCheckedChange={(checked) => setInventoryList(!!checked)} />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#202224]">Inventory List</p>
              </div>
            </div>

            <div className="border border-[#D8D8D8] rounded-lg p-4 flex items-center gap-3">
              <Checkbox checked={hoisting} onCheckedChange={(checked) => setHoisting(!!checked)} />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#202224]">Hoisting</p>
                <p className="text-xs text-[#A6A6A6]">(add. fee)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Assistance */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Loading Assistance <span className="text-red-600">*</span>
          </p>
          <select
            value={loadingAssistance}
            onChange={(e) => setLoadingAssistance(Number(e.target.value))}
            className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA] bg-white"
          >
            <option value={1}>1 helper</option>
            <option value={2}>2 helpers</option>
            <option value={3}>3 helpers</option>
            <option value={4}>4 helpers</option>
            <option value={5}>5+ helpers</option>
          </select>
        </div>

        {/* Images Upload */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Images of Items / PDF of Inventory List <span className="text-red-600">*</span>
          </p>

          <div className="border-2 border-dashed border-[#D8D8D8] rounded-lg p-8 flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-base font-bold text-[#202224] mb-2">Upload Photos</p>
              <p className="text-sm text-[#A6A6A6]">Drag & drop images here or click to browse</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="h-11 rounded-lg px-4 py-2.5 text-base font-normal text-white bg-[#60A5FA] hover:bg-[#5094E0] cursor-pointer"
            >
              Choose Files
            </label>
            {uploadedFiles.length > 0 && (
              <div className="w-full mt-4">
                <p className="text-sm font-medium text-[#202224] mb-2">
                  {uploadedFiles.length} file(s) uploaded
                </p>
                <div className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <p key={index} className="text-xs text-[#666C72]">
                      {file.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleBack}
            className="h-11 rounded-lg px-4 py-2.5 text-base font-normal text-[#202224] border border-[#D8D8D8] bg-white hover:bg-gray-50"
          >
            Back
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
      <MoveDetailsChecklist step={3} />
    </div>
  );
};

const MoveDetailsChecklist = ({ step }: { step: number }) => {
  const formData = usePostJobStore((state) => state.formData);

  const items = [
    { label: "Job Title:", status: formData.jobType || "Select", completed: !!formData.jobType },
    { label: "Number of rooms:", status: formData.bedroomCount ? `${formData.bedroomCount}` : "Select", completed: !!formData.bedroomCount },
    { label: "Truck:", status: "Select", completed: step > 1 },
    { label: "Job Description:", status: formData.description ? "Completed" : "Select", completed: !!formData.description },
    { label: "Pickup Location:", status: formData.pickupAddress || "Select", completed: !!formData.pickupAddress },
    { label: "Delivery Location:", status: formData.deliveryAddress || "Select", completed: !!formData.deliveryAddress },
    { label: "Additional Services:", status: formData.additionalServices || "Select", completed: step >= 3 && !!formData.additionalServices },
    { label: "Loading Assistance:", status: formData.loadingAssistanceCount ? `${formData.loadingAssistanceCount} helper(s)` : "Select", completed: step >= 3 },
    { label: "Images of Items / PDF of Inventory List:", status: "5 photo", completed: step >= 3 },
    { label: "Pickup Date:", status: "Select", completed: step > 3 },
    { label: "Pickup Time Window:", status: "Select", completed: step > 3 },
    { label: "Delivery Date:", status: "Select", completed: step > 3 },
    { label: "Delivery Time Window:", status: "Select", completed: step > 3 },
    { label: "Payout Amount:", status: "Select", completed: step > 3 },
    { label: "Payment ($):", status: "Select", completed: step > 3 },
  ];

  return (
    <div className="flex-1 bg-[#F1F4F9] rounded-lg p-4 h-fit space-y-6">
      <p className="text-base font-bold text-[#263238]">Move details</p>
      <div className="space-y-4">
        {items.map((item, index) => (
          <ChecklistItem key={index} {...item} />
        ))}
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
