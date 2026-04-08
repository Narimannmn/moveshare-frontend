import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { authKeys } from "./keys";
import { getActiveSessions, getCompanyProfile, getNotificationPreferences } from "./services";

export const companyProfileQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.companyProfile(),
    queryFn: getCompanyProfile,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useCompanyProfile = () => {
  const setCompanyProfile = useAuthStore((state) => state.actions.setCompanyProfile);

  return useQuery({
    ...companyProfileQueryOptions(),
    enabled: !!useAuthStore.getState().accessToken,
    select: (data) => {
      setCompanyProfile(data);
      return data;
    },
  });
};

export const activeSessionsQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.sessions(),
    queryFn: getActiveSessions,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

export const useActiveSessions = (enabled = true) => {
  return useQuery({
    ...activeSessionsQueryOptions(),
    enabled: enabled && !!useAuthStore.getState().accessToken,
  });
};

export const notificationPreferencesQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.notificationPreferences(),
    queryFn: getNotificationPreferences,
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
  });

export const useNotificationPreferences = () =>
  useQuery({
    ...notificationPreferencesQueryOptions(),
    enabled: !!useAuthStore.getState().accessToken,
  });
