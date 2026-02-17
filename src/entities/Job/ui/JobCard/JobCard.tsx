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
    dates,
    truckSize,
    weight,
    volume,
    price,
    onViewDetails,
    onClaimJob,
    className,
  }: JobCardProps) => {
    const handleViewDetails = () => {
      onViewDetails?.(id);
    };

    const handleClaimJob = () => {
      onClaimJob?.(id);
    };

    return (
      <div className={cn(styles.card, className)}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.metadata}>
              <span className={styles.distance}>{distance} mi from you</span>
              {isHotDeal && <span className={styles.hotDeal}>Hot deal</span>}
            </div>
          </div>
          {isNewListing && <span className={styles.newListing}>New Listing</span>}
        </div>

        {/* Route */}
        <div className={styles.route}>
          <div className={styles.location}>
            <span className={styles.locationText}>
              {origin.city}, {origin.state}
            </span>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.location}>
            <span className={styles.locationText}>
              {destination.city}, {destination.state}
            </span>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className={styles.mapContainer}>
          <div className={styles.map}>
            {/* Map visualization would go here */}
            <div className={styles.mapPin} style={{ left: "25%", top: "40%" }}>
              📍
            </div>
            <div className={styles.mapPin} style={{ left: "75%", top: "55%" }}>
              📍
            </div>
            <svg className={styles.mapRoute} viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 25 40 Q 50 20, 75 55"
                stroke="white"
                strokeWidth="1"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
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
              size="default"
              onClick={handleViewDetails}
              className={styles.viewDetailsButton}
            >
              View Details
            </Button>
            <Button
              variant="primary"
              size="default"
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
