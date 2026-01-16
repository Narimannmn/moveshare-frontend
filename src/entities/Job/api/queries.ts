import { queryOptions } from "@tanstack/react-query";

import { jobKeys } from "./keys";
import * as services from "./services";

export const myJobsQueryOptions = (params?: { limit?: number; offset?: number }) =>
  queryOptions({
    queryKey: jobKeys.myJobs(params),
    queryFn: () => services.listMyJobs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const availableJobsQueryOptions = (params?: { limit?: number; offset?: number }) =>
  queryOptions({
    queryKey: jobKeys.availableJobs(params),
    queryFn: () => services.listAvailableJobs(params),
    staleTime: 5 * 60 * 1000,
  });

export const jobQueryOptions = (jobId: number) =>
  queryOptions({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => services.getJob(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
  });
