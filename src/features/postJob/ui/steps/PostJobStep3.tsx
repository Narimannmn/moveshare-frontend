import { useEffect, useState } from "react";

import { Checkbox } from "@shared/ui";

import { usePostJobStore } from "../../model/usePostJobStore";
import { MoveDetailsChecklist } from "../MoveDetailsChecklist";

interface PostJobStep3Props {
  onCancel: () => void;
}

const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "application/pdf"]);

const parseAdditionalServices = (additionalServices: string): Set<string> =>
  new Set(
    additionalServices
      .split(",")
      .map((service) => service.trim())
      .filter(Boolean)
  );

export const PostJobStep3 = ({ onCancel: _onCancel }: PostJobStep3Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const nextStep = usePostJobStore((state) => state.actions.nextStep);
  const prevStep = usePostJobStore((state) => state.actions.prevStep);

  const selectedServices = parseAdditionalServices(formData.additionalServices);

  const [packingBoxes, setPackingBoxes] = useState(selectedServices.has("packing_boxes"));
  const [bulkyItems, setBulkyItems] = useState(selectedServices.has("bulky_items"));
  const [inventoryList, setInventoryList] = useState(selectedServices.has("inventory_list"));
  const [hoisting, setHoisting] = useState(
    selectedServices.has("hosting") || selectedServices.has("hoisting")
  );
  useEffect(() => {
    const services = parseAdditionalServices(formData.additionalServices);
    setPackingBoxes(services.has("packing_boxes"));
    setBulkyItems(services.has("bulky_items"));
    setInventoryList(services.has("inventory_list"));
    setHoisting(services.has("hosting") || services.has("hoisting"));
  }, [formData.additionalServices]);

  const [loadingAssistance, setLoadingAssistance] = useState(formData.loadingAssistanceCount || 1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(formData.uploadedFiles ?? []);
  const [fileError, setFileError] = useState<string | null>(null);
  useEffect(() => {
    setLoadingAssistance(formData.loadingAssistanceCount || 1);
  }, [formData.loadingAssistanceCount]);
  useEffect(() => {
    setUploadedFiles(formData.uploadedFiles ?? []);
  }, [formData.uploadedFiles]);

  const selectedServicesValue = [
    packingBoxes ? "packing_boxes" : "",
    bulkyItems ? "bulky_items" : "",
    inventoryList ? "inventory_list" : "",
    hoisting ? "hosting" : "",
  ]
    .filter(Boolean)
    .join(",");

  const handleNext = () => {
    updateFormData({
      additionalServices: selectedServicesValue,
      loadingAssistanceCount: loadingAssistance,
      uploadedFilesCount: uploadedFiles.length,
      uploadedFiles,
    });
    nextStep();
  };

  const handleBack = () => {
    updateFormData({
      additionalServices: selectedServicesValue,
      loadingAssistanceCount: loadingAssistance,
      uploadedFilesCount: uploadedFiles.length,
      uploadedFiles,
    });
    prevStep();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        if (ALLOWED_FILE_TYPES.has(file.type)) {
          return true;
        }
        const lowerName = file.name.toLowerCase();
        return (
          lowerName.endsWith(".jpg") ||
          lowerName.endsWith(".jpeg") ||
          lowerName.endsWith(".png") ||
          lowerName.endsWith(".pdf")
        );
      });

      if (validFiles.length !== files.length) {
        setFileError("Only JPG, JPEG, PNG images and PDF files are allowed.");
      } else {
        setFileError(null);
      }

      setUploadedFiles(validFiles);
    }
  };

  const isValid = loadingAssistance > 0 && uploadedFiles.length > 0;

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
              <Checkbox
                checked={packingBoxes}
                onCheckedChange={(checked) => setPackingBoxes(!!checked)}
              />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#202224]">Packing Boxes</p>
                <p className="text-xs text-[#A6A6A6]">(hourly fee)</p>
              </div>
            </div>

            <div className="border border-[#D8D8D8] rounded-lg p-4 flex items-center gap-3">
              <Checkbox
                checked={bulkyItems}
                onCheckedChange={(checked) => setBulkyItems(!!checked)}
              />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#202224]">Bulky Items (piano, safe)</p>
                <p className="text-xs text-[#A6A6A6]">(add. fee)</p>
              </div>
            </div>

            <div className="border border-[#D8D8D8] rounded-lg p-4 flex items-center gap-3">
              <Checkbox
                checked={inventoryList}
                onCheckedChange={(checked) => setInventoryList(!!checked)}
              />
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
            className="w-full h-11 border border-[#D8D8D8] rounded-lg pl-10 pr-12 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA] bg-white"
            style={{ textIndent: "8px" }}
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
              accept=".jpg,.jpeg,.png,.pdf"
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
            {fileError && <p className="w-full text-sm text-[#FF0000]">{fileError}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end pt-2">
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
              isValid
                ? "bg-[#60A5FA] hover:bg-[#5094E0]"
                : "bg-[rgba(96,165,250,0.6)] cursor-not-allowed"
            }`}
          >
            Next Step
          </button>
        </div>
      </div>

      <MoveDetailsChecklist
        step={3}
        preview={{
          additionalServices: selectedServicesValue,
          loadingAssistanceCount: loadingAssistance,
          uploadedFilesCount: uploadedFiles.length,
        }}
      />
    </div>
  );
};
