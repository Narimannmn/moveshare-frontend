import { CheckCircle2 } from "lucide-react";

import { Button, Typography } from "@shared/ui";

export const ReviewStatus = ({ onNext }: { onNext?: () => void }) => {
  return (
    <div className="w-full max-w-md space-y-6 bg-white p-10 rounded-2xl">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center w-[70px] h-[70px] rounded-full bg-gradient-to-br from-[#00B09B] to-[#96C93D]">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-3 text-center">
          <Typography variant="bold_24">Under review</Typography>
          <Typography className="max-w-[340px] mx-auto leading-relaxed opacity-80">
            Verification may take up to 3 days. We'll notify you once it's completed. If there are
            any issues with your documents, we'll contact you by email.
          </Typography>
        </div>

        <Button
          onClick={onNext}
          className="w-full h-[44px] bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-medium text-base rounded-md mt-2"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
