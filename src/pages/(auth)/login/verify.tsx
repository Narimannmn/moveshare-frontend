import { useEffect } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";

import { Typography } from "@shared/ui";

import { useAuthStore } from "@entities/User/model/store/authStore";

import { VerificationForm } from "@features/auth/verifyEmail/ui/VerificationForm";

export const Route = createFileRoute("/(auth)/login/verify")({
  component: LoginVerifyPage,
});

function LoginVerifyPage() {
  const navigate = Route.useNavigate();
  const tempToken = useAuthStore((state) => state.tempToken);

  // Guard: redirect if no temp token
  useEffect(() => {
    if (!tempToken) {
      navigate({ to: "/login", replace: true });
    }
  }, [tempToken, navigate]);

  if (!tempToken) {
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

      <VerificationForm />

      <Link
        to="/login"
        className="block w-full text-base text-[#60A5FA] hover:underline font-medium text-center"
      >
        Back to login
      </Link>
    </div>
  );
}
