import { useEffect } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@entities/User/model/store/authStore";

import { CompanyInfoForm } from "@features/auth/registerWithEmail/ui/CompanyInfoForm";

export const Route = createFileRoute("/(auth)/register/company")({
  component: RegisterCompanyPage,
});

function RegisterCompanyPage() {
  const navigate = useNavigate();
  const tempToken = useAuthStore((state) => state.tempToken);

  // Guard: redirect if no temp token
  useEffect(() => {
    if (!tempToken) {
      navigate({ to: "/register", replace: true });
    }
  }, [tempToken, navigate]);

  const handleCompanySuccess = () => {
    // Navigate to verification (file upload) step
    navigate({ to: "/register/verification" });
  };

  if (!tempToken) {
    return null;
  }

  return (
    <div className="w-full max-w-[852px] mx-auto bg-white p-10 rounded-2xl">
      <CompanyInfoForm onSuccess={handleCompanySuccess} />
    </div>
  );
}
