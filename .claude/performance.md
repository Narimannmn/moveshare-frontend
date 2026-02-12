# ⚡ Performance Optimization

## When to Use Memoization

**✅ DO memoize**:
- Components receiving objects/arrays as props
- Components with 5+ props
- Components rendering lists
- Expensive computations (filtering, sorting, calculations)
- Callbacks passed to memoized child components

**❌ DON'T memoize**:
- Simple components (< 20 lines, primitive props only)
- Components that rarely re-render
- Premature optimization

## Memoization Patterns

```typescript
import {memo, useMemo, useCallback} from "react";

// ✅ Memoize components with complex props
export const UserList = memo(({users, onUserSelect}: UserListProps) => {
  return (
    <div className={styles.list}>
      {users.map(user => (
        <UserCard key={user.id} user={user} onSelect={onUserSelect} />
      ))}
    </div>
  );
});

UserList.displayName = "UserList";

// ✅ Memoize heavy computations
export const useFilteredUsers = (users: User[], filters: FilterState) => {
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (filters.role && user.role !== filters.role) return false;
      if (filters.status && user.status !== filters.status) return false;
      return true;
    });
  }, [users, filters]);

  return filteredUsers;
};

// ✅ Memoize callbacks passed as props
export const UserDashboard = ({userId}: {userId: number}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  return <UserList users={users} onUserSelect={handleSelect} />;
};
```

## Performance Checklist

- [ ] Large lists use `key` prop correctly (stable IDs, not index)
- [ ] Heavy computations wrapped in `useMemo`
- [ ] Callbacks passed as props wrapped in `useCallback`
- [ ] Components with complex props use `memo`
- [ ] Zustand selectors use `useShallow` for multiple values
- [ ] Images lazy loaded with `loading="lazy"`
