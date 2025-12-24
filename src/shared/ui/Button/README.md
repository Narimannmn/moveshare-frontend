# Button Component - Design System

A comprehensive, accessible button component built from Figma design specifications following Feature-Sliced Design principles.

## 📋 Features

- ✅ **TypeScript** - Fully typed with strict mode
- ✅ **Module SCSS** - Scoped styles, no Tailwind conflicts
- ✅ **Accessible** - ARIA attributes, keyboard support, focus states
- ✅ **5 Variants** - Primary, Danger, Secondary, Ghost, Outline
- ✅ **3 Sizes** - Small, Default, Large
- ✅ **Loading State** - Built-in loading indicator
- ✅ **Icon Support** - Prefix and postfix icons
- ✅ **Memoized** - Performance optimized with React.memo
- ✅ **Ref forwarding** - Direct DOM access when needed

## 🎨 Design Tokens

Based on Figma design system:

| Token | Value | Usage |
|-------|-------|-------|
| Primary Background | `#60A5FA` | Primary button background |
| Primary Hover | `#3B82F6` | Primary button hover state |
| Danger Background | `#FF0000` | Danger/destructive actions |
| Secondary Background | `#F5F5F5` | Secondary actions |
| Ghost Background | `#ECEFF1` | Tertiary actions |
| Outline Border | `#A6A6A6` | Outline button border |
| Height | `44px` | Default button height |
| Border Radius | `8px` | Rounded corners |
| Disabled Opacity | `0.6` | Disabled state transparency |

## 🚀 Usage

### Basic Button

```tsx
import { Button } from "@shared/ui/Button";

<Button>Click Me</Button>
```

### Button Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="danger">Delete</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Maybe</Button>
<Button variant="outline">Learn More</Button>
```

### Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### With Icons

```tsx
import { Mail, Trash, Plus } from "lucide-react";

<Button prefix={<Mail />}>Send Email</Button>
<Button variant="danger" prefix={<Trash />}>Delete</Button>
<Button postfix={<ArrowRight />}>Next</Button>
```

### Loading State

```tsx
<Button loading>Loading...</Button>
<Button loading variant="danger">Deleting...</Button>
```

### Disabled State

```tsx
<Button disabled>Disabled</Button>
```

### Full Width

```tsx
<Button fullWidth>Full Width Button</Button>
```

## 🎛️ Props API

### ButtonProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "danger" \| "secondary" \| "ghost" \| "outline"` | `"primary"` | Button visual style |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Button size |
| `fullWidth` | `boolean` | `false` | Make button full width |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `prefix` | `ReactNode` | - | Icon or element before text |
| `postfix` | `ReactNode` | - | Icon or element after text |
| `className` | `string` | - | Additional CSS class |
| ...rest | `HTMLButtonAttributes` | - | All native button props |

## 🎨 Variants

### Variant Descriptions

| Variant | Use Case | Background | Text Color |
|---------|----------|------------|------------|
| `primary` | Main actions, CTAs | `#60A5FA` (blue) | White |
| `danger` | Destructive actions | `#FF0000` (red) | White |
| `secondary` | Secondary actions | `#F5F5F5` (light gray) | `#A6A6A6` |
| `ghost` | Tertiary actions | `#ECEFF1` (very light gray) | `#202224` |
| `outline` | Alternative actions | Transparent | `#202224` |

### Size Specifications

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | `36px` | `16px` | `13px` |
| `default` | `44px` | `24px` | `14px` |
| `lg` | `52px` | `32px` | `16px` |

## 🎭 Complete Examples

### Form Actions

```tsx
import { Button } from "@shared/ui/Button";

export const FormActions = () => {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button type="submit">Submit</Button>
      <Button type="button" variant="outline">
        Cancel
      </Button>
    </div>
  );
};
```

### Confirmation Dialog

```tsx
import { Button } from "@shared/ui/Button";
import { Trash } from "lucide-react";

export const DeleteConfirmation = () => {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button variant="danger" prefix={<Trash />}>
        Delete Account
      </Button>
      <Button variant="ghost">Keep Account</Button>
    </div>
  );
};
```

### Loading Example

```tsx
import { Button } from "@shared/ui/Button";
import { useState } from "react";

export const SubmitButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button loading={loading} onClick={handleSubmit}>
      Submit
    </Button>
  );
};
```

### Navigation Buttons

```tsx
import { Button } from "@shared/ui/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Pagination = () => {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button variant="outline" size="sm" prefix={<ArrowLeft />}>
        Previous
      </Button>
      <Button variant="outline" size="sm" postfix={<ArrowRight />}>
        Next
      </Button>
    </div>
  );
};
```

### Call to Action

```tsx
import { Button } from "@shared/ui/Button";

export const CTA = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
      <Button size="lg" fullWidth>
        Get Started
      </Button>
      <Button size="lg" fullWidth variant="outline">
        Learn More
      </Button>
    </div>
  );
};
```

## 🔄 Migration from Old Button

### Before (Tailwind-based):

```tsx
import { Button } from "@/shared/ui/button";

<button className="bg-blue-500 text-white px-6 py-2 rounded-lg">
  Click Me
</button>
```

### After (New Design System):

```tsx
import { Button } from "@shared/ui/Button";

<Button variant="primary">Click Me</Button>
```

### Key Differences:

| Feature | Old Component | New Component |
|---------|---------------|---------------|
| Styling | Tailwind inline | Module SCSS |
| Variants | Manual classes | `variant` prop |
| Sizes | Manual height/padding | `size` prop |
| Icons | Manual wrapper | `prefix` + `postfix` props |
| Loading | Manual spinner | `loading` prop |
| Disabled | CSS only | `disabled` prop |

## 🎯 Design System Compliance

This component follows your CLAUDE.md standards:

- ✅ **FSD Architecture** - Located in `shared/ui/Button/`
- ✅ **Module SCSS** - Scoped styles, no className collisions
- ✅ **TypeScript Strict** - Full type safety
- ✅ **Memoization** - `memo`, `forwardRef` used
- ✅ **Named Exports** - No default exports
- ✅ **Accessibility** - Focus states, ARIA support
- ✅ **Ref Forwarding** - `forwardRef` for DOM access

## 📦 File Structure

```
shared/ui/Button/
├── Button.tsx           # Main component (presentation)
├── Button.module.scss   # Module SCSS styles
├── ButtonDemo.tsx       # Demo/showcase component
├── README.md            # This file
└── index.ts             # Public API exports
```

## 🧪 Testing

To view all variants in action:

```tsx
import { ButtonDemo } from "@shared/ui/Button/ButtonDemo";

// In your route or page
<ButtonDemo />
```

## 🐛 Troubleshooting

### Styles not applying?

Make sure SCSS modules are configured in your Vite config:

```ts
// vite.config.ts
css: {
  modules: {
    localsConvention: 'camelCase',
  },
}
```

### Icons not showing?

Install lucide-react:

```bash
npm install lucide-react
```

### TypeScript errors?

Ensure `class-variance-authority` is installed:

```bash
npm install class-variance-authority
```

## 📝 Notes

- Use `variant="primary"` for main CTAs
- Use `variant="danger"` for destructive actions (delete, remove)
- Use `variant="outline"` for secondary/alternative actions
- Use `variant="ghost"` for tertiary/low-priority actions
- Use `variant="secondary"` for cancel/dismiss actions
- Loading state automatically disables the button
- Prefix/postfix icons hide during loading state
- Use `fullWidth` for mobile-responsive layouts
- Button maintains consistent height regardless of content

## 🎨 Customization

You can extend the button with custom className:

```tsx
<Button className="my-custom-class">Custom Button</Button>
```

Or create variants:

```tsx
<Button style={{ backgroundColor: "#custom" }}>Custom Color</Button>
```

## 🔗 Related Components

- [Input Component](../Input/README.md) - Form input field
- [Textarea Component](../Textarea/README.md) - Multi-line text input

---

**Built with ❤️ following the MoveShare Design System**
