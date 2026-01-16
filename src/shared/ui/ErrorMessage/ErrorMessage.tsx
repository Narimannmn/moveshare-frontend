import React from "react";

import { AlertCircle } from "lucide-react";

import { cn } from "@shared/lib/utils";

export interface ErrorMessageProps {
  error?: unknown;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, className }) => {
  if (!error) return null;

  // Extract error message from various error formats
  const getErrorMessage = (err: unknown): string => {
    // Axios error response
    if (
      err &&
      typeof err === "object" &&
      "response" in err &&
      err.response &&
      typeof err.response === "object"
    ) {
      const response = err.response as {
        data?: { detail?: string | { msg: string }[] };
      };

      // FastAPI validation error format
      if (
        response.data?.detail &&
        Array.isArray(response.data.detail) &&
        response.data.detail.length > 0
      ) {
        return response.data.detail.map((item: { msg: string }) => item.msg).join(", ");
      }

      // Simple detail string
      if (typeof response.data?.detail === "string") {
        return response.data.detail;
      }
    }

    // Error object with message
    if (err && typeof err === "object" && "message" in err) {
      return String(err.message);
    }

    // String error
    if (typeof err === "string") {
      return err;
    }

    return "An unexpected error occurred";
  };

  const message = getErrorMessage(error);

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3",
        className
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

ErrorMessage.displayName = "ErrorMessage";
