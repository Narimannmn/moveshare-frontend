import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ErrorMessage, Input } from "@shared/ui";

import { useSetPassword } from "@entities/Auth";
import { useAuthStore } from "@entities/User/model/store/authStore";

const formSchema = z
  .object({
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

interface PasswordRegisterFormProps {
  onSuccess?: () => void;
}

export const PasswordRegisterForm: React.FC<PasswordRegisterFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tempToken = useAuthStore((state) => state.tempToken);
  const setPassword = useSetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormData) => {
    if (!tempToken) {
      console.error("No temp token available");
      return;
    }

    setPassword.mutate(
      {
        password: values.password,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="New password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            error={errors.password?.message}
            disabled={setPassword.isPending}
            postfix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-[#60A5FA]" />
                ) : (
                  <Eye className="size-5 text-[#60A5FA]" />
                )}
              </button>
            }
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="New password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter password"
            error={errors.confirmPassword?.message}
            disabled={setPassword.isPending}
            postfix={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5 text-[#60A5FA]" />
                ) : (
                  <Eye className="size-5 text-[#60A5FA]" />
                )}
              </button>
            }
          />
        )}
      />

      {setPassword.error && <ErrorMessage error={setPassword.error} />}

      <Button type="submit" disabled={!isValid || setPassword.isPending}>
        {setPassword.isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};
