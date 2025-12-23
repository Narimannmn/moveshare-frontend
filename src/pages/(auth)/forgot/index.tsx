import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export const Route = createFileRoute("/(auth)/forgot/")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-[480px] bg-white p-10 border-none shadow-none sm:border sm:rounded-[16px] sm:shadow-lg">
      <CardHeader className="p-0 space-y-1 text-center sm:text-left">
        <CardTitle className="text-2xl font-bold text-[#202224]">
          Forgot Password
        </CardTitle>
        <p className="text-sm text-[#666C72]">
          Enter your email to reset your password
        </p>
      </CardHeader>

      <CardContent className="p-0 mt-6">
        {/* TODO: Add ForgotPasswordForm component */}
        <p className="text-sm text-gray-500">Form component to be implemented</p>
      </CardContent>
    </Card>
  );
}
