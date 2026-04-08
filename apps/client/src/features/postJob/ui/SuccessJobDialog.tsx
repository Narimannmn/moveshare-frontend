import { CheckCircle2 } from "lucide-react";

import { Dialog, DialogContent } from "@shared/ui";

interface SuccessJobDialogProps {
  open: boolean;
  onClose: () => void;
  onGoToMyJobs: () => void;
}

export const SuccessJobDialog = ({ open, onClose, onGoToMyJobs }: SuccessJobDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8" showClose={false}>
        {/* Content */}
        <div className="flex flex-col items-center space-y-6">
          {/* Success Icon */}
          <div className="relative">
            <div className="size-20 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#81C784] flex items-center justify-center">
              <CheckCircle2 className="size-10 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Message */}
          <p className="text-center text-base font-normal text-[#202224] leading-relaxed">
            Your job has been created. Waiting for a mover to accept your order.
          </p>

          {/* Actions */}
          <div className="flex gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg px-6 py-2.5 text-base font-normal text-[#202224] border border-[#D8D8D8] bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onGoToMyJobs}
              className="flex-1 h-11 rounded-lg px-6 py-2.5 text-base font-normal text-white bg-[#60A5FA] hover:bg-[#5094E0]"
            >
              Go to My Jobs
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
