import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Typography } from "@/shared/ui";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { VerificationRegisterForm } from "@features/auth/registerWithEmail/ui/VerificationRegisterForm";

export const Route = createFileRoute("/(auth)/register/verify")({
  component: RegisterVerifyPage,
});

function RegisterVerifyPage() {
  const navigate = Route.useNavigate();
  const registrationEmail = useAuthStore((state) => state.registrationEmail);

  // Guard: redirect if no registration email
  useEffect(() => {
    if (!registrationEmail) {
      navigate({ to: "/register", replace: true });
    }
  }, [registrationEmail, navigate]);

  const handleVerifySuccess = () => {
    // Navigate to password step
    navigate({ to: "/register/password" });
  };

  if (!registrationEmail) {
    return null;
  }

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-sm">
      <div>
        <div>
          <Typography variant="bold_24">Enter the verification code</Typography>
        </div>
        <div className="mt-2">
          <Typography>
            We've sent a 6-digit code to your email. Please enter it below to verify your account.
          </Typography>
        </div>
      </div>

      <VerificationRegisterForm email={registrationEmail} onSuccess={handleVerifySuccess} />
    </div>
  );
}
