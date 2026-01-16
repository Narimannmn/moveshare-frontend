import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, OTPInput } from "@shared/ui";

import { useVerifyRegistrationOTP } from "@entities/Auth";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your verification code must be 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface VerificationRegisterFormProps {
  email: string;
  onSuccess?: () => void;
}

export const VerificationRegisterForm: React.FC<VerificationRegisterFormProps> = ({
  email,
  onSuccess,
}) => {
  const verifyOTP = useVerifyRegistrationOTP();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (values: FormData) => {
    verifyOTP.mutate(
      { email, code: values.otp },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  // Countdown logic (2 minutes)
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              length={6}
              error={errors.otp?.message || (verifyOTP.error ? verifyOTP.error.message : undefined)}
              disabled={verifyOTP.isPending}
            />
          )}
        />

        <Button
          type="submit"
          disabled={verifyOTP.isPending}
          className="w-full h-[44px] bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-medium text-base rounded-md"
        >
          {verifyOTP.isPending ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="flex items-center justify-center w-full">
        <p className="text-[#666C72] text-base text-center">
          The code will arrive within {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  );
};
