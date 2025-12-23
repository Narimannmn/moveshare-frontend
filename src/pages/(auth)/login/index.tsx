import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { EmailLoginForm } from "@/features/auth/login-with-email/ui/EmailLoginForm";
import { VerificationForm } from "@/features/auth/verify-email/ui/VerificationForm";
import { GoogleLoginButton } from "@/features/auth/login-with-google/ui/GoogleLoginButton";
import { AppleLoginButton } from "@/features/auth/login-with-apple/ui/AppleLoginButton";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export const Route = createFileRoute("/(auth)/login/")({
  component: LoginPage,
});

function LoginPage() {
  const [step, setStep] = useState<"login" | "verify">("login");

  return (
    <Card className="w-full max-w-[480px] bg-white p-10 border-none shadow-none sm:border sm:rounded-[16px] sm:shadow-lg">
      <CardHeader className="p-0 space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold text-[#202224]">
          {step === "login" ? "Log In" : "Enter the verification code"}
        </CardTitle>

        {step === "verify" && (
          <p className="text-sm text-[#666C72]">
            Enter the 6-digit code we sent to your email
          </p>
        )}
      </CardHeader>

      <CardContent className="p-0 mt-0 space-y-5">
        {step === "login" ? (
          <>
            <EmailLoginForm onSuccess={() => setStep("verify")} />

            <div className="relative opacity-80">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-[#666C72]">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <GoogleLoginButton />
              <AppleLoginButton />
            </div>
          </>
        ) : (
          <VerificationForm />
        )}
      </CardContent>

      {/* Footer */}
      {step === "login" && (
        <CardFooter className="p-0 mt-4 justify-center text-sm text-[#202224] gap-1">
          <span>Don&apos;t have an account?</span>
          <Link
            to="/register"
            className="font-bold text-[#60A5FA] hover:underline"
          >
            Register
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}
