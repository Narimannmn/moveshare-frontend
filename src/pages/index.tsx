import { createFileRoute, redirect } from "@tanstack/react-router";
import { appLocalStorageKey } from "@/shared/config";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const accessToken = localStorage.getItem(appLocalStorageKey.accessToken);

    if (!accessToken) {
      throw redirect({
        to: "/login",
        replace: true,
      });
    }

    throw redirect({
      to: "/jobs",
      replace: true,
    });
  },
});
