import { memo } from "react";

import { cn } from "@moveshare/shared";

import styles from "./Avatar.module.scss";

export interface AvatarProps {
  name: string;
  avatar?: string | null;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const getInitials = (fullName: string): string => {
  const names = fullName.split(" ").filter(Boolean);
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
};

export const Avatar = memo(
  ({ name, avatar, isOnline = false, size = "md", className }: AvatarProps) => {
    return (
      <div className={cn(styles.avatar, styles[size], className)}>
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

Avatar.displayName = "Avatar";
