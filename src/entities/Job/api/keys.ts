import type { JobListParams, MyJobsParams } from "../schemas";

export const jobKeys = {
  all: ["jobs"] as const,

  // List jobs
  lists: () => [...jobKeys.all, "list"] as const,
  list: (params?: JobListParams) => [...jobKeys.lists(), params] as const,

  // My jobs
  myJobs: () => [...jobKeys.all, "my"] as const,
  myJobsList: (params?: MyJobsParams) => [...jobKeys.myJobs(), params] as const,

  // Job details
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,

  // Mutations
  create: () => [...jobKeys.all, "create"] as const,
  cancel: () => [...jobKeys.all, "cancel"] as const,
  exportCsv: () => [...jobKeys.all, "export-csv"] as const,
} as const;
