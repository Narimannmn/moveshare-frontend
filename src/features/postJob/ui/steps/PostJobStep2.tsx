import { useEffect, useState } from "react";

import { usePostJobStore } from "../../model/usePostJobStore";
import { MoveDetailsChecklist } from "../MoveDetailsChecklist";

interface PostJobStep2Props {
  onCancel: () => void;
}

interface LocationButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const LocationButton = ({ label, selected, onClick }: LocationButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 h-11 border rounded-lg px-4 text-sm font-normal ${
      selected
        ? "border-[#60A5FA] bg-[#60A5FA] text-white"
        : "border-[#D8D8D8] bg-white text-[#202224]"
    }`}
  >
    {label}
  </button>
);

export const PostJobStep2 = ({ onCancel: _onCancel }: PostJobStep2Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const nextStep = usePostJobStore((state) => state.actions.nextStep);
  const prevStep = usePostJobStore((state) => state.actions.prevStep);

  const [pickupAddress, setPickupAddress] = useState(formData.pickupAddress);
  const [pickupBuildingType, setPickupBuildingType] = useState<"house" | "stairs" | "elevator">(
    "house"
  );
  const [pickupFloor, setPickupFloor] = useState(formData.pickupFloor);
  const [pickupDistance, setPickupDistance] = useState<"<50" | "50-100" | "100-200" | ">200">();

  const [deliveryAddress, setDeliveryAddress] = useState(formData.deliveryAddress);
  const [deliveryBuildingType, setDeliveryBuildingType] = useState<"house" | "stairs" | "elevator">(
    "house"
  );
  const [deliveryFloor, setDeliveryFloor] = useState(formData.deliveryFloor);
  const [deliveryDistance, setDeliveryDistance] = useState<"<50" | "50-100" | "100-200" | ">200">();

  useEffect(() => {
    setPickupAddress(formData.pickupAddress);
    setDeliveryAddress(formData.deliveryAddress);
    setPickupFloor(formData.pickupFloor);
    setDeliveryFloor(formData.deliveryFloor);
  }, [
    formData.deliveryAddress,
    formData.deliveryFloor,
    formData.pickupAddress,
    formData.pickupFloor,
  ]);

  const handleNext = () => {
    updateFormData({
      pickupAddress,
      deliveryAddress,
      pickupFloor,
      deliveryFloor,
    });
    nextStep();
  };

  const handleBack = () => {
    updateFormData({
      pickupAddress,
      deliveryAddress,
      pickupFloor,
      deliveryFloor,
    });
    prevStep();
  };

  const isValid = pickupAddress.trim() && deliveryAddress.trim() && pickupFloor && deliveryFloor;

  return (
    <div className="flex gap-6">
      {/* Left Column: Form */}
      <div className="flex-1 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <p className="text-sm font-normal text-[#202224]">Step 2/4</p>
          <div className="w-full flex">
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA] rounded-br-[50px] rounded-tr-[50px]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
            <div className="flex-1 h-1.5 bg-[#F5F6FA]" />
          </div>
        </div>

        {/* Pickup Location */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Pickup Location <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Street address, city, state"
            className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] placeholder:text-[#A6A6A6] focus:outline-none focus:border-[#60A5FA]"
          />

          <div className="flex gap-4">
            <LocationButton
              label="House"
              selected={pickupBuildingType === "house"}
              onClick={() => setPickupBuildingType("house")}
            />
            <LocationButton
              label="Stairs"
              selected={pickupBuildingType === "stairs"}
              onClick={() => setPickupBuildingType("stairs")}
            />
            <LocationButton
              label="Elevator"
              selected={pickupBuildingType === "elevator"}
              onClick={() => setPickupBuildingType("elevator")}
            />
          </div>
        </div>

        {/* Pickup Floor */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Floor <span className="text-red-600">*</span>
          </p>
          <select
            value={pickupFloor}
            onChange={(e) => setPickupFloor(e.target.value)}
            className="w-full h-11 border border-[#D8D8D8] rounded-lg pl-10 pr-12 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA] bg-white"
            style={{ textIndent: "8px" }}
          >
            <option value="">Select floor</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Floor {i + 1}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <LocationButton
              label="< 50 ft"
              selected={pickupDistance === "<50"}
              onClick={() => setPickupDistance("<50")}
            />
            <LocationButton
              label="50-100 ft"
              selected={pickupDistance === "50-100"}
              onClick={() => setPickupDistance("50-100")}
            />
            <LocationButton
              label="100-200 ft"
              selected={pickupDistance === "100-200"}
              onClick={() => setPickupDistance("100-200")}
            />
            <LocationButton
              label="> 200 ft"
              selected={pickupDistance === ">200"}
              onClick={() => setPickupDistance(">200")}
            />
          </div>
        </div>

        {/* Delivery Location */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Delivery Location <span className="text-red-600">*</span>
          </p>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Street address, city, state"
            className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] placeholder:text-[#A6A6A6] focus:outline-none focus:border-[#60A5FA]"
          />

          <div className="flex gap-4">
            <LocationButton
              label="House"
              selected={deliveryBuildingType === "house"}
              onClick={() => setDeliveryBuildingType("house")}
            />
            <LocationButton
              label="Stairs"
              selected={deliveryBuildingType === "stairs"}
              onClick={() => setDeliveryBuildingType("stairs")}
            />
            <LocationButton
              label="Elevator"
              selected={deliveryBuildingType === "elevator"}
              onClick={() => setDeliveryBuildingType("elevator")}
            />
          </div>
        </div>

        {/* Delivery Floor */}
        <div className="space-y-2">
          <p className="text-base font-normal text-[#202224]">
            Floor <span className="text-red-600">*</span>
          </p>
          <select
            value={deliveryFloor}
            onChange={(e) => setDeliveryFloor(e.target.value)}
            className="w-full h-11 border border-[#D8D8D8] rounded-lg pl-10 pr-12 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA] bg-white"
            style={{ textIndent: "8px" }}
          >
            <option value="">Select floor</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Floor {i + 1}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <LocationButton
              label="< 50 ft"
              selected={deliveryDistance === "<50"}
              onClick={() => setDeliveryDistance("<50")}
            />
            <LocationButton
              label="50-100 ft"
              selected={deliveryDistance === "50-100"}
              onClick={() => setDeliveryDistance("50-100")}
            />
            <LocationButton
              label="100-200 ft"
              selected={deliveryDistance === "100-200"}
              onClick={() => setDeliveryDistance("100-200")}
            />
            <LocationButton
              label="> 200 ft"
              selected={deliveryDistance === ">200"}
              onClick={() => setDeliveryDistance(">200")}
            />
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
        step={2}
        preview={{
          pickupAddress,
          deliveryAddress,
        }}
      />
    </div>
  );
};
