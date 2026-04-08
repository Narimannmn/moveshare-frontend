import {useState} from "react";

import type {BedroomCount, JobType} from "../schemas";

interface JobFilters {
  jobType?: JobType;
  bedroomCount?: BedroomCount;
  minPrice?: number;
  maxPrice?: number;
}

export const useJobFilters = () => {
  const [filters, setFilters] = useState<JobFilters>({
    jobType: undefined,
    bedroomCount: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    setFilters((prev) => ({...prev, [key]: value}));
  };

  const resetFilters = () => {
    setFilters({
      jobType: undefined,
      bedroomCount: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return {filters, updateFilter, resetFilters};
};
