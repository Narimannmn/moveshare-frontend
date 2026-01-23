import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { authKeys } from "./keys";
import { getCompanyProfile } from "./services";

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
      // Store company profile in auth store whenever data is fetched
      setCompanyProfile(data);
      return data;
    },
  });
};
