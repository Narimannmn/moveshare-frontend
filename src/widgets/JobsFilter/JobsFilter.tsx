import { memo, useCallback } from "react";

import { cn } from "@/shared/lib/utils";

import { Button, Input } from "@shared/ui";

import styles from "./JobsFilter.module.scss";

export interface JobsFilterProps {
  onFilterChange?: (filters: JobsFilterState) => void;
  className?: string;
}

export interface JobsFilterState {
  relocationSize?: string;
  origin?: string;
  destination?: string;
  distance?: number;
  dateStart?: string;
  dateEnd?: string;
  truckSizeMin?: string;
  truckSizeMax?: string;
  truckSizeSelected?: string[];
}

export const JobsFilter = memo(({ onFilterChange: _onFilterChange, className }: JobsFilterProps) => {
  const handleApplyFilters = useCallback(() => {
    // TODO: Implement filter application logic
    console.log("Apply filters");
  }, []);

  const handleReset = useCallback(() => {
    // TODO: Implement reset logic
    console.log("Reset filters");
  }, []);

  return (
    <div className={cn(styles.filterContainer, className)}>
      <div className={styles.filterGrid}>
        {/* Relocation Size */}
        <div className={styles.filterItem}>
          <label className={styles.label}>
            Relocation Size
            <button className={styles.resetButton} onClick={handleReset}>
              Reset
            </button>
          </label>
          <Input placeholder="Select number of bedrooms" bg={true} className={styles.input} />
        </div>

        {/* Origin */}
        <div className={styles.filterItem}>
          <label className={styles.label}>Origin</label>
          <Input placeholder="City, State" bg={true} className={styles.input} />
        </div>

        {/* Destination */}
        <div className={styles.filterItem}>
          <label className={styles.label}>Destination</label>
          <Input placeholder="City, State" bg={true} className={styles.input} />
        </div>

        {/* Distance Slider */}
        <div className={styles.filterItem}>
          <label className={styles.label}>Distance</label>
          <div className={styles.sliderContainer}>
            <input type="range" min="0" max="500" defaultValue="0" className={styles.slider} />
            <div className={styles.sliderLabels}>
              <span className={styles.sliderLabel}>0 mi</span>
              <span className={styles.sliderLabel}>250 mi</span>
              <span className={styles.sliderLabel}>500 mi</span>
            </div>
          </div>
        </div>

        {/* Date Start */}
        <div className={styles.filterItem}>
          <label className={styles.label}>Date Start</label>
          <Input type="text" placeholder="mm/dd/yyyy" bg={true} className={styles.input} />
        </div>

        {/* Date End */}
        <div className={styles.filterItem}>
          <label className={styles.label}>Date End</label>
          <Input type="text" placeholder="mm/dd/yyyy" bg={true} className={styles.input} />
        </div>

        {/* Truck Size Checkboxes */}
        <div className={cn(styles.filterItem, styles.truckSizeSection)}>
          <label className={styles.label}>Truck Size</label>
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkboxText}>Small (≤26')</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} defaultChecked />
              <span className={styles.checkboxText}>Medium (27'-52')</span>
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" className={styles.checkbox} />
              <span className={styles.checkboxText}>Large (≥53')</span>
            </label>
          </div>
        </div>

        {/* Truck Size Min/Max */}
        <div className={styles.filterItem}>
          <label className={styles.label}>Truck Size</label>
          <div className={styles.minMaxContainer}>
            <Input placeholder="Min" bg={true} className={styles.minMaxInput} />
            <Input placeholder="Max" bg={true} className={styles.minMaxInput} />
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className={styles.applyButtonContainer}>
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
