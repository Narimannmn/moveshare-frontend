import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { queryClient } from "@/app/providers/query";

import { appSessionStorage } from "../appSessionStorage/appSessionStorage";

export const logoutUser = () => {
  // Clear auth store (includes persisted tokens and user data)
  useAuthStore.getState().actions.logout();

  // Clear session storage
  appSessionStorage.unvalidateToken();

  // Clear all cached queries
  queryClient.clear();
};
