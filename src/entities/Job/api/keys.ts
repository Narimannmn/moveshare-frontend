export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  myJobs: (filters?: {limit?: number; offset?: number}) =>
    [...jobKeys.lists(), "my", filters] as const,
  availableJobs: (filters?: {limit?: number; offset?: number}) =>
    [...jobKeys.lists(), "available", filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
} as const;
