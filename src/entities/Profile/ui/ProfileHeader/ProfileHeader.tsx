import { memo } from "react";
import { CheckCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import styles from "./ProfileHeader.module.scss";

export interface ProfileHeaderProps {
  companyName: string;
  email: string;
  isVerified: boolean;
  className?: string;
}

export const ProfileHeader = memo(
  ({ companyName, email, isVerified, className }: ProfileHeaderProps) => {
    return (
      <div className={cn(styles.container, className)}>
        <h1 className={styles.companyName}>{companyName}</h1>
        <p className={styles.email}>{email}</p>
        {isVerified && (
          <div className={styles.verifiedBadge}>
            <CheckCircle size={16} />
            <span>Verified Account</span>
          </div>
        )}
      </div>
    );
  }
);

ProfileHeader.displayName = "ProfileHeader";
