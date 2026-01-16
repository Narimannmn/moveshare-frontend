import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import type { UpdateJobRequest } from "../schemas";
import { jobKeys } from "./keys";
import * as services from "./services";

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: services.createJob,
    onSuccess: () => {
      // Invalidate job lists
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() });
      queryClient.invalidateQueries({ queryKey: jobKeys.availableJobs() });

      // Navigate to job detail (assuming there's a job detail route)
      // Adjust the route path according to your routing structure
      navigate({ to: "/my" });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: number; data: UpdateJobRequest }) =>
      services.updateJob(jobId, data),
    onSettled: (_, __, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() });
      queryClient.invalidateQueries({ queryKey: jobKeys.availableJobs() });
    },
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: services.cancelJob,
    onSettled: (_, __, jobId) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.myJobs() });
    },
  });
};

export const useUploadJobImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, file }: { jobId: number; file: File }) =>
      services.uploadJobImage(jobId, file),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.images(jobId) });
    },
  });
};

export const useDeleteJobImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, imageId }: { jobId: number; imageId: number }) =>
      services.deleteJobImage(jobId, imageId),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobKeys.images(jobId) });
    },
  });
};
