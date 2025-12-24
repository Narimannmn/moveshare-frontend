# OTP Input Component - Design System

A comprehensive, accessible OTP (One-Time Password) input component built from Figma design specifications using the `input-otp` library and following Feature-Sliced Design principles.

## 📋 Features

- ✅ **TypeScript** - Fully typed with strict mode
- ✅ **Module SCSS** - Scoped styles, no Tailwind conflicts
- ✅ **Accessible** - Keyboard navigation, screen reader support
- ✅ **Built on input-otp** - Robust OTP input library
- ✅ **4 or 6 digits** - Configurable length
- ✅ **3 States** - Default, Error, Success
- ✅ **2 Sizes** - Default (48×56px), Small (40×40px)
- ✅ **Auto-complete** - Callback when all digits entered
- ✅ **Memoized** - Performance optimized with React.memo
- ✅ **React Hook Form** - Perfect integration with Controller

## 🎨 Design Tokens

Based on Figma design system:

| Token | Value | Usage |
|-------|-------|-------|
| Slot Width (Default) | `48px` | Large variant width |
| Slot Height (Default) | `56px` | Large variant height |
| Slot Width (Small) | `40px` | Small variant width |
| Slot Height (Small) | `40px` | Small variant height |
| Border Radius | `7.5px` | Rounded corners |
| Border Default | `#E2E2E2` | Normal state border |
| Border Error | `#E03C31` | Error state border (red) |
| Border Success | `#00C389` | Success state border (green) |
| Border Active | `#60A5FA` | Focus/active state border |
| Text Color | `#0C2340` | Digit text color |

## 🚀 Usage

### Basic OTP Input (6 digits)

```tsx
import { OTPInput } from "@shared/ui/OTPInput";
import { useState } from "react";

export const VerificationForm = () => {
  const [otp, setOtp] = useState("");

  const handleComplete = (value: string) => {
    console.log("OTP Complete:", value);
    // Verify the OTP
  };

  return (
    <OTPInput
      label="Enter verification code"
      value={otp}
      onChange={setOtp}
      onComplete={handleComplete}
      length={6}
      helperText="We sent a code to your phone"
    />
  );
};
```

### 4-Digit PIN

```tsx
<OTPInput
  label="Enter PIN"
  value={pin}
  onChange={setPin}
  length={4}
  helperText="Enter your 4-digit PIN"
/>
```

### With Error State

```tsx
<OTPInput
  value={otp}
  onChange={setOtp}
  length={6}
  state="error"
  error="Invalid code. Please try again."
/>
```

### With Success State

```tsx
<OTPInput
  value={otp}
  onChange={setOtp}
  length={6}
  state="success"
  helperText="Code verified successfully!"
/>
```

### Small Size (Mobile)

```tsx
<OTPInput
  value={otp}
  onChange={setOtp}
  length={6}
  size="sm"
  helperText="Compact size for mobile"
/>
```

## 🪝 React Hook Form Integration

Perfect integration with React Hook Form using `Controller`:

```tsx
import { OTPInput } from "@shared/ui/OTPInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  otp: z.string().length(6, "Code must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

export const VerificationForm = () => {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Verify OTP
    await verifyOTP(data.otp);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="otp"
        control={control}
        render={({ field, fieldState }) => (
          <OTPInput
            {...field}
            label="Verification Code"
            length={6}
            error={fieldState.error?.message}
            onComplete={(value) => {
              // Auto-submit on complete
              handleSubmit(onSubmit)();
            }}
          />
        )}
      />
      <button type="submit">Verify</button>
    </form>
  );
};
```

## 🎛️ Props API

### OTPInputProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value |
| `onChange` | `(value: string) => void` | - | Value change handler |
| `onComplete` | `(value: string) => void` | - | Called when all digits entered |
| `length` | `4 \| 6` | `6` | Number of digits |
| `state` | `"default" \| "error" \| "success"` | `"default"` | Visual state |
| `size` | `"default" \| "sm"` | `"default"` | Size variant |
| `disabled` | `boolean` | `false` | Disable input |
| `error` | `string` | - | Error message (sets error state) |
| `helperText` | `string` | - | Helper text below input |
| `label` | `string` | - | Label text above input |
| `containerClassName` | `string` | - | Additional CSS class for container |

## 🎨 Variants

### Length Variants

| Length | Use Case | Display |
|--------|----------|---------|
| `4` | PIN codes, short verification | 2 + 2 digits with separator |
| `6` | SMS codes, email verification | 3 + 3 digits with separator |

### State Variants

| State | Border Color | Use Case |
|-------|--------------|----------|
| `default` | `#E2E2E2` (gray) | Normal input |
| `error` | `#E03C31` (red) | Invalid code |
| `success` | `#00C389` (green) | Valid code |

### Size Variants

| Size | Dimensions | Use Case |
|------|------------|----------|
| `default` | 48×56px | Desktop, large screens |
| `sm` | 40×40px | Mobile, compact layouts |

## 🎭 Complete Examples

### Phone Verification

```tsx
import { OTPInput } from "@shared/ui/OTPInput";
import { useState } from "react";

export const PhoneVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleComplete = async (value: string) => {
    setIsVerifying(true);
    setError("");

    try {
      await verifyPhoneOTP(value);
      // Success - navigate to next step
    } catch (err) {
      setError("Invalid code. Please try again.");
      setOtp(""); // Clear input
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <h2>Verify Your Phone</h2>
      <p>We sent a 6-digit code to +1 (555) 123-4567</p>

      <OTPInput
        label="Verification Code"
        value={otp}
        onChange={setOtp}
        onComplete={handleComplete}
        length={6}
        state={error ? "error" : "default"}
        error={error}
        disabled={isVerifying}
        helperText={!error ? "Didn't receive code? Resend in 30s" : undefined}
      />
    </div>
  );
};
```

### Two-Factor Authentication

```tsx
import { OTPInput } from "@shared/ui/OTPInput";
import { useState } from "react";

export const TwoFactorAuth = () => {
  const [otp, setOtp] = useState("");

  const handle2FAComplete = async (value: string) => {
    try {
      await verify2FA(value);
      // Login successful
    } catch (err) {
      alert("Invalid code");
      setOtp("");
    }
  };

  return (
    <OTPInput
      label="Authentication Code"
      value={otp}
      onChange={setOtp}
      onComplete={handle2FAComplete}
      length={6}
      helperText="Enter the code from your authenticator app"
    />
  );
};
```

### PIN Entry

```tsx
import { OTPInput } from "@shared/ui/OTPInput";
import { useState } from "react";

export const PINEntry = () => {
  const [pin, setPin] = useState("");

  const handlePINComplete = async (value: string) => {
    const isValid = await validatePIN(value);
    if (isValid) {
      // PIN accepted
    } else {
      setPin(""); // Clear for retry
    }
  };

  return (
    <OTPInput
      label="Security PIN"
      value={pin}
      onChange={setPin}
      onComplete={handlePINComplete}
      length={4}
      size="sm"
      helperText="Enter your 4-digit security PIN"
    />
  );
};
```

## 🔄 Migration from Old OTP Input

### Before (Manual Implementation):

```tsx
<div className="flex gap-2">
  <input type="text" maxLength={1} className="w-12 h-12" />
  <input type="text" maxLength={1} className="w-12 h-12" />
  <input type="text" maxLength={1} className="w-12 h-12" />
  <input type="text" maxLength={1} className="w-12 h-12" />
  <input type="text" maxLength={1} className="w-12 h-12" />
  <input type="text" maxLength={1} className="w-12 h-12" />
</div>
```

### After (New Design System):

```tsx
import { OTPInput } from "@shared/ui/OTPInput";

<OTPInput
  value={otp}
  onChange={setOtp}
  onComplete={handleComplete}
  length={6}
/>
```

## 🎯 Design System Compliance

This component follows your CLAUDE.md standards:

- ✅ **FSD Architecture** - Located in `shared/ui/OTPInput/`
- ✅ **Module SCSS** - Scoped styles, no className collisions
- ✅ **TypeScript Strict** - Full type safety
- ✅ **Memoization** - `memo`, `forwardRef` used
- ✅ **Named Exports** - No default exports
- ✅ **Accessibility** - Keyboard navigation, ARIA support
- ✅ **Third-party Integration** - Uses `input-otp` library

## 📦 File Structure

```
shared/ui/OTPInput/
├── OTPInput.tsx           # Main component (presentation)
├── OTPInput.module.scss   # Module SCSS styles
├── OTPInputDemo.tsx       # Demo/showcase component
├── README.md              # This file
└── index.ts               # Public API exports
```

## 🧪 Testing

To view all variants in action:

```tsx
import { OTPInputDemo } from "@shared/ui/OTPInput/OTPInputDemo";

// In your route or page
<OTPInputDemo />
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

### Library not found?

Install `input-otp`:

```bash
npm install input-otp
```

### TypeScript errors?

Ensure `class-variance-authority` is installed:

```bash
npm install class-variance-authority
```

## 📝 Notes

- Component is **always controlled** - must provide `value` and `onChange`
- Use `onComplete` callback for auto-submit functionality
- Only numeric input is allowed (0-9)
- Backspace/Delete work as expected
- Arrow keys navigate between slots
- Paste support - automatically distributes digits across slots
- Auto-focus on first empty slot
- Mobile keyboard shows numeric pad automatically

## ⌨️ Keyboard Shortcuts

- **0-9**: Enter digit
- **Backspace**: Delete previous digit and move back
- **Delete**: Delete current digit
- **Arrow Left/Right**: Navigate between slots
- **Ctrl/Cmd + V**: Paste code (auto-fills all slots)
- **Tab**: Focus next slot (or next form element if complete)

## 🎨 Customization

You can extend the component with custom className:

```tsx
<OTPInput
  containerClassName="my-custom-class"
  value={otp}
  onChange={setOtp}
  length={6}
/>
```

Or override specific states with CSS:

```tsx
<OTPInput
  value={otp}
  onChange={setOtp}
  length={6}
  state="success"
  helperText="✅ Code verified!"
/>
```

## 🔗 Related Components

- [Input Component](../Input/README.md) - Single-line text input
- [Button Component](../Button/README.md) - Submit buttons

## 📚 External Dependencies

- **input-otp** - Core OTP input functionality ([GitHub](https://github.com/guilhermerodz/input-otp))
  - Handles keyboard navigation
  - Paste support
  - Auto-focus management
  - Mobile keyboard optimization

---

**Built with ❤️ following the MoveShare Design System**
