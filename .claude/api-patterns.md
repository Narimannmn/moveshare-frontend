# 🗂️ API Layer Pattern

## 1. Keys Factory (`api/keys.ts`)

```typescript
export const entityKeys = {
  all: ["entity"] as const,
  lists: () => [...entityKeys.all, "list"] as const,
  list: (filters: string) => [...entityKeys.lists(), filters] as const,
  details: () => [...entityKeys.all, "detail"] as const,
  detail: (id: number) => [...entityKeys.details(), id] as const,
} as const;
```

**Purpose**: Hierarchical, type-safe query keys for TanStack Query cache management

## 2. Services (`api/services.ts`)

```typescript
import {axiosRequest} from "@shared/api/xhr";
import {EntitySchema} from "../schemas";

export const getEntity = async (id: number): Promise<Entity> => {
  const response = await axiosRequest.get(`/api/entity/${id}/`);
  return EntitySchema.parse(response); // Zod validation
};

export const updateEntity = async (id: number, data: EntityUpdate): Promise<Entity> => {
  const response = await axiosRequest.put(`/api/entity/${id}/`, data);
  return EntitySchema.parse(response);
};
```

**Pattern**:
1. Fetch from API
2. Validate with Zod `.parse()`
3. Return typed data
4. Add a try catch for error handling

## 3. Query Options (`api/queries.ts`)

```typescript
import {queryOptions} from "@tanstack/react-query";
import {entityKeys} from "./keys";
import {getEntity} from "./services";

export const entityQueryOptions = (id: number | string) => {
  const numericId = Number(id);

  return queryOptions({
    queryKey: numericId ? entityKeys.detail(numericId) : entityKeys.all,
    queryFn: () => getEntity(numericId!),
    enabled: !!numericId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    throwOnError: true,
  });
};
```

**Key Points**:
- Use `queryOptions` for reusability
- Transform in `select` (not in components)
- Set appropriate `staleTime` and `gcTime`
- Use `enabled` for conditional fetching

## 4. Mutations (`api/mutations.ts`)

```typescript
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {entityKeys} from "./keys";
import {updateEntity} from "./services";

export const useEntityUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: number; data: EntityUpdate}) => updateEntity(id, data),
    // ✅ Use onSettled (not onSuccess) to invalidate regardless of success/failure
    onSettled: (_, __, {id}) => {
      queryClient.invalidateQueries({queryKey: entityKeys.detail(id)});
      queryClient.invalidateQueries({queryKey: entityKeys.lists()});
    },
  });
};
```

**When to invalidate**:
- `onSettled` - always (recommended)
- `onSuccess` - only if you need success-only side effects
- `onError` - rarely needed

## 5. API Index (`api/index.ts`)

```typescript
export * from "./keys";
export * from "./services";
export * from "./queries";
export * from "./mutations";
```

## Data Flow

### Query Flow
```
Component → useQuery(queryOptions) → service (fetch + Zod) →
select transformer → Zustand (optional) → Hook with useShallow → Render
```

### Mutation Flow
```
User action → useMutation → service (POST/PUT + Zod) →
onSettled invalidate → TanStack Query refetch → Re-render
```
