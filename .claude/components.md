# 🎨 Component Patterns

## UI Component Library Rule

**Priority Order**:
1. Use existing `@shared/ui` components (Button, Input, Checkbox, etc.)
2. Compose Radix UI primitives for complex components (Dialog, Select, Dropdown)
3. Create custom components with Tailwind CSS when necessary
4. **NEVER** use other UI libraries (MUI, Ant Design, Chakra, etc.)

See **ui-guidelines.md** for complete UI rules and styling patterns.

```typescript
// ✅ Good: Use @shared/ui components
import {Button, Input, Checkbox} from "@shared/ui";

// ✅ Good: Use Radix UI primitives
import * as Dialog from "@radix-ui/react-dialog";

// ❌ Bad: Other UI libraries
import {Button} from "@mui/material";
import {Input} from "antd";
```

## Separation of Concerns (Critical)

**Principle**: UI components only handle presentation. Business logic lives in hooks.

```typescript
// ✅ Good: Business logic in custom hook
// hooks/useUserCardLogic.ts
export const useUserCardLogic = (userId: number) => {
  const {data: user, isLoading, isError} = useQuery(userQueryOptions(userId));
  const [isExpanded, setIsExpanded] = useState(false);

  const isUserActive = useMemo(() => {
    if (!user?.lastLogin) return false;
    const daysSinceLogin = (Date.now() - new Date(user.lastLogin).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLogin < 7;
  }, [user?.lastLogin]);

  const toggleExpanded = useCallback(() => setIsExpanded(prev => !prev), []);

  return {user, isLoading, isError, isExpanded, isUserActive, toggleExpanded};
};

// ui/UserCard/UserCard.tsx - Pure presentation
export const UserCard = ({userId}: {userId: number}) => {
  const {user, isLoading, isError, isExpanded, isUserActive, toggleExpanded} = useUserCardLogic(userId);

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage />;
  if (!user) return null;

  return (
    <div className={styles.card}>
      <UserCardHeader name={user.name} isActive={isUserActive} onToggle={toggleExpanded} />
      {isExpanded && <UserCardDetails user={user} />}
    </div>
  );
};
```

## Component Granularity

**Principle**: Break components into small, focused pieces (20-50 lines max). Each component should do ONE thing.

```typescript
// ✅ Good: Granular components
export const UserDashboard = ({userId}: {userId: number}) => {
  const {user, stats, courses} = useUserDashboard(userId);

  return (
    <div className={styles.dashboard}>
      <UserDashboardHeader user={user} />
      <UserStatsSection stats={stats} />
      <UserCoursesSection courses={courses} />
    </div>
  );
};
```

## Component Structure Template

```typescript
// 1. Imports
import {memo} from "react";
import {useComponentLogic} from "./useComponentLogic";
import styles from "./Component.module.scss";

// 2. Types
interface ComponentProps {
  userId: number;
  onAction?: (id: number) => void;
}

// 3. Component (presentation only)
export const Component = memo(({userId, onAction}: ComponentProps) => {
  const {data, handlers, computed} = useComponentLogic(userId);

  // Early returns
  if (data.isLoading) return <Spinner />;
  if (data.isError) return <ErrorMessage />;

  return (
    <div className={styles.container}>
      {/* Pure presentation */}
    </div>
  );
});

Component.displayName = "Component";
```

## Styling

**Priority**: Use Tailwind CSS first, then SCSS modules for complex styling.

```typescript
import {cn} from "@shared/lib/utils";
import styles from "./Component.module.scss";

// ✅ Good: Tailwind CSS
<div className="p-4 bg-white rounded-[10px] border border-[#D8D8D8]" />

// ✅ Good: Conditional with cn helper
<div className={cn(
  "p-4 rounded-md",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50"
)} />

// ✅ Good: SCSS for complex styling
<div className={cn(styles.card, {
  [styles.active]: isActive,
  [styles.disabled]: isDisabled,
})} />
```

```scss
// Component.module.scss
.card {
  padding: 1rem;
  background: #ffffff;
  border-radius: 10px;

  // Complex animations or pseudo-elements
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 0.1;
  }
}
```

## Component Principles

- **Props interface** - always define explicit interface
- **Early returns** - handle loading/error states first
- **Destructure props** - `({userId, onSelect})` not `(props)`
- **Separation of concerns** - UI in component, logic in hooks
- **Granularity** - break into small, focused components (20-50 lines max)
- **Composition** - prefer composition over monolithic components
- **Module SCSS** - `ComponentName.module.scss`
- **Named exports** - no default exports
