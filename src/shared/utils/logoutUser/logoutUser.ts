import { appLocalStorageKey } from "@/shared/config";

import { useAuthStore } from "@/entities/User/model/store/authStore";

import { queryClient } from "@/app/providers/query";

import { appLocalStorage } from "../appLocalStorage/appLocalStorage";
import { appSessionStorage } from "../appSessionStorage/appSessionStorage";

export const logoutUser = () => {
  useAuthStore.getState().actions.logout();

  appSessionStorage.unvalidateToken();
  appLocalStorage.removeItem(appLocalStorageKey.accessToken);
  appLocalStorage.removeItem(appLocalStorageKey.refreshToken);

  queryClient.clear();
};
