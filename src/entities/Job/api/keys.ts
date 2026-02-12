import type {JobListParams} from "../schemas";

export const jobKeys = {
  all: ["jobs"] as const,

  // List jobs
  lists: () => [...jobKeys.all, "list"] as const,
  list: (params?: JobListParams) => [...jobKeys.lists(), params] as const,

  // Job details
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,

  // Mutations
  create: () => [...jobKeys.all, "create"] as const,
} as const;
