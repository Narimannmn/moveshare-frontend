import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { getJwtStatus } from "@/shared/utils/jwt/getJwtStatus";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw redirect({ to: "/login", replace: true });
    }

    if (getJwtStatus(accessToken) === "pending") {
      throw redirect({ to: "/register/review", replace: true });
    }

    // Redirect authenticated users to jobs page
    throw redirect({ to: "/jobs", replace: true });
  },
});
