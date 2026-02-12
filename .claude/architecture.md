# 📁 Architecture: Feature-Sliced Design (FSD)

## Layer Structure

```
src/
├── app/          # Application entry, providers, routing, global styles
├── pages/        # Page compositions - file-based routing with TanStack Router
├── widgets/      # Large independent UI blocks (Header, Sidebar, Chat, JobsFilter)
├── features/     # User-facing functionality (auth flows, registration steps)
├── entities/     # Business entities (User, Chat, Job, Profile)
└── shared/       # Reusable code (UI components, utils, configs, types)
```

## Import Rules (Critical)

- ✅ **Higher layers → Lower layers** (e.g., `pages` can import from `entities`, `shared`)
- ❌ **Never reverse** (e.g., `entities` cannot import from `features`)
- ❌ Don't use relative imports across layers: `../../../entities/User`

## Path Aliases

- `@app/*` → `src/app/*`
- `@pages/*` → `src/pages/*`
- `@widgets/*` → `src/widgets/*`
- `@features/*` → `src/features/*`
- `@entities/*` → `src/entities/*`
- `@shared/*` → `src/shared/*`

## Entity Structure (Mandatory Template)

```
entities/EntityName/
├── api/              # API layer
│   ├── index.ts      # Re-exports
│   ├── keys.ts       # TanStack Query keys factory
│   ├── services.ts   # HTTP requests + Zod validation
│   ├── queries.ts    # queryOptions with transformations
│   └── mutations.ts  # Mutation hooks with cache invalidation
├── schemas/          # Zod schemas + inferred types
│   ├── index.ts
│   └── entityName.ts
├── lib/              # Business logic
│   └── transformers.ts
├── store/            # Zustand store (optional)
│   └── entityStore.ts
├── providers/        # React context providers (optional)
│   ├── index.ts
│   └── EntityStoreProvider.tsx
├── hooks/            # Custom hooks with useShallow (optional)
│   ├── index.ts
│   └── useEntityData.ts
├── ui/               # UI components (optional)
│   └── EntityCard/
│       ├── EntityCard.tsx
│       └── EntityCard.module.scss
├── data/             # Constants, enums, static config
│   └── data.tsx
└── index.ts          # Public API - only this is imported from outside
```

## TanStack Router (File-Based Routing)

### Route Structure

```
src/pages/
├── __root.tsx              # Root layout with Outlet
├── index.tsx               # Root redirect ("/")
├── (auth)/                 # Route group - public auth routes
│   ├── login.tsx          # /login
│   ├── register.tsx       # /register
│   └── forgot.tsx         # /forgot
└── (app)/                  # Route group - protected app routes
    ├── dashboard.tsx      # /dashboard
    ├── jobs.tsx           # /jobs
    ├── my.tsx             # /my
    ├── chat/
    │   ├── index.tsx      # /chat
    │   └── $id.tsx        # /chat/:id (dynamic route)
    ├── claimed.tsx        # /claimed
    └── profile/
        ├── index.tsx      # /profile
        ├── company.tsx    # /profile/company
        ├── fleet.tsx      # /profile/fleet
        └── ...
```

### Route Patterns

#### Basic Route

```typescript
// src/pages/(app)/dashboard.tsx
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return <div>Dashboard</div>;
}
```

#### Route with Loader (Data Fetching)

```typescript
// src/pages/(app)/jobs.tsx
import {createFileRoute} from "@tanstack/react-router";
import {jobsQueryOptions} from "@entities/Job";

export const Route = createFileRoute("/(app)/jobs")({
  loader: ({context: {queryClient}}) =>
    queryClient.ensureQueryData(jobsQueryOptions()),
  component: JobsPage,
});
```

#### Dynamic Route with Params

```typescript
// src/pages/(app)/chat/$id.tsx
import {createFileRoute} from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/chat/$id")({
  component: ChatDetailPage,
});

function ChatDetailPage() {
  const {id} = Route.useParams(); // Type-safe params
  return <div>Chat {id}</div>;
}
```

#### Protected Routes (beforeLoad)

```typescript
// src/pages/(app)/dashboard.tsx
import {redirect, createFileRoute} from "@tanstack/react-router";
import {getAccessToken} from "@shared/utils/token";

export const Route = createFileRoute("/(app)/dashboard")({
  beforeLoad: async () => {
    const token = getAccessToken();
    if (!token) {
      throw redirect({to: "/login"});
    }
  },
  component: DashboardPage,
});
```

#### Route Groups (Layouts)

```typescript
// src/pages/(auth)/__layout.tsx
// Shared layout for all (auth) routes
export const Route = createFileRoute("/(auth)")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#60A5FA]">
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
```

### Navigation

```typescript
import {Link, useNavigate} from "@tanstack/react-router";

// Type-safe Link component
<Link to="/dashboard" className="nav-link">
  Dashboard
</Link>

<Link to="/chat/$id" params={{id: "123"}}>
  Chat Detail
</Link>

// Programmatic navigation
const navigate = useNavigate();
navigate({to: "/jobs", search: {filter: "active"}});
```

### Search Params (Query Strings)

```typescript
import {createFileRoute} from "@tanstack/react-router";
import {z} from "zod";

const searchSchema = z.object({
  filter: z.string().optional(),
  page: z.number().default(1),
});

export const Route = createFileRoute("/(app)/jobs")({
  validateSearch: searchSchema,
  component: JobsPage,
});

function JobsPage() {
  const search = Route.useSearch(); // Type-safe: {filter?: string, page: number}
  return <div>Filter: {search.filter}</div>;
}
```

### Route Tree Generation

TanStack Router auto-generates `src/app/routeTree.gen.ts`:
- ✅ Never edit this file manually
- ✅ Auto-regenerates on file save
- ✅ Provides full type safety for navigation

### Key Concepts

1. **File-based routing**: File structure = URL structure
2. **Type-safe**: Params, search, and navigation are fully typed
3. **Code splitting**: Each route is automatically code-split
4. **Loaders**: Prefetch data before route renders
5. **Route groups**: `(auth)`, `(app)` don't appear in URL
6. **Dynamic routes**: `$id` becomes `:id` in URL

## Migration Strategy

**When touching legacy code:**

1. If file is < 100 lines → migrate fully to new patterns
2. If file is > 100 lines → create new file with new pattern, mark old as deprecated
3. Never mix old and new patterns in same file

**This project is new and follows modern patterns:**

- React 19 with latest features
- TanStack Router for type-safe routing
- TanStack Query v5 for server state
- Zustand for client state
- React Hook Form + Zod for forms
- Tailwind CSS + Radix UI for styling
- TypeScript strict mode
