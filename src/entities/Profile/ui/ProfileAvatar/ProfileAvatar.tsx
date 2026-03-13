import { memo } from "react";

import { Camera, Trash2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import styles from "./ProfileAvatar.module.scss";

export interface ProfileAvatarProps {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  isUploading?: boolean;
  isDeleting?: boolean;
  onChangeClick?: () => void;
  onDeleteClick?: () => void;
  className?: string;
}

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

export const ProfileAvatar = memo(
  ({
    name,
    avatar,
    size = "md",
    editable = false,
    isUploading = false,
    isDeleting = false,
    onChangeClick,
    onDeleteClick,
    className,
  }: ProfileAvatarProps) => {
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
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.changeButton}
              aria-label="Change avatar"
              onClick={onChangeClick}
              disabled={isUploading || isDeleting}
            >
              <Camera size={16} />
              <span>{isUploading ? "Uploading..." : "Change"}</span>
            </button>
            {avatar && onDeleteClick && (
              <button
                type="button"
                className={styles.deleteButton}
                aria-label="Delete avatar"
                onClick={onDeleteClick}
                disabled={isUploading || isDeleting}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

ProfileAvatar.displayName = "ProfileAvatar";
