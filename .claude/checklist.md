# ✅ Code Review Checklist

## Architecture & Structure
- [ ] Follows FSD layer structure correctly
- [ ] Imports only from lower layers, never upward
- [ ] Uses path aliases (`@entities/*`, not `../../../entities`)
- [ ] Entity has complete structure (api, schemas, store, hooks, ui, index.ts)
- [ ] Components are granular (20-50 lines, single responsibility)
- [ ] Business logic separated into custom hooks

## Routing (TanStack Router)
- [ ] Route files export `Route` with `createFileRoute()`
- [ ] Never edit `routeTree.gen.ts` (auto-generated)
- [ ] Use `beforeLoad` for route protection
- [ ] Use `loader` for data prefetching
- [ ] Use `Route.useParams()` for type-safe params
- [ ] Use `Route.useSearch()` for type-safe search params
- [ ] Use `<Link to="...">` for navigation (type-safe)
- [ ] Route groups `(auth)`, `(app)` used correctly

## TypeScript & Type Safety
- [ ] TypeScript strict mode passes
- [ ] No `any` types (use `unknown` if needed)
- [ ] Zod schemas defined, types inferred with `z.infer`
- [ ] Props interfaces explicitly defined

## Data Management
- [ ] TanStack Query used for server state (queries/mutations)
- [ ] Zustand used for client state (with persist middleware for localStorage)
- [ ] API responses validated with Zod in `services.ts`
- [ ] Query options use `queryOptions()` from TanStack Query
- [ ] Transformations done in query `select`, not components
- [ ] Mutations invalidate queries with `onSettled`

## Performance
- [ ] Components with complex props use `memo`
- [ ] Heavy computations wrapped in `useMemo`
- [ ] Callbacks passed as props wrapped in `useCallback`
- [ ] Zustand selectors use `useShallow` from `zustand/react/shallow` for multiple values
- [ ] List items have stable unique `key` (not index)
- [ ] TanStack Router code splitting (automatic per route)
- [ ] TanStack Query cache configured (staleTime, gcTime)

## Forms & Validation
- [ ] Forms use React Hook Form + `zodResolver`
- [ ] @shared/ui components wrapped with `<Controller>`
- [ ] Form data types inferred from Zod schemas (`z.infer<typeof Schema>`)

## UI & Styling
- [ ] **Use @shared/ui components first** (Button, Input, Checkbox, etc.)
- [ ] **Use Radix UI primitives** for complex components (Dialog, Select, Dropdown)
- [ ] **Use Tailwind CSS** for styling (utility classes)
- [ ] **Use design system colors** (no random hardcoded colors)
- [ ] Use `cn()` helper from `@shared/lib/utils` for conditional classes
- [ ] Use CVA (class-variance-authority) for component variants
- [ ] Module SCSS only for complex styling that Tailwind can't handle
- [ ] Loading and error states handled gracefully
- [ ] Components return early for edge cases
- [ ] Icons from Lucide React or React Icons

## Code Quality
- [ ] Named exports only (no default exports)
- [ ] No unused imports/variables/code
- [ ] No commented-out code
- [ ] Prettier formatted (`npm run format`)
- [ ] No `console.log` in production code
- [ ] File imports organized (external → internal → local)

## Anti-Patterns Avoided
- [ ] No business logic in UI components
- [ ] No monolithic components (> 100 lines)
- [ ] No prop drilling (use context/store instead)
- [ ] No direct state mutation
- [ ] No manual type definitions when Zod can be used
- [ ] No missing error boundaries
