# 📝 Forms with React Hook Form

## Controller Pattern (Required for @shared/ui Components)

```typescript
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Input, Button} from "@shared/ui";

// Define Zod schema
const UserFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

// Infer type from schema
type UserFormData = z.infer<typeof UserFormSchema>;

export const UserForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<UserFormData>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    console.log(data);
    // API call here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ✅ Good: Wrap @shared/ui inputs with Controller */}
      <Controller
        name="name"
        control={control}
        render={({field}) => (
          <Input
            {...field}
            label="Name"
            error={errors.name?.message}
            placeholder="Enter your name"
          />
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({field}) => (
          <Input
            {...field}
            label="Email"
            type="email"
            error={errors.email?.message}
            placeholder="Enter your email"
          />
        )}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </form>
  );
};
```

## Multi-Step Form Pattern

Example from the registration flow:

```typescript
import {useState} from "react";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

// Step 1 Schema
const EmailStepSchema = z.object({
  email: z.string().email(),
});

// Step 2 Schema
const PasswordStepSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

export const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  // Use different schemas per step
  const schema = step === 1 ? EmailStepSchema : PasswordStepSchema;

  const {control, handleSubmit, formState: {errors}} = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    setFormData((prev) => ({...prev, ...data}));
    setStep(step + 1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {step === 1 && (
        <Controller
          name="email"
          control={control}
          render={({field}) => (
            <Input {...field} label="Email" error={errors.email?.message} />
          )}
        />
      )}

      {step === 2 && (
        <>
          <Controller
            name="password"
            control={control}
            render={({field}) => (
              <Input {...field} type="password" label="Password" />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({field}) => (
              <Input {...field} type="password" label="Confirm Password" />
            )}
          />
        </>
      )}

      <Button type="submit">Next</Button>
    </form>
  );
};
```

## Form Principles

- ✅ Use `Controller` (not `register`) for `@shared/ui` components
- ✅ Always use `zodResolver` for validation
- ✅ Type form data with `type FormData = z.infer<typeof Schema>`
- ✅ Destructure `field` and spread into component: `{...field}`
- ✅ Pass errors from `formState.errors`
- ✅ Use `isSubmitting` for loading states
- ✅ Handle async submission properly
- ✅ Use `defaultValues` to avoid uncontrolled component warnings

## Checkbox and Radio Examples

```typescript
// Checkbox
<Controller
  name="terms"
  control={control}
  render={({field: {value, onChange, ...field}}) => (
    <Checkbox
      {...field}
      checked={value}
      onCheckedChange={onChange}
      label="Accept terms and conditions"
    />
  )}
/>

// Radio Group
<Controller
  name="option"
  control={control}
  render={({field}) => (
    <RadioButton
      {...field}
      options={[
        {label: "Option 1", value: "1"},
        {label: "Option 2", value: "2"},
      ]}
    />
  )}
/>
```

## Integration with Mutations

```typescript
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useUpdateUser} from "@entities/User";

export const UserForm = ({userId}) => {
  const updateUser = useUpdateUser();

  const {control, handleSubmit} = useForm({
    resolver: zodResolver(UserFormSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    await updateUser.mutateAsync({id: userId, data});
    // Success notification
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit" isLoading={updateUser.isPending}>
        Save Changes
      </Button>
    </form>
  );
};
```
