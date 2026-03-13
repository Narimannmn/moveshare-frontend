import { memo } from "react";

import { cn } from "@/shared/lib/utils";

import { Button } from "@shared/ui";

import styles from "./JobCard.module.scss";

export interface JobCardProps {
  id: string | number;
  title: string;
  distance: number;
  isHotDeal?: boolean;
  isNewListing?: boolean;
  origin: {
    city: string;
    state: string;
  };
  destination: {
    city: string;
    state: string;
  };
  originAddress?: string;
  destinationAddress?: string;
  dates: {
    start: string;
    end: string;
  };
  truckSize: {
    type: string;
    length: string;
  };
  weight: number;
  volume: number;
  price: number;
  onViewDetails?: (id: string | number) => void;
  onClaimJob?: (id: string | number) => void;
  className?: string;
}

export const JobCard = memo(
  ({
    id,
    title,
    distance,
    isHotDeal = false,
    isNewListing = false,
    origin,
    destination,
    originAddress,
    destinationAddress,
    dates,
    truckSize,
    weight,
    volume,
    price,
    onViewDetails,
    onClaimJob,
    className,
  }: JobCardProps) => {
    const buildDirectionsMapUrl = (
      originInput: string,
      destinationInput: string,
      jobId: string | number
    ): string => {
      const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
      const originEncoded = encodeURIComponent(originInput);
      const destinationEncoded = encodeURIComponent(destinationInput);
      const jobIdEncoded = encodeURIComponent(String(jobId));
      const endpointPath = `/api/v1/maps/embed-route?origin=${originEncoded}&destination=${destinationEncoded}&job_id=${jobIdEncoded}`;

      return apiBaseUrl ? `${apiBaseUrl}${endpointPath}` : endpointPath;
    };

    const handleViewDetails = () => {
      onViewDetails?.(id);
    };

    const handleClaimJob = () => {
      onClaimJob?.(id);
    };

    const formatLocation = (location: { city: string; state: string }) => {
      const city = location.city.trim();
      const state = location.state.trim();

      if (city && state) {
        return `${city}, ${state}`;
      }
      if (city) {
        return city;
      }
      if (state) {
        return state;
      }

      return "Unknown";
    };

    const originText = formatLocation(origin);
    const destinationText = formatLocation(destination);
    const routeOrigin = originAddress?.trim() || originText;
    const routeDestination = destinationAddress?.trim() || destinationText;
    const mapSrc = buildDirectionsMapUrl(routeOrigin, routeDestination, id);

    return (
      <div className={cn(styles.card, className)}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.metadata}>
              {isHotDeal && <span className={styles.hotDeal}>Hot deal</span>}
            </div>
          </div>
          {isNewListing && <span className={styles.newListing}>New Listing</span>}
        </div>

        {/* Route */}
        <div className={styles.route}>
          <div className={styles.location}>
            <span className={styles.locationText}>{originText}</span>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.location}>
            <span className={styles.locationText}>{destinationText}</span>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className={styles.mapContainer}>
          <div className={styles.map}>
            <iframe
              src={mapSrc}
              title={`${originText} to ${destinationText} route map`}
              className={styles.mapFrame}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Dates</span>
            <span className={styles.detailValue}>
              {dates.start}-{dates.end}
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Truck Size</span>
            <span className={styles.detailValue}>
              {truckSize.type}
              <br />({truckSize.length})
            </span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Weight</span>
            <span className={styles.detailValue}>{weight.toLocaleString()} lbs</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Volume</span>
            <span className={styles.detailValue}>{volume.toLocaleString()} cu ft</span>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.price}>${price.toLocaleString()}</div>
          <div className={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className={styles.viewDetailsButton}
            >
              View Details
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleClaimJob}
              className={styles.claimButton}
            >
              Claim Job
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

JobCard.displayName = "JobCard";
