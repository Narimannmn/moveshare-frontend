import { useState } from "react";

import { usePostJobStore } from "../../model/usePostJobStore";

interface PostJobStep4Props {
  onCancel: () => void;
  onSuccess: () => void;
}

export const PostJobStep4 = ({ onCancel, onSuccess }: PostJobStep4Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const prevStep = usePostJobStore((state) => state.actions.prevStep);

  const [pickupDate, setPickupDate] = useState(formData.pickupDatetime.split("T")[0] || "");
  const [pickupTime, setPickupTime] = useState(formData.pickupDatetime.split("T")[1]?.substring(0, 5) || "");
  const [deliveryDate, setDeliveryDate] = useState(formData.deliveryDatetime.split("T")[0] || "");
  const [deliveryTime, setDeliveryTime] = useState(formData.deliveryDatetime.split("T")[1]?.substring(0, 5) || "");

  const [payoutAmount, setPayoutAmount] = useState(formData.payoutAmount || "1850");
  const [cutAmount, setCutAmount] = useState(formData.cutAmount || "300");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Combine date and time
      const pickupDatetime = `${pickupDate}T${pickupTime}:00.000Z`;
      const deliveryDatetime = `${deliveryDate}T${deliveryTime}:00.000Z`;

      updateFormData({
        pickupDatetime,
        deliveryDatetime,
        payoutAmount,
        cutAmount,
      });

      // TODO: Submit to API
      console.log("Submitting job:", {
        ...formData,
        pickupDatetime,
        deliveryDatetime,
        payoutAmount,
        cutAmount,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success dialog
      onSuccess();
    } catch (error) {
      console.error("Error submitting job:", error);
      // TODO: Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const isValid = pickupDate && pickupTime && deliveryDate && deliveryTime && payoutAmount && cutAmount && !isSubmitting;

  return (
    <div className="flex gap-6">
      {/* Left Column: Form */}
      <div className="flex-1 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <p className="text-sm font-normal text-[#202224]">Step 4/4</p>
          <div className="w-full flex">
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
            <div className="flex-1 h-1.5 bg-[#60A5FA]" />
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <p className="text-base font-bold text-[#202224]">Schedule</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-base font-normal text-[#202224]">
                Pickup Date <span className="text-red-600">*</span>
              </p>
              <div className="relative">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-base font-normal text-[#202224]">
                Pickup Time Window <span className="text-red-600">*</span>
              </p>
              <div className="relative">
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-base font-normal text-[#202224]">
                Delivery Date <span className="text-red-600">*</span>
              </p>
              <div className="relative">
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-base font-normal text-[#202224]">
                Delivery Time Window <span className="text-red-600">*</span>
              </p>
              <div className="relative">
                <input
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] focus:outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="space-y-4">
          <p className="text-base font-bold text-[#202224]">Payment Details</p>

          <div className="space-y-2">
            <p className="text-base font-normal text-[#202224]">
              Payout Amount ($) <span className="text-red-600">*</span>
            </p>
            <input
              type="number"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              placeholder="1850"
              className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] placeholder:text-[#A6A6A6] focus:outline-none focus:border-[#60A5FA]"
            />
          </div>

          <div className="space-y-2">
            <p className="text-base font-normal text-[#202224]">
              Cut <span className="text-red-600">*</span>
            </p>
            <input
              type="number"
              value={cutAmount}
              onChange={(e) => setCutAmount(e.target.value)}
              placeholder="300"
              className="w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal text-[#202224] placeholder:text-[#A6A6A6] focus:outline-none focus:border-[#60A5FA]"
            />
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
            onClick={handleSubmit}
            disabled={!isValid}
            className={`h-11 rounded-lg px-4 py-2.5 text-base font-normal text-white min-w-[120px] ${
              isValid ? "bg-[#60A5FA] hover:bg-[#5094E0]" : "bg-[rgba(96,165,250,0.6)] cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Posting..." : "Post Job"}
          </button>
        </div>
      </div>

      {/* Right Column: Move Details Checklist */}
      <MoveDetailsChecklist step={4} />
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
    { label: "Additional Services:", status: formData.additionalServices || "Select", completed: !!formData.additionalServices },
    { label: "Loading Assistance:", status: formData.loadingAssistanceCount ? `${formData.loadingAssistanceCount} helper(s)` : "Select", completed: !!formData.loadingAssistanceCount },
    { label: "Images of Items / PDF of Inventory List:", status: "5 photo", completed: step >= 3 },
    { label: "Pickup Date:", status: formData.pickupDatetime ? formData.pickupDatetime.split("T")[0] : "Select", completed: step >= 4 && !!formData.pickupDatetime },
    { label: "Pickup Time Window:", status: formData.pickupDatetime ? formData.pickupDatetime.split("T")[1]?.substring(0, 5) : "Select", completed: step >= 4 && !!formData.pickupDatetime },
    { label: "Delivery Date:", status: formData.deliveryDatetime ? formData.deliveryDatetime.split("T")[0] : "Select", completed: step >= 4 && !!formData.deliveryDatetime },
    { label: "Delivery Time Window:", status: formData.deliveryDatetime ? formData.deliveryDatetime.split("T")[1]?.substring(0, 5) : "Select", completed: step >= 4 && !!formData.deliveryDatetime },
    { label: "Payout Amount:", status: formData.payoutAmount ? `$${formData.payoutAmount}` : "Select", completed: step >= 4 && !!formData.payoutAmount },
    { label: "Payment ($):", status: formData.cutAmount ? `$${formData.cutAmount}` : "Select", completed: step >= 4 && !!formData.cutAmount },
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
