export const truckKeys = {
  all: () => ["trucks"] as const,
  lists: () => [...truckKeys.all(), "list"] as const,
  list: (filters: { offset?: number; limit?: number }) =>
    [...truckKeys.lists(), filters] as const,
  details: () => [...truckKeys.all(), "detail"] as const,
  detail: (id: string) => [...truckKeys.details(), id] as const,
};
