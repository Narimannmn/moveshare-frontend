import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { accessToken } = useAuthStore.getState();

    if (!accessToken) {
      throw redirect({ to: "/login", replace: true });
    }

    // Redirect authenticated users to jobs page
    throw redirect({ to: "/jobs", replace: true });
  },
});
