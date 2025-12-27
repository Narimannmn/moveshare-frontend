import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import styles from "./UserAvatar.module.scss";

export interface UserAvatarProps {
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar = memo(
  ({ name, avatar, isOnline = false, size = "md", className }: UserAvatarProps) => {
    const getInitials = (fullName: string) => {
      const names = fullName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return fullName.substring(0, 2).toUpperCase();
    };

    return (
      <div
        className={cn(
          styles.avatar,
          styles[size],
          className
        )}
      >
        {avatar ? (
          <img src={avatar} alt={name} className={styles.image} />
        ) : (
          <div className={styles.initials}>{getInitials(name)}</div>
        )}
        {isOnline && <div className={styles.onlineDot} />}
      </div>
    );
  }
);

UserAvatar.displayName = "UserAvatar";
