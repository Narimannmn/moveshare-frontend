import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { Typography } from "@shared/ui";

import { PasswordRegisterForm } from "@features/auth/registerWithEmail/ui/PasswordRegisterForm";

export const Route = createFileRoute("/(auth)/register/password")({
  component: RegisterPasswordPage,
});

function RegisterPasswordPage() {
  const navigate = Route.useNavigate();
  const tempToken = useAuthStore((state) => state.tempToken);

  // Guard: redirect if no temp token
  useEffect(() => {
    if (!tempToken) {
      navigate({ to: "/register", replace: true });
    }
  }, [tempToken, navigate]);

  const handlePasswordSuccess = () => {
    // Navigate to company info step
    navigate({ to: "/register/company" });
  };

  if (!tempToken) {
    return null;
  }

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-10 rounded-2xl">
      <div className="space-y-2">
        <div>
          <Typography variant="bold_24">Create password</Typography>
        </div>{" "}
        <Typography className="opacity-80">
          Create a strong password to keep your account safe
        </Typography>
      </div>

      <PasswordRegisterForm onSuccess={handlePasswordSuccess} />
    </div>
  );
}
