import {queryOptions, useQuery} from "@tanstack/react-query";

import type { AppliedJobsParams, JobListParams, MyJobsParams } from "../schemas";
import {jobKeys} from "./keys";
import * as services from "./services";

// ============================================
// Available Jobs Query
// ============================================

export const availableJobsQueryOptions = (params?: JobListParams) =>
  queryOptions({
    queryKey: jobKeys.list(params),
    queryFn: () => services.getAvailableJobs(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useAvailableJobs = (params?: JobListParams) => {
  return useQuery(availableJobsQueryOptions(params));
};

// ============================================
// Available Jobs Locations Query
// ============================================

export const availableJobLocationsQueryOptions = () =>
  queryOptions({
    queryKey: jobKeys.locations(),
    queryFn: () => services.getAvailableJobLocations(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useAvailableJobLocations = () => {
  return useQuery(availableJobLocationsQueryOptions());
};

// ============================================
// Job Detail Query
// ============================================

export const jobDetailQueryOptions = (jobId: string) =>
  queryOptions({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => services.getJobById(jobId),
    enabled: !!jobId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useJob = (jobId: string) => {
  return useQuery(jobDetailQueryOptions(jobId));
};

// ============================================
// My Jobs Query
// ============================================

export const myJobsQueryOptions = (params?: MyJobsParams) =>
  queryOptions({
    queryKey: jobKeys.myJobsList(params),
    queryFn: () => services.getMyJobs(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useMyJobs = (params?: MyJobsParams) => {
  return useQuery(myJobsQueryOptions(params));
};

// ============================================
// Applied / Claimed Jobs Query
// ============================================

export const appliedJobsQueryOptions = (params?: AppliedJobsParams) =>
  queryOptions({
    queryKey: jobKeys.appliedList(params),
    queryFn: () => services.getAppliedJobs(params),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export const useAppliedJobs = (params?: AppliedJobsParams) => {
  return useQuery(appliedJobsQueryOptions(params));
};
