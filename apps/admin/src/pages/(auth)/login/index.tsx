import { createFileRoute } from "@tanstack/react-router";

import { Typography } from "@shared/ui";

import { EmailLoginForm } from "@features/auth/loginWithEmail/ui/EmailLoginForm";

export const Route = createFileRoute("/(auth)/login/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = Route.useNavigate();

  const handleLoginSuccess = (requiresOtp?: boolean) => {
    if (requiresOtp) {
      navigate({ to: "/login/verify" });
    }
    // If no OTP required, the useLogin mutation will handle navigation to dashboard
  };

  return (
    <div className="w-full max-w-[480px] bg-white p-10 rounded-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col items-start w-full">
        <Typography variant="bold_24">Log In</Typography>
      </div>

      {/* Form Content */}
      <div className="flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-4 items-center w-full">
          {/* Login Form */}
          <EmailLoginForm onSuccess={handleLoginSuccess} />

        </div>
      </div>
    </div>
  );
}
