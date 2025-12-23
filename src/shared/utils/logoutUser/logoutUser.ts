import { useAuthStore } from "@/entities/User/model/store/authStore";
import { appLocalStorage } from "../appLocalStorage/appLocalStorage";
import { appSessionStorage } from "../appSessionStorage/appSessionStorage";
import { appLocalStorageKey } from "@/shared/config";
import { queryClient } from "@/app/providers/query";

export const logoutUser = () => {
  useAuthStore.getState().logout();

  appSessionStorage.unvalidateToken();
  appLocalStorage.removeItem(appLocalStorageKey.accessToken);
  appLocalStorage.removeItem(appLocalStorageKey.refreshToken);

  queryClient.clear();
};
