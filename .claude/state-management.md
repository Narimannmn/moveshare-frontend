# 🏪 State Management

## Zustand Store Pattern

This project uses **Zustand** for client-side state with **localStorage persistence**.

### Basic Store Pattern

```typescript
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

interface EntityState {
  currentEntityId: string | null;
  selectedItems: string[];
  searchQuery: string;
}

interface EntityActions {
  setCurrentEntity: (id: string) => void;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

type EntityStore = EntityState & {actions: EntityActions};

const initialState: EntityState = {
  currentEntityId: null,
  selectedItems: [],
  searchQuery: "",
};

export const useEntityStore = create<EntityStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        // Actions namespace
        actions: {
          setCurrentEntity: (id) => set({currentEntityId: id}),

          addItem: (id) =>
            set((state) => ({
              selectedItems: [...state.selectedItems, id],
            })),

          removeItem: (id) =>
            set((state) => ({
              selectedItems: state.selectedItems.filter((item) => item !== id),
            })),

          setSearchQuery: (query) => set({searchQuery: query}),

          reset: () => set(initialState),
        },
      }),
      {
        name: "entity-storage", // localStorage key
        partialize: (state) => ({
          // Only persist these fields
          currentEntityId: state.currentEntityId,
          selectedItems: state.selectedItems,
          // Don't persist searchQuery (ephemeral)
        }),
      }
    ),
    {name: "EntityStore"} // DevTools name
  )
);
```

## Usage Patterns

### Basic Usage

```typescript
// Access entire store (re-renders on any state change)
const Component = () => {
  const {currentEntityId, actions} = useEntityStore();

  const handleUpdate = () => {
    actions.setCurrentEntity("123");
  };

  return <div>Current: {currentEntityId}</div>;
};
```

### Selective Subscriptions (Better Performance)

```typescript
// ✅ Good: Only re-renders when currentEntityId changes
const Component = () => {
  const currentEntityId = useEntityStore((state) => state.currentEntityId);
  const setCurrentEntity = useEntityStore((state) => state.actions.setCurrentEntity);

  return <div>Current: {currentEntityId}</div>;
};
```

### Using Multiple Values with useShallow

```typescript
import {useShallow} from "zustand/react/shallow";
import {useEntityStore} from "@entities/Entity";

// ✅ Good: useShallow prevents re-renders when other state changes
const Component = () => {
  const {currentEntityId, selectedItems} = useEntityStore(
    useShallow((state) => ({
      currentEntityId: state.currentEntityId,
      selectedItems: state.selectedItems,
    }))
  );

  return (
    <div>
      <div>Current: {currentEntityId}</div>
      <div>Selected: {selectedItems.length}</div>
    </div>
  );
};

// ❌ Bad: Re-renders on every store change
const ComponentBad = () => {
  const state = useEntityStore();
  return <div>{state.currentEntityId}</div>;
};
```

## Custom Hooks Pattern

Create custom hooks for complex logic:

```typescript
// entities/Chat/hooks/useSelectedConversation.ts
import {useShallow} from "zustand/react/shallow";
import {useChatStore} from "../store/chatStore";
import {useConversations} from "../api";
import {useMemo} from "react";

export const useSelectedConversation = () => {
  const {selectedConversationId} = useChatStore(
    useShallow((state) => ({
      selectedConversationId: state.selectedConversationId,
    }))
  );

  const {data: conversations} = useConversations();

  const selectedConversation = useMemo(() => {
    if (!selectedConversationId || !conversations) return null;
    return conversations.find((c) => c.id === selectedConversationId) || null;
  }, [selectedConversationId, conversations]);

  return selectedConversation;
};
```

## Real Examples from the Project

### Auth Store (`entities/User/model/store/authStore.ts`)

```typescript
import {create} from "zustand";
import {persist} from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

interface AuthActions {
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & {actions: AuthActions};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      actions: {
        setUser: (user, token) => set({user, accessToken: token}),
        logout: () => set({user: null, accessToken: null}),
      },
    }),
    {
      name: "auth-storage", // localStorage key
    }
  )
);
```

### Chat Store (`entities/Chat/store/chatStore.ts`)

```typescript
import {create} from "zustand";
import {devtools, persist} from "zustand/middleware";

interface ChatState {
  selectedConversationId: string | null;
  searchQuery: string;
}

interface ChatActions {
  selectConversation: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

type ChatStore = ChatState & {actions: ChatActions};

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set) => ({
        selectedConversationId: null,
        searchQuery: "",

        actions: {
          selectConversation: (id) => set({selectedConversationId: id}),
          setSearchQuery: (query) => set({searchQuery: query}),
          reset: () => set({selectedConversationId: null, searchQuery: ""}),
        },
      }),
      {
        name: "chat-storage",
        partialize: (state) => ({
          selectedConversationId: state.selectedConversationId,
          // Don't persist searchQuery
        }),
      }
    ),
    {name: "ChatStore"}
  )
);
```

## LocalStorage Utilities

Use the provided localStorage helpers:

```typescript
import {getLocalStorageItem, setLocalStorageItem} from "@shared/utils/appLocalStorage";
import {ACCESS_TOKEN} from "@shared/config/appLocalStorage";

// Get token
const token = getLocalStorageItem(ACCESS_TOKEN);

// Set token
setLocalStorageItem(ACCESS_TOKEN, "eyJhbGciOi...");
```

## Best Practices

- ✅ **Actions in namespace**: Group actions under `actions` object
- ✅ **localStorage for persistence**: Use `persist` middleware with localStorage
- ✅ **Partialize**: Only persist necessary state (not computed/derived values)
- ✅ **DevTools in development**: Use `devtools` middleware for debugging
- ✅ **Selective subscriptions**: Use selectors to prevent unnecessary re-renders
- ✅ **useShallow for multiple values**: Prevents re-renders when other state changes
- ✅ **Custom hooks for complex logic**: Extract reusable logic into hooks
- ✅ **Initialize with defaults**: Define `initialState` for easy reset
- ✅ **Type-safe**: Use TypeScript interfaces for state and actions

## Anti-Patterns

### ❌ Don't Do

```typescript
// ❌ Bad: Subscribing to entire store
const state = useEntityStore();

// ❌ Bad: Multiple values without useShallow
const {id, name, email} = useEntityStore((s) => ({
  id: s.id,
  name: s.name,
  email: s.email,
}));

// ❌ Bad: Actions not in namespace
export const useStore = create((set) => ({
  count: 0,
  increment: () => set((s) => ({count: s.count + 1})), // actions mixed with state
}));

// ❌ Bad: Persisting derived state
persist(
  (set, get) => ({
    items: [],
    itemCount: () => get().items.length, // Don't persist computed values
  }),
  {name: "store"}
);
```

### ✅ Do This Instead

```typescript
// ✅ Good: Selective subscription
const currentId = useEntityStore((s) => s.currentEntityId);

// ✅ Good: useShallow for multiple values
const {id, name, email} = useEntityStore(
  useShallow((s) => ({id: s.id, name: s.name, email: s.email}))
);

// ✅ Good: Actions in namespace
export const useStore = create((set) => ({
  count: 0,
  actions: {
    increment: () => set((s) => ({count: s.count + 1})),
  },
}));

// ✅ Good: Compute derived values in components/hooks
const items = useStore((s) => s.items);
const itemCount = items.length; // Compute in component
```

## State Management Decision Tree

1. **Server data (API)** → Use **TanStack Query**
2. **Global client state** → Use **Zustand** (with persist)
3. **Local component state** → Use **useState**
4. **Form state** → Use **React Hook Form**
5. **URL state** → Use **TanStack Router** search params
