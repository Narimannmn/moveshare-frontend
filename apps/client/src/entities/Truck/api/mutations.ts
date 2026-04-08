import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateTruckRequest } from "../schemas/truck";
import { truckKeys } from "./keys";
import * as services from "./services";

export const useCreateTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...truckKeys.all(), "create"],
    mutationFn: (data: CreateTruckRequest) => services.createTruck(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: truckKeys.lists() });
    },
  });
};

export const useDeleteTruck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...truckKeys.all(), "delete"],
    mutationFn: (truckId: string) => services.deleteTruck(truckId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: truckKeys.lists() });
    },
  });
};
