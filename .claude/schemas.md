# 📋 Schemas with Zod

## Single Source of Truth

```typescript
import {z} from "zod";

// 1. Define Zod schema
export const EntitySchema = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(["active", "inactive", "pending"]),
  createdAt: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// 2. Infer TypeScript type
export type Entity = z.infer<typeof EntitySchema>;

// 3. Extract constants from schema
export type EntityStatus = z.infer<typeof EntitySchema>["status"];
```

## Principles

- ✅ Schema is the source of truth
- ✅ Types are inferred via `z.infer`
- ✅ Constants colocated with schemas
- ✅ Never duplicate type definitions
- ✅ All API responses validated with `.parse()`

## Schemas Index (`schemas/index.ts`)

```typescript
export * from "./entity";
export * from "./entityList";
export * from "./entityUpdate";
```
