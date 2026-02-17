import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/admin/")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/review-company", replace: true });
  },
});
