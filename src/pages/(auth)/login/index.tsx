import { createFileRoute, Link } from "@tanstack/react-router";

import { Typography } from "@shared/ui";

import { AppleLoginButton } from "@features/auth/loginWithApple/ui/AppleLoginButton";
import { EmailLoginForm } from "@features/auth/loginWithEmail/ui/EmailLoginForm";
import { GoogleLoginButton } from "@features/auth/loginWithGoogle/ui/GoogleLoginButton";

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

          {/* Divider */}
          <div className="flex gap-4 items-center w-full">
            <div className="flex-1 h-px bg-[#E2E2E2]" />
            <Typography variant="regular_16" className="text-[#0C2340]">
              or
            </Typography>
            <div className="flex-1 h-px bg-[#E2E2E2]" />
          </div>

          {/* OAuth Buttons */}
          <GoogleLoginButton />
          <AppleLoginButton />
        </div>

        {/* Register Link */}
        <div className="flex gap-2 items-center text-base">
          <span className="text-[#202224] opacity-65">Don't have an account?</span>
          <Link to="/register" className="text-[#60A5FA] font-bold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
