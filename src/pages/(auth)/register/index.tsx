import { Link, createFileRoute } from "@tanstack/react-router";

import { Typography } from "@/shared/ui";

import { useAuthStore } from "@entities/User/model/store/authStore";

import { AppleLoginButton } from "@features/auth/loginWithApple/ui/AppleLoginButton";
import { GoogleLoginButton } from "@features/auth/loginWithGoogle/ui/GoogleLoginButton";
import { EmailRegisterForm } from "@features/auth/registerWithEmail/ui/EmailRegisterForm";

export const Route = createFileRoute("/(auth)/register/")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = Route.useNavigate();
  const authStore = useAuthStore();

  const handleEmailSuccess = (email: string) => {
    // Store email in Zustand
    authStore.actions.setRegistrationEmail(email);
    // Navigate to verify page
    navigate({ to: "/register/verify" });
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-sm">
      <div>
        <Typography variant="bold_24">Register</Typography>
      </div>
      <EmailRegisterForm onSuccess={handleEmailSuccess} />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#D8D8D8]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-[#666C72]">or</span>
        </div>
      </div>

      <div className="space-y-3">
        <GoogleLoginButton />
        <AppleLoginButton />
      </div>

      <div className="text-center text-sm">
        <span className="text-[#666C72]">Don't have an account? </span>
        <Link to="/login" className="text-[#60A5FA] hover:underline font-medium">
          Login
        </Link>
      </div>
    </div>
  );
}
