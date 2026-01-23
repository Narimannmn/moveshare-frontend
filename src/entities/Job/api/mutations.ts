import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useNavigate} from "@tanstack/react-router";

import type {CreateJobRequest, UpdateJobRequest} from "../schemas";
import {jobKeys} from "./keys";
import * as services from "./services";

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
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
      queryClient.invalidateQueries({queryKey: jobKeys.myJobs()});
      queryClient.invalidateQueries({queryKey: jobKeys.availableJobs()});
      navigate({to: "/my"});
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({jobId, data}: {jobId: string; data: UpdateJobRequest}) =>
      services.updateJob(jobId, data),
    onSettled: (_, __, {jobId}) => {
      queryClient.invalidateQueries({queryKey: jobKeys.detail(jobId)});
      queryClient.invalidateQueries({queryKey: jobKeys.myJobs()});
      queryClient.invalidateQueries({queryKey: jobKeys.availableJobs()});
    },
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => services.cancelJob(jobId),
    onSettled: (_, __, jobId) => {
      queryClient.invalidateQueries({queryKey: jobKeys.detail(jobId)});
      queryClient.invalidateQueries({queryKey: jobKeys.myJobs()});
    },
  });
};
