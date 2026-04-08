import { forwardRef, memo } from "react";

import { type VariantProps, cva } from "class-variance-authority";
import { OTPInput as InputOTP } from "input-otp";

import { cn } from "@/shared/lib/utils";

const otpVariants = cva(
  "relative flex items-center justify-center rounded-lg border text-lg font-medium transition-all focus-within:ring-2 focus-within:ring-[#60A5FA] focus-within:ring-offset-0",
  {
    variants: {
      state: {
        default: "border-[#D8D8D8] bg-[#F1F4F9]",
        error: "border-[#FF0000] bg-[#F1F4F9]",
        success: "border-[#00C853] bg-[#F1F4F9]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface OTPInputProps extends VariantProps<typeof otpVariants> {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: 4 | 6;
  state?: "default" | "error" | "success";
  disabled?: boolean;
  error?: string;
  helperText?: string;
  label?: string;
  containerClassName?: string;
}

export const OTPInput = memo(
  forwardRef<HTMLInputElement, OTPInputProps>(
    (
      {
        value,
        onChange,
        onComplete,
        length = 6,
        state = "default",
        disabled = false,
        error,
        helperText,
        label,
        containerClassName,
      },
      ref
    ) => {
      const currentState = error ? "error" : state;

      return (
        <div className={cn("flex flex-col gap-4 w-full", containerClassName)}>
          {label && <label className="text-sm font-medium text-[#202224]">{label}</label>}

          <InputOTP
            ref={ref}
            maxLength={length}
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            disabled={disabled}
            containerClassName="w-full"
            render={({ slots }) => (
              <div className="flex items-center justify-center gap-4 w-full">
                {slots.map((slot, idx) => (
                  <Slot key={idx} {...slot} state={currentState} />
                ))}
              </div>
            )}
          />

          {error && <span className="text-xs text-[#FF0000] font-medium">{error}</span>}

          {helperText && !error && <span className="text-xs text-[#666C72]">{helperText}</span>}
        </div>
      );
    }
  )
);

OTPInput.displayName = "OTPInput";

interface SlotProps {
  char: string | null;
  isActive: boolean;
  hasFakeCaret: boolean;
  state?: "default" | "error" | "success";
}

const Slot = memo(({ char, isActive, hasFakeCaret, state }: SlotProps) => {
  return (
    <div
      className={cn(
        "flex-1 h-14",
        otpVariants({ state }),
        isActive && "border-[#60A5FA] ring-2 ring-[#60A5FA]"
      )}
    >
      {char !== null && <div className="text-[#202224]">{char}</div>}
      {hasFakeCaret && <div className="absolute animate-caret-blink h-5 w-0.5 bg-[#202224]" />}
    </div>
  );
});

Slot.displayName = "Slot";
