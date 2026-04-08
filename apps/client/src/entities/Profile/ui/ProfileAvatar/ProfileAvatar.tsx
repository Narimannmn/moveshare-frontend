import { memo } from "react";

import { Camera, Trash2 } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Avatar } from "@/shared/ui";

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
    return (
      <div className={cn(styles.container, styles[size], className)}>
        <Avatar name={name} avatar={avatar} size={size} className={styles.inner} />

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
