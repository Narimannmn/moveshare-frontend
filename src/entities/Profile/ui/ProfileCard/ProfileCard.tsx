import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileHeader } from "../ProfileHeader";
import { ProfileStats } from "../ProfileStats";
import styles from "./ProfileCard.module.scss";

export interface ProfileCardProps {
  className?: string;
}

const mockData = {
  name: "TransAtlantic Logistics",
  email: "contact@transatlantic.com",
  isVerified: true,
  jobsCompleted: 42,
  averageRating: 4.8,
};

export const ProfileCard = memo(({ className }: ProfileCardProps) => {
  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.content}>
        <ProfileAvatar name={mockData.name} size="xl" editable />

        <ProfileHeader
          companyName={mockData.name}
          email={mockData.email}
          isVerified={mockData.isVerified}
        />

        <ProfileStats
          jobsCompleted={mockData.jobsCompleted}
          averageRating={mockData.averageRating}
        />
      </div>
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";
