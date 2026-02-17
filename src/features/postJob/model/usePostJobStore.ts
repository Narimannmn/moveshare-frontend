import { create } from "zustand";

import type { JobType, BedroomCount } from "@/entities/Job";

export interface PostJobFormData {
  // Step 1: Job Information
  jobType: JobType | null;
  bedroomCount: BedroomCount | null;
  description: string;

  // Step 2: Addresses
  pickupAddress: string;
  deliveryAddress: string;

  // Step 3: Schedule
  pickupDatetime: string;
  deliveryDatetime: string;

  // Step 4: Pricing
  payoutAmount: string;
  cutAmount: string;

  // Optional fields
  additionalServices: string;
  loadingAssistanceCount: number;
}

interface PostJobStore {
  currentStep: number;
  formData: PostJobFormData;
  actions: {
    setCurrentStep: (step: number) => void;
    updateFormData: (data: Partial<PostJobFormData>) => void;
    resetForm: () => void;
    nextStep: () => void;
    prevStep: () => void;
  };
}

const initialFormData: PostJobFormData = {
  jobType: null,
  bedroomCount: null,
  description: "",
  pickupAddress: "",
  deliveryAddress: "",
  pickupDatetime: "",
  deliveryDatetime: "",
  payoutAmount: "",
  cutAmount: "",
  additionalServices: "",
  loadingAssistanceCount: 0,
};

export const usePostJobStore = create<PostJobStore>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  actions: {
    setCurrentStep: (step) => set({ currentStep: step }),
    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),
    resetForm: () =>
      set({
        currentStep: 1,
        formData: initialFormData,
      }),
    nextStep: () =>
      set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 4),
      })),
    prevStep: () =>
      set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1),
      })),
  },
}));
