import { memo } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import styles from "./ProfileAvatar.module.scss";

export interface ProfileAvatarProps {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  className?: string;
}

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

export const ProfileAvatar = memo(
  ({ name, avatar, size = "md", editable = false, className }: ProfileAvatarProps) => {
    const initials = getInitials(name);

    return (
      <div className={cn(styles.container, styles[size], className)}>
        {avatar ? (
          <img src={avatar} alt={name} className={styles.image} />
        ) : (
          <div className={styles.gradient}>
            <span className={styles.initials}>{initials}</span>
          </div>
        )}

        {editable && (
          <button className={styles.changeButton} aria-label="Change avatar">
            <Camera size={16} />
            <span>Change</span>
          </button>
        )}
      </div>
    );
  }
);

ProfileAvatar.displayName = "ProfileAvatar";
