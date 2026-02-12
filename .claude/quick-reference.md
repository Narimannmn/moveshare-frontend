# 🎯 Quick Reference

## Development Commands

- **Start dev server**: `npm run dev` (Vite dev server with HMR)
- **Build for production**: `npm run build` (TypeScript check + Vite build)
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint` (ESLint with TypeScript)
- **Type check**: `tsc -b` (Build all TypeScript projects)

## Tech Stack

**Core**: React 19.2.0 + TypeScript 5.9.3 (strict mode), Vite 7.2.4

**Routing**: TanStack Router 1.141.8 (file-based, type-safe routing)

**State Management**:
- **Server state**: TanStack Query v5.90.12
- **Client state**: Zustand 5.0.9 (with persist middleware, localStorage)

**Forms**: React Hook Form 7.69.0 + Zod 4.2.1 validation

**UI/Styling**:
- **CSS Framework**: Tailwind CSS 4.1.18
- **Components**: Radix UI (accessible primitives)
- **Styling Utils**: class-variance-authority, tailwind-merge
- **SCSS**: SASS Embedded 1.97.1 (for complex styles)
- **Icons**: Lucide React 0.562.0, React Icons 5.5.0

**Data Visualization**: Recharts 3.6.0

**i18n**: i18next 25.7.3 + react-i18next 16.5.0
- Currently configured for English only
- Browser language detection enabled

**Font**: Onest (Google Fonts, weights 100-900)

## TypeScript Rules

- ✅ TypeScript only (`.ts`, `.tsx`)
- ✅ No `any` types (use `unknown` if needed)
- ✅ Enable strict mode (already configured)
- ✅ Named exports only (no default exports)
- ✅ Infer types from Zod schemas: `type User = z.infer<typeof UserSchema>`
- ✅ Unused locals/parameters treated as errors

## Project Configuration

**Path Aliases** (tsconfig.json + vite.config.ts):
```typescript
@/*          → ./src/*
@app/*       → ./src/app/*
@pages/*     → ./src/pages/*
@widgets/*   → ./src/widgets/*
@features/*  → ./src/features/*
@entities/*  → ./src/entities/*
@shared/*    → ./src/shared/*
```

**Vite Plugins**:
- `@vitejs/plugin-react-swc` - Fast Refresh with SWC
- `@tanstack/router-plugin` - Auto route generation
- `@tailwindcss/vite` - Tailwind CSS v4 support

**Build Output**: `/dist` (gitignored)

## Common Imports

```typescript
// Routing
import {createFileRoute, Link, useNavigate} from "@tanstack/react-router";

// State Management
import {create} from "zustand";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";

// Forms
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// Validation
import {z} from "zod";

// UI Components
import {Button, Input, Checkbox} from "@shared/ui";

// Radix UI
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

// Styling
import {cn} from "@shared/lib/utils";
import {cva} from "class-variance-authority";

// Icons
import {Mail, Settings, User} from "lucide-react";

// Utils
import {getAccessToken, setAccessToken} from "@shared/utils/token";
import {formatDate} from "@shared/utils/date";
```

## Key Patterns

### Creating a New Entity

1. Create entity folder: `src/entities/EntityName/`
2. Add schema: `schemas/entityName.ts` (Zod schema)
3. Add API layer: `api/keys.ts`, `api/services.ts`, `api/queries.ts`, `api/mutations.ts`
4. Add store (optional): `store/entityStore.ts` (Zustand)
5. Add hooks (optional): `hooks/useEntityData.ts`
6. Add UI (optional): `ui/EntityCard/EntityCard.tsx`
7. Export from: `index.ts`

### Creating a New Route

1. Add file to `src/pages/`: `(app)/new-page.tsx`
2. Use `createFileRoute()` pattern
3. Route auto-generates in `src/app/routeTree.gen.ts`
4. Access at `/new-page`

### Creating a New Component

1. Check `@shared/ui` first - reuse if possible
2. Check Radix UI for accessible primitives
3. Create in appropriate layer (entities/ui, widgets, shared/ui)
4. Use Tailwind CSS for styling
5. Add TypeScript interface for props
6. Use named export

## Design System Colors

```typescript
Primary Blue: #60A5FA
Text Dark: #202224
Text Gray: #666C72
Background: #F5F6FA
Border: #D8D8D8
White: #FFFFFF
```

## Storage Keys

Defined in `@shared/config/appLocalStorage.ts`:
```typescript
ACCESS_TOKEN = "accessToken"
REFRESH_TOKEN = "refreshToken"
// Add more as needed
```

## Environment

- **Node**: Uses ES2022 features
- **Module System**: ESNext
- **JSX Runtime**: react-jsx (automatic)
- **Target Browsers**: Modern browsers (ES2020+)

## Useful Commands

```bash
# Check bundle size
npm run build && ls -lh dist/assets

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json && npm install

# Check TypeScript errors
tsc --noEmit

# Run in specific port
npm run dev -- --port 3001

# Analyze dependencies (if needed)
npx vite-bundle-visualizer
```

## Performance Tips

- Use `memo()` for components with complex props
- Use `useMemo()` for expensive computations
- Use `useCallback()` for callbacks passed as props
- Use `useShallow()` from Zustand for multiple selections
- Leverage TanStack Router code splitting (automatic)
- Use TanStack Query cache effectively (staleTime, gcTime)

## Common Gotchas

1. **Route files must export `Route`**: `export const Route = createFileRoute(...)`
2. **Don't edit routeTree.gen.ts**: It's auto-generated
3. **Zustand actions in namespace**: `actions: { action1, action2 }`
4. **Controller for form inputs**: Use `<Controller>` with `@shared/ui` components
5. **Parse API responses with Zod**: Always validate in `services.ts`
6. **Use localStorage, not cookies**: Project uses localStorage for persistence
7. **Named exports only**: No `export default`
