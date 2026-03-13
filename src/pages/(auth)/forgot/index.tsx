import { useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";

import { useForgotPassword, useForgotPasswordReset, useForgotPasswordVerifyOTP } from "@entities/Auth";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, OTPInput } from "@shared/ui";

export const Route = createFileRoute("/(auth)/forgot/")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [emailForReset, setEmailForReset] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(120);
  const [otpGlobalError, setOtpGlobalError] = useState<string | null>(null);

  const tempToken = useAuthStore((state) => state.tempToken);
  const authActions = useAuthStore((state) => state.actions);

  const forgotPassword = useForgotPassword();
  const verifyForgotPasswordOtp = useForgotPasswordVerifyOTP();
  const forgotPasswordReset = useForgotPasswordReset();

  const emailFormSchema = useMemo(
    () =>
      z.object({
        email: z.string().email("Please enter a valid email address"),
      }),
    []
  );

  const otpFormSchema = useMemo(
    () =>
      z.object({
        otp_code: z
          .string()
          .length(6, "Please enter the 6-digit code")
          .regex(/^\d+$/, "Code must contain only digits"),
      }),
    []
  );

  const resetFormSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirm_password: z.string().min(8, "Password must be at least 8 characters"),
        })
        .refine((values) => values.password === values.confirm_password, {
          message: "Passwords do not match",
          path: ["confirm_password"],
        }),
    []
  );

  type EmailFormValues = z.infer<typeof emailFormSchema>;
  type OtpFormValues = z.infer<typeof otpFormSchema>;
  type ResetFormValues = z.infer<typeof resetFormSchema>;

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
    setError: setEmailError,
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors, isValid: isOtpValid },
    setError: setOtpError,
    reset: resetOtpForm,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    mode: "onChange",
    defaultValues: {
      otp_code: "",
    },
  });

  const {
    control: resetControl,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isValid: isResetValid },
    setError: setResetError,
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (step !== "otp" || otpTimeLeft <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setOtpTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [step, otpTimeLeft]);

  const getApiErrorMessage = (error: unknown): string => {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response
    ) {
      const responseData = (error.response as { data?: { detail?: unknown } }).data;

      if (typeof responseData?.detail === "string") {
        return responseData.detail;
      }

      if (Array.isArray(responseData?.detail) && responseData.detail.length > 0) {
        const messages = responseData.detail
          .map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : ""))
          .filter(Boolean);

        if (messages.length > 0) {
          return messages.join(", ");
        }
      }
    }

    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }

    return "Something went wrong. Please try again.";
  };

  const onEmailSubmit = (values: EmailFormValues) => {
    forgotPassword.mutate(
      { email: values.email },
      {
        onSuccess: () => {
          setEmailForReset(values.email);
          setOtpGlobalError(null);
          setOtpTimeLeft(120);
          resetOtpForm({ otp_code: "" });
          authActions.clearTempToken();
          setStep("otp");
        },
        onError: (error) => {
          setEmailError("email", {
            type: "server",
            message: getApiErrorMessage(error),
          });
        },
      }
    );
  };

  const onOtpSubmit = (values: OtpFormValues) => {
    setOtpGlobalError(null);

    verifyForgotPasswordOtp.mutate(
      {
        email: emailForReset,
        otp_code: values.otp_code,
      },
      {
        onSuccess: () => {
          setStep("reset");
        },
        onError: (error) => {
          const message = getApiErrorMessage(error);
          setOtpGlobalError(message);
          setOtpError("otp_code", {
            type: "server",
            message,
          });
        },
      }
    );
  };

  const onResetSubmit = (values: ResetFormValues) => {
    forgotPasswordReset.mutate(
      {
        password: values.password,
      },
      {
        onError: (error) => {
          setResetError("confirm_password", {
            type: "server",
            message: getApiErrorMessage(error),
          });
        },
      }
    );
  };

  const handleResendCode = () => {
    if (!emailForReset || otpTimeLeft > 0) {
      return;
    }

    forgotPassword.mutate(
      { email: emailForReset },
      {
        onSuccess: () => {
          setOtpGlobalError(null);
          setOtpTimeLeft(120);
          resetOtpForm({ otp_code: "" });
        },
        onError: (error) => {
          setOtpGlobalError(getApiErrorMessage(error));
        },
      }
    );
  };

  const formattedOtpTime = `${Math.floor(otpTimeLeft / 60)}:${String(otpTimeLeft % 60).padStart(2, "0")}`;

  return (
    <Card className="w-full max-w-[520px] bg-white p-8 sm:p-10 border-none shadow-none sm:border sm:rounded-[16px] sm:shadow-lg">
      <CardHeader className="p-0 space-y-2 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold text-[#202224]">
          {step === "email" ? "Forgot Password" : step === "otp" ? "Enter Verification Code" : "Reset Password"}
        </CardTitle>
        <p className="text-sm text-[#666C72]">
          {step === "email" &&
            "Enter your email address and we'll send you a 6-digit verification code."}
          {step === "otp" &&
            `We sent a 6-digit code to ${emailForReset}. Please enter it below.`}
          {step === "reset" && "Set a new password for your account."}
        </p>
      </CardHeader>

      <CardContent className="p-0 mt-6">
        {step === "email" && (
          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
            <Controller
              name="email"
              control={emailControl}
              render={({ field }) => (
                <Input
                  {...field}
                  id="forgot-email"
                  label="Email"
                  type="email"
                  placeholder="example@gmail.com"
                  error={emailErrors.email?.message}
                  disabled={forgotPassword.isPending}
                />
              )}
            />

            <Button
              type="submit"
              className="w-full h-[48px] text-base font-semibold"
              disabled={!isEmailValid || forgotPassword.isPending}
              loading={forgotPassword.isPending}
            >
              {forgotPassword.isPending ? "Sending..." : "Continue"}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-5">
            <Controller
              name="otp_code"
              control={otpControl}
              render={({ field }) => (
                <OTPInput
                  value={field.value}
                  onChange={field.onChange}
                  length={6}
                  state={otpGlobalError ? "error" : field.value.length > 0 ? "success" : "default"}
                  error={otpErrors.otp_code?.message}
                  disabled={verifyForgotPasswordOtp.isPending}
                />
              )}
            />

            <Button
              type="submit"
              className="w-full h-[48px] text-base font-semibold"
              disabled={!isOtpValid || verifyForgotPasswordOtp.isPending}
              loading={verifyForgotPasswordOtp.isPending}
            >
              {verifyForgotPasswordOtp.isPending ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center text-sm text-[#666C72]">
              {otpTimeLeft > 0 ? (
                <span>Resend code in {formattedOtpTime}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-[#60A5FA] font-medium hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={forgotPassword.isPending}
                >
                  Resend code
                </button>
              )}
            </div>
          </form>
        )}

        {step === "reset" && tempToken && (
          <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-5">
            <Controller
              name="password"
              control={resetControl}
              render={({ field }) => (
                <Input
                  {...field}
                  id="new-password"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  error={resetErrors.password?.message}
                  disabled={forgotPasswordReset.isPending}
                />
              )}
            />

            <Controller
              name="confirm_password"
              control={resetControl}
              render={({ field }) => (
                <Input
                  {...field}
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter new password"
                  error={resetErrors.confirm_password?.message}
                  disabled={forgotPasswordReset.isPending}
                />
              )}
            />

            <Button
              type="submit"
              className="w-full h-[48px] text-base font-semibold"
              disabled={!isResetValid || forgotPasswordReset.isPending}
              loading={forgotPasswordReset.isPending}
            >
              {forgotPasswordReset.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-[#666C72]">
          <Link to="/login" className="text-[#60A5FA] font-medium hover:underline">
            Back to Log In
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
