import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button, ErrorMessage, OTPInput } from "@shared/ui";

import { useVerifyLoginOTP } from "@entities/Auth";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Your verification code must be 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export const VerificationForm = () => {
  const verifyLoginOTP = useVerifyLoginOTP();

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
    verifyLoginOTP.mutate(values.otp);
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-center">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OTPInput
              value={field.value}
              onChange={field.onChange}
              length={6}
              error={errors.otp?.message}
              disabled={verifyLoginOTP.isPending}
              helperText={`The code will arrive within ${formatTime(timeLeft)}`}
            />
          )}
        />
      </div>

      {verifyLoginOTP.error && <ErrorMessage error={verifyLoginOTP.error} />}

      <Button
        type="submit"
        disabled={verifyLoginOTP.isPending}
        className="w-full h-[44px] bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-white font-medium text-base rounded-md"
      >
        {verifyLoginOTP.isPending ? "Verifying..." : "Verify"}
      </Button>
    </form>
  );
};
