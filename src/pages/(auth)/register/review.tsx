import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { Button, Typography } from "@shared/ui";

import { useAuthStore } from "@entities/User/model/store/authStore";

export const Route = createFileRoute("/(auth)/register/review")({
  component: RegisterReviewPage,
});

function RegisterReviewPage() {
  const navigate = Route.useNavigate();

  const handleNext = () => {
    // Clear temp token and registration email when user completes registration
    useAuthStore.getState().actions.clearTempToken();
    useAuthStore.getState().actions.clearRegistrationEmail();
    // Navigate to login
    navigate({ to: "/login" });
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-2xl flex flex-col gap-6">
      {/* Content Section */}
      <div className="flex flex-col gap-6 items-center justify-center py-4">
        {/* Success Icon */}
        <div
          className="relative rounded-full w-[70px] h-[70px] flex items-center justify-center"
          style={{ backgroundImage: "linear-gradient(135deg, rgb(0, 176, 155) 0%, rgb(150, 201, 61) 100%)" }}
        >
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-center w-full">
            <Typography variant="bold_24" className="text-center text-[#202224]">
              Under review
            </Typography>
          </div>
          <div className="flex items-center justify-center w-full">
            <Typography variant="regular_16" className="text-center text-[#202224]">
              Verification may take up to 3 days. We'll notify you once it's completed. If there are any issues with your documents, we'll contact you by email.
            </Typography>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex items-center w-full">
        <Button
          onClick={handleNext}
          className="w-full h-[44px] bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-normal text-base rounded-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
