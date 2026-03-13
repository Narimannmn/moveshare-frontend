import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { truckKeys } from "./keys";
import { getTrucks } from "./services";

export const trucksListQueryOptions = (filters: { offset?: number; limit?: number }) =>
  queryOptions({
    queryKey: truckKeys.list(filters),
    queryFn: () => getTrucks(filters),
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
  });

export const useTrucks = (filters: { offset?: number; limit?: number } = {}) => {
  return useQuery({
    ...trucksListQueryOptions(filters),
    enabled: !!useAuthStore.getState().accessToken,
  });
};
