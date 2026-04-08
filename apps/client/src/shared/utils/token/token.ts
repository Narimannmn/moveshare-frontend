import { appLocalStorageKey } from "@/shared/config/appLocalStorage/appLocalStorage";

import { appLocalStorage } from "../appLocalStorage/appLocalStorage";

export const isTokenValid = (token: { accessToken: string; refreshToken: string; exp: number }) => {
  return token.exp * 1000 > new Date().getTime();
};

export const getLocalStorageTokens = () => {
  const accessToken = appLocalStorage.getItem(appLocalStorageKey.accessToken);
  const refreshToken = appLocalStorage.getItem(appLocalStorageKey.refreshToken);

  return {
    accessToken,
    refreshToken,
  };
};
