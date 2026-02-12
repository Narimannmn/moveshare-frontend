# 🚫 Anti-Patterns

## 0. ❌ Using Other UI Libraries or Wrong Styling Approach

**CRITICAL**: This is the most important anti-pattern to avoid.

```typescript
// ❌ Bad: Using other UI libraries
import {Button} from "@mui/material";
import {Input} from "antd";
import {Modal} from "@shopify/polaris";

// ❌ Bad: Creating custom UI components when @shared/ui has them
export const CustomButton = () => {
  return <button className={styles.btn}>Click</button>;
};

// ❌ Bad: Not using design system colors
<div className="bg-[#123456] text-[#abcdef]" /> // Random colors

// ✅ Good: Use @shared/ui components
import {Button, Input} from "@shared/ui";

export const LoginForm = () => {
  return (
    <div>
      <Input label="Email" />
      <Button variant="primary">Submit</Button>
    </div>
  );
};

// ✅ Good: Use Radix UI primitives for complex components
import * as Dialog from "@radix-ui/react-dialog";

export const Modal = ({children}) => {
  return (
    <Dialog.Root>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

// ✅ Good: Use design system colors
<div className="bg-[#60A5FA] text-[#202224]" /> // Design system colors
```

**See ui-guidelines.md for complete rules.**

## 1. ❌ Mixing Business Logic with UI

```typescript
// ❌ Bad: Logic in component
export const UserProfile = ({userId}: {userId: string}) => {
  const {data: user} = useQuery(userQueryOptions(userId));
  const canEdit = user?.role === "admin" || user?.id === currentUserId;
  return <div>{user?.name}</div>;
};

// ✅ Good: Logic in hook
export const useUserProfile = (userId: string) => {
  const {data: user} = useQuery(userQueryOptions(userId));
  const {currentUserId} = useAuthStore();

  const canEdit = useMemo(
    () => user?.role === "admin" || user?.id === currentUserId,
    [user?.role, user?.id, currentUserId]
  );

  return {user, canEdit};
};

export const UserProfile = ({userId}: {userId: string}) => {
  const {user, canEdit} = useUserProfile(userId);
  return <div>{user?.name}</div>;
};
```

## 2. ❌ Not Memoizing Callbacks

```typescript
// ❌ Bad: New function on every render
{users.map((user) => (
  <UserCard
    key={user.id}
    user={user}
    onSelect={(id) => setSelected((prev) => [...prev, id])}
  />
))}

// ✅ Good: Memoized callback
const handleSelect = useCallback((id: string) => {
  setSelected((prev) => [...prev, id]);
}, []);

{users.map((user) => (
  <UserCard key={user.id} user={user} onSelect={handleSelect} />
))}
```

## 3. ❌ Incorrect Zustand Usage

```typescript
// ❌ Bad: Will re-render on EVERY store change
const state = useStore();

// ❌ Bad: Multiple values without useShallow
const {userName, userEmail} = useStore((s) => ({
  userName: s.user.name,
  userEmail: s.user.email,
}));

// ✅ Good: Selective subscription - only re-renders when userName changes
const userName = useStore((s) => s.user.name);

// ✅ Good: useShallow for multiple values
import {useShallow} from "zustand/react/shallow";

const {userName, userEmail} = useStore(
  useShallow((s) => ({
    userName: s.user.name,
    userEmail: s.user.email,
  }))
);
```

## 4. ❌ Mutating State Directly

```typescript
// ❌ Bad: Direct mutation
users.push(user);
setUsers(users);

// ❌ Bad: Mutating object property
user.name = "New Name";
setUser(user);

// ✅ Good: Immutable updates
setUsers((prev) => [...prev, user]);

// ✅ Good: Spread operator for objects
setUser((prev) => ({...prev, name: "New Name"}));
```

## 5. ❌ Not Handling Loading/Error States

```typescript
// ❌ Bad: Assumes data is always there
const {data: user} = useQuery(userQueryOptions(userId));
return <div>{user.name}</div>; // Will crash if user is undefined!

// ✅ Good: Handle all states
const {data: user, isLoading, isError} = useQuery(userQueryOptions(userId));

if (isLoading) return <Spinner />;
if (isError) return <ErrorMessage />;
if (!user) return null;

return <div>{user.name}</div>;
```

## 6. ❌ Using Index as Key

```typescript
// ❌ Bad: Using array index
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}

// ✅ Good: Using stable unique ID
{users.map((user) => (
  <UserCard key={user.id} user={user} />
))}
```

## 7. ❌ Manual Type Definitions When Zod Exists

```typescript
// ❌ Bad: Manual type + separate validation
export type User = {
  id: string;
  name: string;
  email: string;
};

// Then need to validate manually
if (!user.email.includes("@")) throw new Error("Invalid email");

// ✅ Good: Infer from Zod schema
import {z} from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof UserSchema>;

// Validation is automatic
const user = UserSchema.parse(apiResponse);
```

## 8. ❌ Not Using TanStack Router Properly

```typescript
// ❌ Bad: Manual string concatenation for URLs
navigate(`/chat/${id}`);

// ❌ Bad: Not using Route hooks
const params = useParams(); // Generic, not type-safe

// ❌ Bad: Editing routeTree.gen.ts
// Never edit this file - it's auto-generated!

// ✅ Good: Type-safe navigation
import {useNavigate} from "@tanstack/react-router";

const navigate = useNavigate();
navigate({to: "/chat/$id", params: {id: "123"}});

// ✅ Good: Type-safe params
const {id} = Route.useParams(); // Fully typed

// ✅ Good: Type-safe search params
const search = Route.useSearch(); // Typed based on validateSearch
```

## 9. ❌ Prop Drilling

```typescript
// ❌ Bad: Passing props through multiple levels
<Parent userId={userId}>
  <Child userId={userId}>
    <GrandChild userId={userId} />
  </Child>
</Parent>

// ✅ Good: Use Zustand store or Context
// In store
const useAuthStore = create((set) => ({
  userId: null,
  setUserId: (id) => set({userId: id}),
}));

// Any component can access
const userId = useAuthStore((s) => s.userId);
```

## 10. ❌ Not Using Path Aliases

```typescript
// ❌ Bad: Relative imports across layers
import {Button} from "../../../shared/ui/Button";
import {useAuthStore} from "../../../../entities/User/model/store/authStore";

// ✅ Good: Path aliases
import {Button} from "@shared/ui";
import {useAuthStore} from "@entities/User";
```

## 11. ❌ Breaking FSD Layer Rules

```typescript
// ❌ Bad: Lower layer importing from higher layer
// In entities/User/api/services.ts
import {LoginForm} from "@features/auth/login-with-email"; // ❌ entities → features

// ❌ Bad: Entities importing from each other
// In entities/User/api/services.ts
import {getJob} from "@entities/Job"; // ❌ Cross-entity dependency

// ✅ Good: Higher → Lower imports
// In features/auth/login-with-email/ui/LoginForm.tsx
import {useAuthStore} from "@entities/User"; // ✅ features → entities

// ✅ Good: Shared layer can be imported by anyone
import {Button} from "@shared/ui"; // ✅ Any layer → shared
```

## 12. ❌ Not Using Controller for Form Inputs

```typescript
// ❌ Bad: Using register with custom components
import {useForm} from "react-hook-form";
import {Input} from "@shared/ui";

const {register} = useForm();
<Input {...register("email")} />; // Won't work properly!

// ✅ Good: Using Controller
import {Controller} from "react-hook-form";

<Controller
  name="email"
  control={control}
  render={({field}) => <Input {...field} label="Email" />}
/>
```

## 13. ❌ Not Validating API Responses

```typescript
// ❌ Bad: Trusting API response shape
export const getUser = async (id: string): Promise<User> => {
  const response = await axiosRequest.get(`/users/${id}`);
  return response; // ❌ No validation!
};

// ✅ Good: Validate with Zod
import {UserSchema} from "../schemas";

export const getUser = async (id: string): Promise<User> => {
  const response = await axiosRequest.get(`/users/${id}`);
  return UserSchema.parse(response); // ✅ Runtime validation
};
```

## 14. ❌ Hardcoding Values That Should Be in Config

```typescript
// ❌ Bad: Hardcoded storage keys
localStorage.getItem("accessToken");
localStorage.getItem("user");

// ✅ Good: Use config
import {ACCESS_TOKEN} from "@shared/config/appLocalStorage";
import {getLocalStorageItem} from "@shared/utils/appLocalStorage";

const token = getLocalStorageItem(ACCESS_TOKEN);
```

## 15. ❌ Using Default Exports

```typescript
// ❌ Bad: Default export
export default function Button() {
  return <button>Click</button>;
}

// ✅ Good: Named export
export const Button = () => {
  return <button>Click</button>;
};
```

## Summary Checklist

Before committing code, make sure you:

- [ ] Used @shared/ui or Radix UI components (not other libraries)
- [ ] Used design system colors (not random hardcoded colors)
- [ ] Separated business logic into custom hooks
- [ ] Memoized callbacks and expensive computations
- [ ] Used `useShallow` for multiple Zustand values
- [ ] Handled loading/error states properly
- [ ] Used stable keys in lists (not index)
- [ ] Inferred types from Zod schemas
- [ ] Used TanStack Router type-safe navigation
- [ ] Avoided prop drilling (used stores/context)
- [ ] Used path aliases (not relative imports)
- [ ] Followed FSD layer rules
- [ ] Used Controller for form inputs
- [ ] Validated API responses with Zod
- [ ] Used config constants (not hardcoded values)
- [ ] Used named exports (not default)
