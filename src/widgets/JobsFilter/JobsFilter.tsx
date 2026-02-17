import {Calendar} from "lucide-react";
import {memo, useState} from "react";

import {
  useJobFiltersStore,
  type BedroomCount,
} from "@/entities/Job";

import {cn} from "@/shared/lib/utils";

import {Button, Checkbox, Input} from "@shared/ui";

import styles from "./JobsFilter.module.scss";

export interface JobsFilterProps {
  className?: string;
}

const BEDROOM_COUNT_OPTIONS: {value: BedroomCount; label: string}[] = [
  {value: "1_bedroom", label: "1 Bedroom"},
  {value: "2_bedroom", label: "2 Bedrooms"},
  {value: "3_bedroom", label: "3 Bedrooms"},
  {value: "4_bedroom", label: "4 Bedrooms"},
  {value: "5_bedroom", label: "5 Bedrooms"},
  {value: "6_plus_bedroom", label: "6+ Bedrooms"},
];

const TRUCK_SIZE_OPTIONS = [
  {value: "small", label: "Small (≤26')"},
  {value: "medium", label: "Medium (27'-52')"},
  {value: "large", label: "Large (≥53')"},
];

export const JobsFilter = memo(({className}: JobsFilterProps) => {
  const storeBedroomCount = useJobFiltersStore((state) => state.bedroomCount);
  const setBedroomCount = useJobFiltersStore(
    (state) => state.actions.setBedroomCount
  );

  // Local state for form inputs before applying
  const [localBedroomCount, setLocalBedroomCount] = useState<BedroomCount | null>(
    storeBedroomCount
  );
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState(250);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [truckSizes, setTruckSizes] = useState<string[]>(["medium"]);
  const [truckSizeMin, setTruckSizeMin] = useState("");
  const [truckSizeMax, setTruckSizeMax] = useState("");

  const handleApplyFilters = () => {
    setBedroomCount(localBedroomCount);
    // TODO: Apply other filters when backend supports them
  };

  const handleResetBedroomCount = () => {
    setLocalBedroomCount(null);
    setOrigin("");
    setDestination("");
    setDistance(250);
    setDateStart("");
    setDateEnd("");
    setTruckSizes([]);
    setTruckSizeMin("");
    setTruckSizeMax("");
  };

  const handleTruckSizeToggle = (value: string) => {
    setTruckSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const hasActiveFilters =
    localBedroomCount !== null ||
    origin ||
    destination ||
    distance !== 250 ||
    dateStart ||
    dateEnd ||
    truckSizes.length > 0 ||
    truckSizeMin ||
    truckSizeMax;

  return (
    <div className={cn(styles.filterContainer, className)}>
      <div className={styles.filterGrid}>
        {/* Relocation Size */}
        <div className={styles.filterSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Relocation Size</h3>
            <button
              type="button"
              className={styles.resetLink}
              onClick={handleResetBedroomCount}
            >
              Reset
            </button>
          </div>
          <select
            value={localBedroomCount || ""}
            onChange={(e) =>
              setLocalBedroomCount((e.target.value as BedroomCount) || null)
            }
            className={styles.select}
          >
            <option value="">Select number of bedrooms</option>
            {BEDROOM_COUNT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Origin */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Origin</label>
          <Input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="City, State"
            className={styles.input}
          />
        </div>

        {/* Destination */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Destination</label>
          <Input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="City, State"
            className={styles.input}
          />
        </div>

        {/* Distance Slider */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Distance</h3>
          <input
            type="range"
            min="0"
            max="500"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className={styles.slider}
            style={{
              background: `linear-gradient(to right, #60a5fa 0%, #60a5fa ${(distance / 500) * 100}%, #d8d8d8 ${(distance / 500) * 100}%, #d8d8d8 100%)`,
            }}
          />
          <div className={styles.sliderLabels}>
            <span className={styles.sliderLabel}>0 mi</span>
            <span className={styles.sliderLabel}>250 mi</span>
            <span className={styles.sliderLabel}>500 mi</span>
          </div>
        </div>

        {/* Date Start */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Date Start</label>
          <Input
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
            placeholder="mm/dd/yyyy"
            postfix={<Calendar size={20} className="text-gray-400" />}
            className={styles.input}
          />
        </div>

        {/* Date End */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Date End</label>
          <Input
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
            placeholder="mm/dd/yyyy"
            postfix={<Calendar size={20} className="text-gray-400" />}
            className={styles.input}
          />
        </div>

        {/* Truck Size Checkboxes */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Truck Size</h3>
          <div className={styles.checkboxGroup}>
            {TRUCK_SIZE_OPTIONS.map((option) => (
              <label key={option.value} className={styles.checkboxLabel}>
                <Checkbox
                  checked={truckSizes.includes(option.value)}
                  onChange={() => handleTruckSizeToggle(option.value)}
                />
                <span className={styles.checkboxText}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button
        variant="primary"
        size="default"
        onClick={handleApplyFilters}
        disabled={!hasActiveFilters}
        className={cn(styles.applyButton, "w-full")}
      >
        Apply Filters
      </Button>
    </div>
  );
});

JobsFilter.displayName = "JobsFilter";
