import { forwardRef, memo } from "react";
import { OTPInput as InputOTP } from "input-otp";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const otpVariants = cva(
  "relative flex items-center justify-center rounded-[7.5px] border text-base font-medium transition-all focus-within:ring-2 focus-within:ring-[#60A5FA] focus-within:ring-offset-0",
  {
    variants: {
      state: {
        default: "border-[#D8D8D8] bg-white",
        error: "border-[#FF0000] bg-white",
        success: "border-[#00C853] bg-white",
      },
      size: {
        default: "size-14 text-lg",
        sm: "size-10 text-base",
      },
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  }
);

export interface OTPInputProps extends VariantProps<typeof otpVariants> {
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: 4 | 6;
  state?: "default" | "error" | "success";
  size?: "default" | "sm";
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
        size = "default",
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
        <div className={cn("flex flex-col gap-1.5", containerClassName)}>
          {label && (
            <label className="text-sm font-medium text-[#202224]">
              {label}
            </label>
          )}

          <InputOTP
            ref={ref}
            maxLength={length}
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            disabled={disabled}
            containerClassName="flex items-center gap-3"
            render={({ slots }) => (
              <>
                <div className="flex items-center gap-2">
                  {slots.slice(0, length === 6 ? 3 : 2).map((slot, idx) => (
                    <Slot
                      key={idx}
                      {...slot}
                      state={currentState}
                      size={size}
                    />
                  ))}
                </div>

                {length === 6 && (
                  <div className="text-2xl text-[#666C72]">–</div>
                )}

                <div className="flex items-center gap-2">
                  {slots
                    .slice(length === 6 ? 3 : 2, length)
                    .map((slot, idx) => (
                      <Slot
                        key={idx + (length === 6 ? 3 : 2)}
                        {...slot}
                        state={currentState}
                        size={size}
                      />
                    ))}
                </div>
              </>
            )}
          />

          {error && (
            <span className="text-xs text-[#FF0000] font-medium">{error}</span>
          )}

          {helperText && !error && (
            <span className="text-xs text-[#666C72]">{helperText}</span>
          )}
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
  size?: "default" | "sm";
}

const Slot = memo(
  ({ char, isActive, hasFakeCaret, state, size }: SlotProps) => {
    return (
      <div
        className={cn(
          otpVariants({ state, size }),
          isActive && "border-[#60A5FA] ring-2 ring-[#60A5FA]"
        )}
      >
        {char !== null && <div className="text-[#202224]">{char}</div>}
        {hasFakeCaret && (
          <div className="absolute animate-caret-blink h-5 w-0.5 bg-[#202224]" />
        )}
      </div>
    );
  }
);

Slot.displayName = "Slot";
