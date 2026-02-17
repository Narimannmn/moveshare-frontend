import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { BedroomCount, JobType } from "@/entities/Job/schemas";

interface JobFiltersState {
  jobType: JobType | null;
  bedroomCount: BedroomCount | null;
  offset: number;
  limit: number;
}

interface JobFiltersActions {
  setJobType: (jobType: JobType | null) => void;
  setBedroomCount: (bedroomCount: BedroomCount | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
}

type JobFiltersStore = JobFiltersState & { actions: JobFiltersActions };

const initialState: JobFiltersState = {
  jobType: null,
  bedroomCount: null,
  offset: 0,
  limit: 20,
};

export const useJobFiltersStore = create<JobFiltersStore>()(
  devtools(
    (set) => ({
      ...initialState,

      actions: {
        setJobType: (jobType) => set({ jobType, offset: 0 }, false, "setJobType"),

        setBedroomCount: (bedroomCount) =>
          set({ bedroomCount, offset: 0 }, false, "setBedroomCount"),

        setPage: (page) => set((state) => ({ offset: page * state.limit }), false, "setPage"),

        setLimit: (limit) => set({ limit, offset: 0 }, false, "setLimit"),

        resetFilters: () => set(initialState, false, "resetFilters"),
      },
    }),
    { name: "JobFiltersStore" }
  )
);
