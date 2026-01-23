import { type PropsWithChildren } from "react";

import { Navigate, useLocation } from "@tanstack/react-router";

import { useCompanyProfile } from "@/entities/Auth";
import { useAuthStore } from "@/entities/Auth/model/store/authStore";

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.actions.logout);

  const { isLoading, error } = useCompanyProfile();

  // If no access token, redirect to login with callback
  if (!accessToken) {
    return (
      <Navigate
        to="/login"
        search={{ callbackUrl: pathname !== "/" ? pathname : undefined }}
        replace
      />
    );
  }

  // Show loader while fetching company profile
  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // On error (e.g., 401, company not found), logout and redirect
  if (error) {
    logout();
    return <Navigate to="/login" replace />;
  }

  return children;
};
