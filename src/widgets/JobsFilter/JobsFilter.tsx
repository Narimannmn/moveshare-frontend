import {memo, useState} from "react";

import {
  useJobFiltersStore,
  type BedroomCount,
  type JobType,
} from "@/entities/Job";

import {cn} from "@/shared/lib/utils";

import {Button} from "@shared/ui";

import styles from "./JobsFilter.module.scss";

export interface JobsFilterProps {
  className?: string;
}

const JOB_TYPE_OPTIONS: {value: JobType; label: string}[] = [
  {value: "residential", label: "Residential"},
  {value: "office", label: "Office"},
  {value: "storage", label: "Storage"},
];

const BEDROOM_COUNT_OPTIONS: {value: BedroomCount; label: string}[] = [
  {value: "1_bedroom", label: "1 Bedroom"},
  {value: "2_bedroom", label: "2 Bedrooms"},
  {value: "3_bedroom", label: "3 Bedrooms"},
  {value: "4_bedroom", label: "4 Bedrooms"},
  {value: "5_bedroom", label: "5 Bedrooms"},
  {value: "6_plus_bedroom", label: "6+ Bedrooms"},
];

export const JobsFilter = memo(({className}: JobsFilterProps) => {
  const storeJobType = useJobFiltersStore((state) => state.jobType);
  const storeBedroomCount = useJobFiltersStore((state) => state.bedroomCount);
  const setJobType = useJobFiltersStore((state) => state.actions.setJobType);
  const setBedroomCount = useJobFiltersStore(
    (state) => state.actions.setBedroomCount
  );
  const resetFilters = useJobFiltersStore((state) => state.actions.resetFilters);

  // Local state for form inputs before applying
  const [localJobType, setLocalJobType] = useState<JobType | null>(storeJobType);
  const [localBedroomCount, setLocalBedroomCount] = useState<BedroomCount | null>(
    storeBedroomCount
  );

  const handleApplyFilters = () => {
    setJobType(localJobType);
    setBedroomCount(localBedroomCount);
  };

  const handleReset = () => {
    setLocalJobType(null);
    setLocalBedroomCount(null);
    resetFilters();
  };

  return (
    <div className={cn(styles.filterContainer, className)}>
      <div className={styles.filterGrid}>
        {/* Job Type */}
        <div className={styles.filterItem}>
          <label className={styles.label}>
            Job Type
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => setLocalJobType(null)}
            >
              Clear
            </button>
          </label>
          <select
            value={localJobType || ""}
            onChange={(e) =>
              setLocalJobType((e.target.value as JobType) || null)
            }
            className={styles.select}
          >
            <option value="">All Types</option>
            {JOB_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Bedroom Count */}
        <div className={styles.filterItem}>
          <label className={styles.label}>
            Relocation Size
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => setLocalBedroomCount(null)}
            >
              Clear
            </button>
          </label>
          <select
            value={localBedroomCount || ""}
            onChange={(e) =>
              setLocalBedroomCount((e.target.value as BedroomCount) || null)
            }
            className={styles.select}
          >
            <option value="">All Sizes</option>
            {BEDROOM_COUNT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.applyButtonContainer}>
        <Button
          variant="secondary"
          size="default"
          onClick={handleReset}
          className={styles.resetAllButton}
        >
          Reset All
        </Button>
        <Button
          variant="primary"
          size="default"
          onClick={handleApplyFilters}
          className={styles.applyButton}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
});

JobsFilter.displayName = "JobsFilter";
