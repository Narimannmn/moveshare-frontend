import { memo } from "react";

import { useCompanyProfile } from "@/entities/Auth/api";
import { useMyJobs } from "@/entities/Job/api";
import { cn } from "@/shared/lib/utils";

import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileHeader } from "../ProfileHeader";
import { ProfileStats } from "../ProfileStats";
import styles from "./ProfileCard.module.scss";

export interface ProfileCardProps {
  className?: string;
}

export const ProfileCard = memo(({ className }: ProfileCardProps) => {
  const { data: companyProfile } = useCompanyProfile();
  const { data: completedJobsData } = useMyJobs({
    status: "completed",
    offset: 0,
    limit: 1,
  });

  const companyName = companyProfile?.name || "Company";
  const email = companyProfile?.email || "No email";
  const isVerified = companyProfile?.is_verified ?? false;
  const jobsCompleted = companyProfile?.completed_jobs ?? completedJobsData?.total ?? 0;
  const averageRating = companyProfile?.average_rating ?? null;

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.content}>
        <ProfileAvatar name={companyName} size="xl" editable />

        <ProfileHeader companyName={companyName} email={email} isVerified={isVerified} />

        <ProfileStats jobsCompleted={jobsCompleted} averageRating={averageRating} />
      </div>
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";
