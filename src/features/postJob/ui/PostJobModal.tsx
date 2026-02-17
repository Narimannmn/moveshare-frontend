import { useState } from "react";

import { FileText } from "lucide-react";
import { X } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui";

import { usePostJobStore } from "../model/usePostJobStore";
import { CancelJobDialog } from "./CancelJobDialog";
import { SuccessJobDialog } from "./SuccessJobDialog";
import { PostJobStep1 } from "./steps/PostJobStep1";
import { PostJobStep2 } from "./steps/PostJobStep2";
import { PostJobStep3 } from "./steps/PostJobStep3";
import { PostJobStep4 } from "./steps/PostJobStep4";

interface PostJobModalProps {
  open: boolean;
  onClose: () => void;
}

export const PostJobModal = ({ open, onClose }: PostJobModalProps) => {
  const currentStep = usePostJobStore((state) => state.currentStep);
  const resetForm = usePostJobStore((state) => state.actions.resetForm);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleCloseClick = () => {
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    resetForm();
    onClose();
  };

  const handleCancelClose = () => {
    setShowCancelDialog(false);
  };

  const handleSuccess = () => {
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    resetForm();
    onClose();
  };

  const handleGoToMyJobs = () => {
    setShowSuccessDialog(false);
    resetForm();
    onClose();
    window.location.href = "/my";
  };

  return (
    <>
      <Dialog
        open={open && !showCancelDialog && !showSuccessDialog}
        onOpenChange={handleCloseClick}
      >
        <DialogContent className="max-w-5xl p-0" showClose={false} onClose={handleCloseClick}>
          {/* Header */}
          <DialogHeader className="bg-[#60A5FA] px-6 py-4 relative">
            <DialogTitle className="flex items-center gap-3 text-white text-xl font-bold">
              <FileText className="size-6" />
              Job Information
            </DialogTitle>
            <button
              type="button"
              onClick={handleCloseClick}
              className="inline-flex items-center justify-center size-8 rounded-sm opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 absolute right-6 top-1/2 -translate-y-1/2"
              aria-label="Close"
            >
              <X className="size-6 text-white" />
            </button>
          </DialogHeader>

          {/* Form Content */}
          <div className="p-6">
            {currentStep === 1 && <PostJobStep1 onCancel={handleCloseClick} />}
            {currentStep === 2 && <PostJobStep2 onCancel={handleCloseClick} />}
            {currentStep === 3 && <PostJobStep3 onCancel={handleCloseClick} />}
            {currentStep === 4 && (
              <PostJobStep4 onCancel={handleCloseClick} onSuccess={handleSuccess} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CancelJobDialog
        open={showCancelDialog}
        onClose={handleCancelClose}
        onConfirm={handleCancelConfirm}
      />

      <SuccessJobDialog
        open={showSuccessDialog}
        onClose={handleSuccessClose}
        onGoToMyJobs={handleGoToMyJobs}
      />
    </>
  );
};
