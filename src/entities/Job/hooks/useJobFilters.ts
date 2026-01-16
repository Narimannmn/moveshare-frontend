import { useState } from "react";

import type { JobType, RoomCount } from "../schemas";

interface JobFilters {
  jobType?: JobType;
  roomCount?: RoomCount;
  minPrice?: number;
  maxPrice?: number;
}

export const useJobFilters = () => {
  const [filters, setFilters] = useState<JobFilters>({
    jobType: undefined,
    roomCount: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      jobType: undefined,
      roomCount: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return { filters, updateFilter, resetFilters };
};
