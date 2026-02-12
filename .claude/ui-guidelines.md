# 🎨 UI Guidelines

## Component Library Architecture

### Shared UI Library (`@shared/ui`)

**Philosophy**: Build a custom component library using Radix UI primitives + Tailwind CSS for the Moveshare design system.

```typescript
// ✅ Good: Use shared UI components
import {Button, Input, Checkbox} from "@shared/ui";

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
import * as Select from "@radix-ui/react-select";

// ❌ Bad: Using other UI libraries
import {Button} from "@mui/material";
import {Input} from "antd";
```

### Component Creation Priority

1. **Use existing `@shared/ui` components** (Button, Input, Checkbox, etc.)
2. **Compose Radix UI primitives** for complex unstyled components (Dialog, Dropdown, Select)
3. **Create custom components** when needed using Tailwind CSS
4. **Never import from other UI libraries** (MUI, Ant Design, Chakra, etc.)

## Design System

### Color Palette

```typescript
// Defined in Tailwind config
Primary Blue: #60A5FA (blue-400)
Text Dark: #202224
Text Gray: #666C72
Background: #F5F6FA
Border: #D8D8D8
White: #FFFFFF
```

### Tailwind Usage

```typescript
// ✅ Good: Use Tailwind utility classes
<div className="flex gap-4 p-6 bg-background rounded-[10px] border border-[#D8D8D8]">
  <Button className="bg-primary hover:bg-primary/90" />
</div>

// ✅ Good: Use arbitrary values for design system colors
<div className="bg-[#60A5FA] text-[#202224]" />

// ✅ Good: Combine with cn helper
import {cn} from "@shared/lib/utils";

<button className={cn(
  "px-4 py-2 rounded-md",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50"
)} />
```

### Typography System

Use the typography utility from `@shared/config/typography`:

```typescript
import {getTypographyClass} from "@shared/config/typography";

// Available variants
<h1 className={getTypographyClass("h1")}>Heading 1</h1>
<p className={getTypographyClass("body1")}>Body text</p>
<span className={getTypographyClass("caption")}>Caption text</span>

// Typography variants
- "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
- "body1" | "body2" | "body3"
- "caption" | "overline"
```

### Shared UI Components

#### Button Component

```typescript
import {Button} from "@shared/ui";

// Variants: primary, danger, secondary, ghost, outline
<Button variant="primary" size="lg">
  Click me
</Button>

// With icons
<Button variant="primary" prefix={<Icon />}>
  Submit
</Button>

// Loading state
<Button variant="primary" isLoading>
  Loading...
</Button>
```

#### Input Component

```typescript
import {Input} from "@shared/ui";

<Input
  label="Email"
  placeholder="Enter email"
  error="Invalid email"
  prefixIcon={<MailIcon />}
/>
```

#### Typography Component

```typescript
import {Typography} from "@shared/ui";

<Typography variant="h1" weight="bold" className="text-primary">
  Welcome to Moveshare
</Typography>
```

## Radix UI Integration

### When to Use Radix UI

Use Radix UI for **unstyled, accessible component primitives**:

- Dialog/Modal
- Dropdown Menu
- Select
- Checkbox (already wrapped in `@shared/ui`)
- Radio Group
- Toast/Alert
- Separator

```typescript
// ✅ Good: Compose Radix UI with Tailwind
import * as Dialog from "@radix-ui/react-dialog";

export const Modal = ({children, trigger}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
```

### Radix UI Styling Pattern

1. Use Radix UI for behavior and accessibility
2. Style with Tailwind CSS utility classes
3. Use `className` prop for custom styling
4. Use `asChild` prop for composition

## Component Variants with CVA

Use **class-variance-authority** for variant-based styling:

```typescript
import {cva} from "class-variance-authority";
import {cn} from "@shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-[#60A5FA] text-white hover:bg-[#60A5FA]/90",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-11 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = ({variant, size, className, ...props}) => {
  return (
    <button
      className={cn(buttonVariants({variant, size}), className)}
      {...props}
    />
  );
};
```

## Icons

### Icon Libraries

```typescript
// ✅ Primary: Lucide React
import {Mail, Settings, User} from "lucide-react";

<Mail className="w-5 h-5 text-gray-600" />

// ✅ Secondary: React Icons (if needed)
import {FaGoogle, FaApple} from "react-icons/fa";
```

### Icon Component Pattern

```typescript
// Create icon wrappers in @shared/ui/Icons
export const GoogleIcon = () => {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20">
      {/* SVG path */}
    </svg>
  );
};
```

## SCSS Modules (When Needed)

Use SCSS modules for complex styling that Tailwind can't handle:

```typescript
// Component.tsx
import styles from "./Component.module.scss";

<div className={styles.container}>
  <div className={styles.card} />
</div>
```

```scss
// Component.module.scss
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 10px;

  // Complex animations or pseudo-elements that are hard in Tailwind
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover::before {
    opacity: 0.1;
  }
}
```

### When to Use SCSS vs Tailwind

**Use Tailwind for**:
- Standard layouts (flex, grid)
- Spacing, colors, typography
- Common hover/focus states
- Responsive design

**Use SCSS for**:
- Complex pseudo-elements (::before, ::after)
- Complex animations/keyframes
- Nested selectors with specific business logic
- Grid layouts with complex calculations

## Styling Patterns

### Conditional Styling

```typescript
import {cn} from "@shared/lib/utils";

<div className={cn(
  "p-4 rounded-md",
  isActive && "bg-blue-500 text-white",
  isDisabled && "opacity-50 cursor-not-allowed",
  size === "large" && "p-6 text-lg"
)} />
```

### Responsive Design

```typescript
// Tailwind breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
  <Card />
</div>
```

### Dark Mode (Future)

```typescript
// When implementing dark mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

## Form Components Integration

### With React Hook Form

```typescript
import {Controller} from "react-hook-form";
import {Input, Checkbox} from "@shared/ui";

<Controller
  name="email"
  control={control}
  render={({field}) => (
    <Input
      {...field}
      label="Email"
      error={errors.email?.message}
    />
  )}
/>
```

## Component Checklist

Before creating a new UI component:

1. [ ] Check if `@shared/ui` has this component
2. [ ] Check if Radix UI has a primitive for this
3. [ ] Use Tailwind CSS for styling first
4. [ ] Use CVA for variants if needed
5. [ ] Use SCSS module only for complex styling
6. [ ] Follow accessibility best practices (ARIA labels, keyboard nav)
7. [ ] Add proper TypeScript types
8. [ ] Export from `@shared/ui/index.ts`

## Design System Reference

```typescript
// Border Radius
rounded-[10px]  // Base border radius for Moveshare

// Shadows (when needed)
shadow-sm       // Subtle shadow
shadow-md       // Medium shadow
shadow-lg       // Large shadow

// Spacing Scale (Tailwind default)
p-4, m-4        // 1rem (16px)
gap-4           // 1rem
space-y-4       // Vertical spacing

// Font Family
font-sans       // Onest (configured in global CSS)
```

## Anti-Patterns

### ❌ Don't Do

```typescript
// ❌ Importing from other UI libraries
import {Button} from "@mui/material";

// ❌ Creating custom button when @shared/ui has one
export const MyButton = () => <button>Click</button>;

// ❌ Inline styles
<div style={{backgroundColor: "#60A5FA", padding: "16px"}} />

// ❌ Hardcoded colors
<div className="bg-[#123456]" /> // Use design system colors only

// ❌ Overriding Radix UI internals
.radix-dialog-content {
  background: red !important; // Never use !important
}
```

### ✅ Do This Instead

```typescript
// ✅ Use shared components
import {Button} from "@shared/ui";

// ✅ Use Tailwind classes
<div className="bg-[#60A5FA] p-4" />

// ✅ Extend with cn helper
import {cn} from "@shared/lib/utils";
<Button className={cn("w-full", isLoading && "opacity-50")} />
```
