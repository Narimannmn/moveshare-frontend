import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import { type CreateJobRequest, useCreateJob } from "@/entities/Job";

import { DatePicker } from "@shared/ui";

import { usePostJobStore } from "../../model/usePostJobStore";
import { MoveDetailsChecklist } from "../MoveDetailsChecklist";

interface PostJobStep4Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const parseDatetime = (value: string) => {
  if (!value) return { date: "", time: "" };
  const [datePart, timePart = ""] = value.split("T");
  const time = timePart.substring(0, 5);
  return { date: datePart || "", time: time || "" };
};

const formatCreateJobError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as { detail?: unknown } | undefined;
    const detail = responseData?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      const validationMessages = detail
        .map((item) => {
          if (typeof item === "object" && item !== null && "msg" in item) {
            const msg = (item as { msg?: unknown }).msg;
            return typeof msg === "string" ? msg : null;
          }
          return null;
        })
        .filter((msg): msg is string => Boolean(msg));

      if (validationMessages.length > 0) {
        return validationMessages.join(", ");
      }
    }

    return error.message || "Failed to create job";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Failed to create job";
};

export const PostJobStep4 = ({ onCancel: _onCancel, onSuccess }: PostJobStep4Props) => {
  const formData = usePostJobStore((state) => state.formData);
  const updateFormData = usePostJobStore((state) => state.actions.updateFormData);
  const prevStep = usePostJobStore((state) => state.actions.prevStep);

  const pickupInitial = parseDatetime(formData.pickupDatetime);
  const deliveryInitial = parseDatetime(formData.deliveryDatetime);

  const [pickupDate, setPickupDate] = useState(pickupInitial.date);
  const [pickupTime, setPickupTime] = useState(pickupInitial.time);
  const [deliveryDate, setDeliveryDate] = useState(deliveryInitial.date);
  const [deliveryTime, setDeliveryTime] = useState(deliveryInitial.time);

  const [payoutAmount, setPayoutAmount] = useState(formData.payoutAmount || "");
  const [cutAmount, setCutAmount] = useState(formData.cutAmount || "");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createJobMutation = useCreateJob({
    navigateOnSuccess: false,
    onSuccess,
    onError: (error) => {
      setSubmitError(formatCreateJobError(error));
    },
  });
  const timeOptions = useMemo(
    () =>
      Array.from({ length: 48 }, (_, index) => {
        const hour = Math.floor(index / 2);
        const minute = index % 2 === 0 ? "00" : "30";
        return `${String(hour).padStart(2, "0")}:${minute}`;
      }),
    []
  );

  useEffect(() => {
    const pickup = parseDatetime(formData.pickupDatetime);
    const delivery = parseDatetime(formData.deliveryDatetime);
    setPickupDate(pickup.date);
    setPickupTime(pickup.time);
    setDeliveryDate(delivery.date);
    setDeliveryTime(delivery.time);
  }, [formData.pickupDatetime, formData.deliveryDatetime]);

  useEffect(() => {
    setPayoutAmount(formData.payoutAmount || "");
    setCutAmount(formData.cutAmount || "");
  }, [formData.payoutAmount, formData.cutAmount]);

  const previewPickupDatetime =
    pickupDate && pickupTime ? `${pickupDate}T${pickupTime}:00.000Z` : "";
  const previewDeliveryDatetime =
    deliveryDate && deliveryTime ? `${deliveryDate}T${deliveryTime}:00.000Z` : "";

  const handleSubmit = async () => {
    setSubmitError(null);

    try {
      if (!formData.jobType) {
        setSubmitError("Job type is required.");
        return;
      }

      const payoutNumber = Number(payoutAmount);
      const cutNumber = Number(cutAmount);

      if (!Number.isFinite(payoutNumber) || payoutNumber <= 0) {
        setSubmitError("Payout amount must be greater than 0.");
        return;
      }

      if (!Number.isFinite(cutNumber) || cutNumber < 0) {
        setSubmitError("Cut amount cannot be negative.");
        return;
      }

      if (cutNumber > payoutNumber) {
        setSubmitError("Cut amount cannot exceed payout amount.");
        return;
      }

      const pickupDatetime = previewPickupDatetime;
      const deliveryDatetime = previewDeliveryDatetime;
      if (new Date(pickupDatetime) >= new Date(deliveryDatetime)) {
        setSubmitError("Delivery datetime must be after pickup datetime.");
        return;
      }

      const uploadedFiles = formData.uploadedFiles ?? [];
      const allowedImageTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);
      const itemImages = uploadedFiles.filter((file) => allowedImageTypes.has(file.type));
      const inventoryPdf = uploadedFiles.find(
        (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
      );

      if (itemImages.length === 0 && !inventoryPdf) {
        setSubmitError("Upload at least one image or PDF file.");
        return;
      }

      updateFormData({
        pickupDatetime,
        deliveryDatetime,
        payoutAmount,
        cutAmount,
      });

      const payload: CreateJobRequest = {
        job_type: formData.jobType,
        bedroom_count: formData.bedroomCount ?? null,
        description: formData.description.trim(),
        pickup_address: formData.pickupAddress.trim(),
        delivery_address: formData.deliveryAddress.trim(),
        pickup_datetime: pickupDatetime,
        delivery_datetime: deliveryDatetime,
        payout_amount: payoutAmount.trim(),
        cut_amount: cutAmount.trim(),
        additional_services: formData.additionalServices,
        loading_assistance_count: formData.loadingAssistanceCount,
      };

      await createJobMutation.mutateAsync({
        data: payload,
        itemImages: itemImages.length > 0 ? itemImages : undefined,
        inventoryPdf,
      });
    } catch (error) {
      console.error("Error submitting job:", error);
      if (!axios.isAxiosError(error)) {
        setSubmitError(formatCreateJobError(error));
      }
    }
  };

  const handleBack = () => {
    updateFormData({
      pickupDatetime: previewPickupDatetime,
      deliveryDatetime: previewDeliveryDatetime,
      payoutAmount,
      cutAmount,
    });
    prevStep();
  };

  const isValid = useMemo(
    () =>
      Boolean(
        pickupDate &&
        pickupTime &&
        deliveryDate &&
        deliveryTime &&
        payoutAmount.trim() &&
        cutAmount.trim() &&
        !createJobMutation.isPending
      ),
    [
      pickupDate,
      pickupTime,
      deliveryDate,
      deliveryTime,
      payoutAmount,
      cutAmount,
      createJobMutation.isPending,
    ]
  );

  return (
    <div className="flex gap-6 items-stretch">
      {/* Left Column: Form */}
      <div className="flex-1 self-stretch flex flex-col">
        <div className="space-y-6">
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
                <DatePicker
                  value={pickupDate}
                  onChange={setPickupDate}
                  placeholder="Select pickup date"
                />
              </div>

              <div className="space-y-2">
                <p className="text-base font-normal text-[#202224]">
                  Pickup Time Window <span className="text-red-600">*</span>
                </p>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className={`w-full h-11 border border-[#D8D8D8] rounded-lg pl-10 pr-12 text-base font-normal focus:outline-none focus:border-[#60A5FA] bg-white ${
                    pickupTime ? "text-[#202224]" : "text-[#A6A6A6]"
                  }`}
                  style={{ textIndent: "8px" }}
                >
                  <option value="" disabled>
                    Select pickup time
                  </option>
                  {timeOptions.map((time) => (
                    <option key={`pickup-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-base font-normal text-[#202224]">
                  Delivery Date <span className="text-red-600">*</span>
                </p>
                <DatePicker
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  placeholder="Select delivery date"
                />
              </div>

              <div className="space-y-2">
                <p className="text-base font-normal text-[#202224]">
                  Delivery Time Window <span className="text-red-600">*</span>
                </p>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className={`w-full h-11 border border-[#D8D8D8] rounded-lg pl-10 pr-12 text-base font-normal focus:outline-none focus:border-[#60A5FA] bg-white ${
                    deliveryTime ? "text-[#202224]" : "text-[#A6A6A6]"
                  }`}
                  style={{ textIndent: "8px" }}
                >
                  <option value="" disabled>
                    Select delivery time
                  </option>
                  {timeOptions.map((time) => (
                    <option key={`delivery-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
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
        </div>

        {/* Actions */}
        <div className="space-y-2 mt-auto pt-6">
          {submitError && <p className="text-sm text-[#FF0000]">{submitError}</p>}
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
                isValid
                  ? "bg-[#60A5FA] hover:bg-[#5094E0]"
                  : "bg-[rgba(96,165,250,0.6)] cursor-not-allowed"
              }`}
            >
              {createJobMutation.isPending ? "Posting..." : "Post Job"}
            </button>
          </div>
        </div>
      </div>

      <MoveDetailsChecklist
        step={4}
        preview={{
          pickupDatetime: previewPickupDatetime,
          deliveryDatetime: previewDeliveryDatetime,
          payoutAmount,
          cutAmount,
        }}
      />
    </div>
  );
};
