import { useEffect, useRef } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

export const Route = createFileRoute("/(auth)/google/callback")({
  component: GoogleCallbackPage,
});

function GoogleCallbackPage() {
  const navigate = Route.useNavigate();
  const actions = useAuthStore((state) => state.actions);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);

    const oauthError = hashParams.get("error");
    if (oauthError) {
      navigate({ to: "/login", replace: true });
      return;
    }

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const registrationStep = hashParams.get("registration_step");
    const hasUploadedDocuments = hashParams.get("has_uploaded_documents") === "true";
    const accountStatus = hashParams.get("status")?.toLowerCase();

    if (!accessToken || !refreshToken || !registrationStep) {
      navigate({ to: "/login", replace: true });
      return;
    }

    if (accountStatus === "pending") {
      actions.updateTokens(accessToken, refreshToken);
      navigate({ to: "/register/review", replace: true });
      return;
    }

    if (hasUploadedDocuments) {
      actions.updateTokens(accessToken, refreshToken);
      navigate({ to: "/jobs", replace: true });
      return;
    }

    actions.setTempToken(accessToken);
    const stepRoutes: Record<string, string> = {
      pending_otp: "/register/verify",
      otp_verified: "/register/password",
      password_set: "/register/company",
      profile_complete: "/register/verification",
    };

    navigate({ to: stepRoutes[registrationStep] || "/register/company", replace: true });
  }, [actions, navigate]);

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
      <p className="text-[#202224] text-base">Signing in with Google...</p>
    </div>
  );
}
