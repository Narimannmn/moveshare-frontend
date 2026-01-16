import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ErrorMessage, Input } from "@shared/ui";

import { useLogin } from "@entities/Auth";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface EmailLoginFormProps {
  onSuccess?: (requiresOtp?: boolean) => void;
}

export const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormData) => {
    login.mutate(values, {
      onSuccess: (data) => {
        if (data.requires_otp) {
          onSuccess?.(true);
        } else {
          onSuccess?.(false);
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            label="Email address:"
            placeholder="example@gmail.com"
            error={errors.email?.message}
            disabled={login.isPending}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter password"
            error={errors.password?.message}
            disabled={login.isPending}
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

      {login.error && <ErrorMessage error={login.error} />}

      <Button
        type="submit"
        disabled={!isValid || login.isPending}
        className="w-full h-11 rounded-md font-medium text-base text-white bg-[#60A5FA] hover:bg-[#60A5FA]/90 disabled:bg-[rgba(96,165,250,0.6)] disabled:cursor-not-allowed disabled:hover:bg-[rgba(96,165,250,0.6)] transition-colors"
      >
        {login.isPending ? "Signing in..." : "Next"}
      </Button>
    </form>
  );
};
