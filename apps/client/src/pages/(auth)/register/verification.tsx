import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Typography } from "@/shared/ui";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { CompanyVerificationForm } from "@features/auth/registerWithEmail/ui/CompanyVerificationForm";

export const Route = createFileRoute("/(auth)/register/verification")({
  component: RegisterVerificationPage,
});

function RegisterVerificationPage() {
  const navigate = Route.useNavigate();
  const tempToken = useAuthStore((state) => state.tempToken);

  // Guard: redirect if no temp token
  useEffect(() => {
    if (!tempToken) {
      navigate({ to: "/register", replace: true });
    }
  }, [tempToken, navigate]);

  const handleVerificationSuccess = () => {
    // Navigate to review page
    // tempToken will persist until user completes the flow
    navigate({ to: "/register/review" });
  };

  if (!tempToken) {
    return null;
  }

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-sm">
      <Typography variant="bold_24">Company Verification</Typography>

      <CompanyVerificationForm onSuccess={handleVerificationSuccess} />
    </div>
  );
}
