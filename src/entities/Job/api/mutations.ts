import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "@tanstack/react-router";

import type {CreateJobRequest} from "../schemas";
import {jobKeys} from "./keys";
import * as services from "./services";

// ============================================
// Create Job Mutation
// ============================================

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: jobKeys.create(),
    mutationFn: ({
      data,
      itemImages,
      inventoryPdf,
    }: {
      data: CreateJobRequest;
      itemImages?: File[];
      inventoryPdf?: File;
    }) => services.createJob(data, itemImages, inventoryPdf),
    onSuccess: () => {
      // Invalidate jobs list to refetch
      queryClient.invalidateQueries({queryKey: jobKeys.lists()});
      navigate({to: "/my"});
    },
  });
};
