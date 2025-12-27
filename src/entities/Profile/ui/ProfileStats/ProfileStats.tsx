import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import styles from "./ProfileStats.module.scss";

export interface ProfileStatsProps {
  jobsCompleted: number;
  averageRating: number;
  className?: string;
}

export const ProfileStats = memo(
  ({ jobsCompleted, averageRating, className }: ProfileStatsProps) => {
    return (
      <div className={cn(styles.container, className)}>
        <div className={styles.statCard}>
          <div className={styles.value}>{jobsCompleted}</div>
          <div className={styles.label}>Jobs Completed</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.value}>{averageRating.toFixed(1)}</div>
          <div className={styles.label}>Average Rating</div>
        </div>
      </div>
    );
  }
);

ProfileStats.displayName = "ProfileStats";
