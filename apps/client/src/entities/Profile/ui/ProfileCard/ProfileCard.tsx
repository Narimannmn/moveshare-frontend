import { memo, useCallback, useRef, useState, type ChangeEvent } from "react";

import { useCompanyProfile, useDeleteCompanyProfileImage, useUploadCompanyProfileImage } from "@/entities/Auth/api";
import { useMyJobs } from "@/entities/Job/api";
import { cn } from "@/shared/lib/utils";
import { ImageCropModal } from "@/shared/ui";

import { ProfileAvatar } from "../ProfileAvatar";
import { ProfileHeader } from "../ProfileHeader";
import { ProfileStats } from "../ProfileStats";
import styles from "./ProfileCard.module.scss";

export interface ProfileCardProps {
  className?: string;
}

export const ProfileCard = memo(({ className }: ProfileCardProps) => {
  const { data: companyProfile } = useCompanyProfile();
  const uploadProfileImageMutation = useUploadCompanyProfileImage();
  const deleteProfileImageMutation = useDeleteCompanyProfileImage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: completedJobsData } = useMyJobs({
    status: "completed",
    offset: 0,
    limit: 1,
  });

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const companyName = companyProfile?.name || "Company";
  const email = companyProfile?.email ?? null;
  const isVerified = companyProfile?.is_verified ?? false;
  const jobsCompleted = companyProfile?.completed_jobs ?? completedJobsData?.total ?? 0;
  const averageRating = companyProfile?.average_rating ?? null;
  const avatarUrl = companyProfile?.profile_image_url ?? null;

  const handleAvatarChangeClick = () => {
    if (uploadProfileImageMutation.isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleCropConfirm = useCallback(
    async (croppedFile: File) => {
      setCropImageSrc(null);
      try {
        await uploadProfileImageMutation.mutateAsync(croppedFile);
      } catch (error) {
        console.error("Failed to upload profile image:", error);
      }
    },
    [uploadProfileImageMutation]
  );

  const handleCropClose = useCallback(() => {
    setCropImageSrc(null);
  }, []);

  const handleDeleteAvatar = useCallback(async () => {
    try {
      await deleteProfileImageMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to delete profile image:", error);
    }
  }, [deleteProfileImageMutation]);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.content}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <ProfileAvatar
          name={companyName}
          avatar={avatarUrl}
          size="xl"
          editable
          isUploading={uploadProfileImageMutation.isPending}
          isDeleting={deleteProfileImageMutation.isPending}
          onChangeClick={handleAvatarChangeClick}
          onDeleteClick={handleDeleteAvatar}
        />

        <ProfileHeader companyName={companyName} email={email} isVerified={isVerified} />

        <ProfileStats jobsCompleted={jobsCompleted} averageRating={averageRating} />
      </div>

      {cropImageSrc && (
        <ImageCropModal
          open
          imageSrc={cropImageSrc}
          onClose={handleCropClose}
          onConfirm={handleCropConfirm}
          cropShape="round"
          title="Crop Profile Photo"
        />
      )}
    </div>
  );
});

ProfileCard.displayName = "ProfileCard";
