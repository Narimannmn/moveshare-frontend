# Textarea Component - Design System

A comprehensive, accessible textarea component built from Figma design specifications following Feature-Sliced Design principles.

## 📋 Features

- ✅ **TypeScript** - Fully typed with strict mode
- ✅ **Module SCSS** - Scoped styles, no Tailwind conflicts
- ✅ **Accessible** - ARIA labels, keyboard navigation, screen reader support
- ✅ **Customizable** - Multiple variants and states
- ✅ **Resizable** - Vertical resizing enabled by default
- ✅ **Memoized** - Performance optimized with React.memo
- ✅ **Ref forwarding** - Direct DOM access when needed
- ✅ **React Hook Form** - Perfect integration with Controller

## 🎨 Design Tokens

Based on Figma design system:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#F1F4F9` | Textarea background (when `bg=true`) |
| Border Default | `#D8D8D8` | Normal state border |
| Border Error | `#FF0000` | Error state border |
| Border Focused | `#60A5FA` | Focused state border (project primary) |
| Text | `#202224` | Textarea text and labels |
| Text Muted | `#A6A6A6` | Helper text and placeholders |
| Min Height | `119px` | Minimum textarea height |
| Border Radius | `7.5px` | Rounded corners |

## 🚀 Usage

### Basic Textarea

```tsx
import { Textarea } from "@shared/ui/Textarea";

<Textarea
  label="Job Description"
  placeholder="Describe the job requirements..."
  helperText="Provide a detailed description"
  rows={6}
/>
```

### With Error State

```tsx
<Textarea
  label="Description"
  placeholder="Enter description"
  error="This field is required"
/>
```

### Without Background

```tsx
<Textarea
  label="Comments"
  placeholder="Your comments..."
  bg={false}
/>
```

### Disabled State

```tsx
<Textarea
  label="Read-only Field"
  placeholder="Cannot edit"
  disabled
  value="This content cannot be edited"
/>
```

### Custom Rows

```tsx
<Textarea
  label="Bio"
  placeholder="Tell us about yourself..."
  rows={8}
  maxLength={500}
/>
```

## 🪝 React Hook Form Integration

Perfect integration with React Hook Form using `Controller`:

```tsx
import { Textarea } from "@shared/ui/Textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const JobForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="Job Description"
            placeholder="Describe the job requirements..."
            error={fieldState.error?.message}
            helperText={!fieldState.error ? "Min 10 characters" : undefined}
            rows={6}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

## 🎛️ Props API

### TextareaProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text above textarea |
| `error` | `string` | - | Error message (sets error state) |
| `helperText` | `string` | - | Helper text below textarea |
| `bg` | `boolean` | `true` | Enable/disable background color |
| `state` | `"default" \| "error" \| "focused" \| "disabled"` | `"default"` | Visual state |
| `disabled` | `boolean` | `false` | Disable textarea |
| `rows` | `number` | - | Number of visible text rows |
| `maxLength` | `number` | - | Maximum character length |
| `containerClassName` | `string` | - | Additional CSS class for container |
| `className` | `string` | - | Additional CSS class for textarea |
| ...rest | `HTMLTextareaAttributes` | - | All native textarea props |

## 🎨 Variants

### State Variants

| State | Description | Use Case |
|-------|-------------|----------|
| `default` | Normal textarea | Standard user input |
| `error` | Red border, error text | Validation failures |
| `focused` | Blue border with shadow | Active textarea |
| `disabled` | Grayed out, not editable | Read-only fields |

### Background Variants

| Variant | Description |
|---------|-------------|
| `bg={true}` | Light gray background (#F1F4F9) |
| `bg={false}` | Transparent background |

## 🎭 Complete Examples

### Job Description Form

```tsx
import { Textarea } from "@shared/ui/Textarea";
import { useForm, Controller } from "react-hook-form";

export const JobForm = () => {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="Job Description"
            placeholder="Describe the job requirements, responsibilities, and qualifications..."
            error={fieldState.error?.message}
            rows={8}
          />
        )}
      />

      <Controller
        name="requirements"
        control={control}
        render={({ field, fieldState }) => (
          <Textarea
            {...field}
            label="Requirements"
            placeholder="List the required skills and experience..."
            error={fieldState.error?.message}
            rows={6}
          />
        )}
      />

      <button type="submit">Post Job</button>
    </form>
  );
};
```

### Comment/Feedback Form

```tsx
import { Textarea } from "@shared/ui/Textarea";
import { useState } from "react";

export const FeedbackForm = () => {
  const [feedback, setFeedback] = useState("");

  return (
    <Textarea
      label="Your Feedback"
      placeholder="Tell us what you think..."
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
      helperText={`${feedback.length}/500 characters`}
      maxLength={500}
      rows={6}
    />
  );
};
```

## 🔄 Migration from Old Textarea

### Before (Tailwind-based):

```tsx
import { Textarea } from "@/shared/ui/textarea";

<textarea
  className="w-full min-h-[120px] bg-gray-100"
  placeholder="Enter text"
/>
```

### After (New Design System):

```tsx
import { Textarea } from "@shared/ui/Textarea";

<Textarea
  label="Description"
  placeholder="Enter text"
  helperText="We'll save your input automatically"
  rows={5}
/>
```

### Key Differences:

| Feature | Old Component | New Component |
|---------|---------------|---------------|
| Styling | Tailwind inline | Module SCSS |
| Labels | Manual `<label>` | Built-in `label` prop |
| Errors | Manual handling | Built-in `error` prop |
| States | CSS classes | `state` prop |
| Background | Always transparent | `bg` prop toggle |
| Resizing | Manual CSS | Built-in vertical resize |

## 🎯 Design System Compliance

This component follows your CLAUDE.md standards:

- ✅ **FSD Architecture** - Located in `shared/ui/Textarea/`
- ✅ **Module SCSS** - Scoped styles, no className collisions
- ✅ **TypeScript Strict** - Full type safety
- ✅ **Memoization** - `memo`, `forwardRef` used
- ✅ **Named Exports** - No default exports
- ✅ **Accessibility** - ARIA attributes, keyboard support
- ✅ **Ref Forwarding** - `forwardRef` for DOM access

## 📦 File Structure

```
shared/ui/Textarea/
├── Textarea.tsx           # Main component (presentation)
├── Textarea.module.scss   # Module SCSS styles
├── TextareaDemo.tsx       # Demo/showcase component
├── README.md              # This file
└── index.ts               # Public API exports
```

## 🧪 Testing

To view all variants in action:

```tsx
import { TextareaDemo } from "@shared/ui/Textarea/TextareaDemo";

// In your route or page
<TextareaDemo />
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

### TypeScript errors?

Ensure `class-variance-authority` is installed:

```bash
npm install class-variance-authority
```

## 📝 Notes

- Component is **controlled** when `value` prop is provided
- Component is **uncontrolled** when `value` is omitted
- Resizing is enabled vertically by default (`resize: vertical`)
- Helper text is hidden when error is present
- Perfect for React Hook Form with `Controller` component
- Use `rows` prop to set initial height (default varies by browser)
- Use `maxLength` prop to limit character count

## 🔗 Related Components

- [Input Component](../Input/README.md) - Single-line text input
- [Typography Component](../Typography/Typography.tsx) - Text styling

---

**Built with ❤️ following the MoveShare Design System**
