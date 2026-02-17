import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import type { CancelJobsRequest, CreateJobRequest, ExportJobsRequest } from "../schemas";
import { jobKeys } from "./keys";
import * as services from "./services";

// ============================================
// Create Job Mutation
// ============================================

interface UseCreateJobOptions {
  navigateOnSuccess?: boolean;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCreateJob = (options: UseCreateJobOptions = {}) => {
  const { navigateOnSuccess = true, onSuccess, onError } = options;
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
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      if (navigateOnSuccess) {
        navigate({ to: "/my" });
      }
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

// ============================================
// Cancel Jobs Mutation
// ============================================

interface UseCancelJobsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useCancelJobs = (options: UseCancelJobsOptions = {}) => {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: jobKeys.cancel(),
    mutationFn: (request: CancelJobsRequest) => services.cancelJobs(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() });
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

// ============================================
// Export Jobs CSV Mutation
// ============================================

export const useExportJobsCsv = () => {
  return useMutation({
    mutationKey: jobKeys.exportCsv(),
    mutationFn: (request?: ExportJobsRequest) => services.exportJobsCsv(request),
  });
};
