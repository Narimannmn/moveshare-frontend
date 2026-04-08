import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui";

interface CancelJobDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelJobDialog = ({ open, onClose, onConfirm }: CancelJobDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0" showClose={true} onClose={onClose}>
        {/* Header */}
        <DialogHeader className="bg-[#60A5FA] px-6 py-4">
          <DialogTitle className="text-white text-xl font-bold">
            Job creation cancellation
          </DialogTitle>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-base font-normal text-[#202224]">
            Are you sure you want to cancel job creation?
          </p>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-lg px-6 py-2.5 text-base font-normal text-[#202224] border border-[#D8D8D8] bg-white hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="h-11 rounded-lg px-6 py-2.5 text-base font-normal text-white bg-[#60A5FA] hover:bg-[#5094E0]"
            >
              Cancel Job
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
