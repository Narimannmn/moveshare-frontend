import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";

import { cn } from "@/shared/lib/utils";

import { type BedroomCount, BEDROOM_LABELS, useJobFilterOptions, useJobFiltersStore } from "@/entities/Job";

import { Button, DatePicker } from "@shared/ui";

import styles from "./JobsFilter.module.scss";

export interface JobsFilterProps {
  className?: string;
}

const BEDROOM_COUNT_OPTIONS = (Object.entries(BEDROOM_LABELS) as [BedroomCount, string][]).map(
  ([value, label]) => ({ value, label })
);



interface SearchableDropdownProps {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  loading?: boolean;
}

const SearchableDropdown = ({
  value,
  onSelect,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  loading = false,
}: SearchableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;

    const normalizedQuery = searchQuery.toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
  }, [options, searchQuery]);

  return (
    <div ref={rootRef} className={styles.dropdown}>
      <button
        type="button"
        className={cn(styles.dropdownTrigger, !value && styles.dropdownPlaceholder)}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.dropdownValue}>{value || placeholder}</span>
        <span className={cn(styles.dropdownArrow, isOpen && styles.dropdownArrowOpen)}>⌄</span>
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className={styles.dropdownSearch}
          />

          <div className={styles.dropdownList}>
            {value && (
              <button
                type="button"
                className={styles.dropdownOption}
                onClick={() => {
                  onSelect("");
                  setIsOpen(false);
                }}
              >
                Clear selection
              </button>
            )}

            {loading ? (
              <div className={styles.dropdownEmpty}>Loading...</div>
            ) : filteredOptions.length === 0 ? (
              <div className={styles.dropdownEmpty}>{emptyText}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={cn(styles.dropdownOption, option === value && styles.dropdownOptionActive)}
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const JobsFilter = memo(({ className }: JobsFilterProps) => {
  const storeBedroomCount = useJobFiltersStore((state) => state.bedroomCount);
  const storeOrigin = useJobFiltersStore((state) => state.origin);
  const storeDestination = useJobFiltersStore((state) => state.destination);
  const setBedroomCount = useJobFiltersStore((state) => state.actions.setBedroomCount);
  const setOriginFilter = useJobFiltersStore((state) => state.actions.setOrigin);
  const setDestinationFilter = useJobFiltersStore((state) => state.actions.setDestination);
  const setPickupDateFrom = useJobFiltersStore((state) => state.actions.setPickupDateFrom);
  const setPickupDateTo = useJobFiltersStore((state) => state.actions.setPickupDateTo);
  const { data: filterOptions, isLoading: isFilterOptionsLoading } = useJobFilterOptions();

  const metersToMiles = useCallback((meters: number) => Math.round(meters / 1609.34), []);

  const distanceMinMi = filterOptions?.distance_min_meters != null ? metersToMiles(filterOptions.distance_min_meters) : 0;
  const distanceMaxMi = filterOptions?.distance_max_meters != null ? metersToMiles(filterOptions.distance_max_meters) : 500;

  // Local state for form inputs before applying
  const [localBedroomCount, setLocalBedroomCount] = useState<BedroomCount | null>(
    storeBedroomCount
  );
  const [origin, setOrigin] = useState(storeOrigin ?? "");
  const [destination, setDestination] = useState(storeDestination ?? "");
  const [distance, setDistance] = useState(distanceMaxMi);
  const [pickupFrom, setPickupFrom] = useState("");
  const [pickupTo, setPickupTo] = useState("");
  const [truckSizes, setTruckSizes] = useState<string[]>([]);
  const [truckSizeMin, setTruckSizeMin] = useState("");
  const [truckSizeMax, setTruckSizeMax] = useState("");

  const handleApplyFilters = () => {
    setBedroomCount(localBedroomCount);
    setOriginFilter(origin.trim() ? origin.trim() : null);
    setDestinationFilter(destination.trim() ? destination.trim() : null);
    setPickupDateFrom(pickupFrom ? new Date(pickupFrom).toISOString() : null);
    setPickupDateTo(pickupTo ? new Date(pickupTo).toISOString() : null);
  };

  const handleResetBedroomCount = () => {
    setLocalBedroomCount(null);
    setOrigin("");
    setDestination("");
    setDistance(distanceMaxMi);
    setPickupFrom("");
    setPickupTo("");
    setTruckSizes([]);
    setTruckSizeMin("");
    setTruckSizeMax("");
    setBedroomCount(null);
    setOriginFilter(null);
    setDestinationFilter(null);
    setPickupDateFrom(null);
    setPickupDateTo(null);
  };



  const hasActiveFilters =
    localBedroomCount !== null ||
    origin.trim() ||
    destination.trim() ||
    distance !== distanceMaxMi ||
    pickupFrom ||
    pickupTo ||
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
            <button type="button" className={styles.resetLink} onClick={handleResetBedroomCount}>
              Reset
            </button>
          </div>
          <select
            value={localBedroomCount || ""}
            onChange={(e) => setLocalBedroomCount((e.target.value as BedroomCount) || null)}
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
          <SearchableDropdown
            value={origin}
            onSelect={setOrigin}
            options={filterOptions?.origins ?? []}
            placeholder="City, State"
            searchPlaceholder="Search origin"
            emptyText="No origins found"
            loading={isFilterOptionsLoading}
          />
        </div>

        {/* Destination */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Destination</label>
          <SearchableDropdown
            value={destination}
            onSelect={setDestination}
            options={filterOptions?.destinations ?? []}
            placeholder="City, State"
            searchPlaceholder="Search destination"
            emptyText="No destinations found"
            loading={isFilterOptionsLoading}
          />
        </div>

        {/* Distance Slider */}
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Distance</h3>
          <input
            type="range"
            min={distanceMinMi}
            max={distanceMaxMi}
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className={styles.slider}
            style={{
              background: distanceMaxMi > distanceMinMi
                ? `linear-gradient(to right, #60a5fa 0%, #60a5fa ${((distance - distanceMinMi) / (distanceMaxMi - distanceMinMi)) * 100}%, #d8d8d8 ${((distance - distanceMinMi) / (distanceMaxMi - distanceMinMi)) * 100}%, #d8d8d8 100%)`
                : "#d8d8d8",
            }}
          />
          <div className={styles.sliderLabels}>
            <span className={styles.sliderLabel}>{distanceMinMi} mi</span>
            <span className={styles.sliderLabel}>{distanceMaxMi} mi</span>
          </div>
        </div>

        {/* Pickup From */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Pickup From</label>
          <DatePicker value={pickupFrom} onChange={setPickupFrom} placeholder="Select start date" disablePast />
        </div>

        {/* Pickup To */}
        <div className={styles.filterSection}>
          <label className={styles.label}>Pickup To</label>
          <DatePicker value={pickupTo} onChange={setPickupTo} placeholder="Select end date" />
        </div>

        {/* Truck Size Checkboxes — hidden until backend supports truck size filtering
        <div className={styles.filterSection}>
          <h3 className={styles.sectionTitle}>Truck Size</h3>
          <div className={styles.checkboxGroup}>
            {TRUCK_SIZE_OPTIONS.map((option) => (
              <label key={option.value} className={styles.checkboxLabel}>
                <Checkbox
                  checked={truckSizes.includes(option.value)}
                  onCheckedChange={() => handleTruckSizeToggle(option.value)}
                />
                <span className={styles.checkboxText}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        */}
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
