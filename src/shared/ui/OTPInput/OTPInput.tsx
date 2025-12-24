import { forwardRef, memo } from "react";
import { OTPInput as InputOTP } from "input-otp";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import styles from "./OTPInput.module.scss";

const otpVariants = cva(styles.slot, {
  variants: {
    state: {
      default: styles.default,
      error: styles.error,
      success: styles.success,
    },
    size: {
      default: styles.sizeDefault,
      sm: styles.sizeSm,
    },
  },
  defaultVariants: {
    state: "default",
    size: "default",
  },
});

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
        <div className={cn(styles.container, containerClassName)}>
          {label && <label className={styles.label}>{label}</label>}

          <InputOTP
            ref={ref}
            maxLength={length}
            value={value}
            onChange={onChange}
            onComplete={onComplete}
            disabled={disabled}
            containerClassName={styles.inputContainer}
            render={({ slots }) => (
              <>
                <div className={styles.group}>
                  {slots.slice(0, length === 6 ? 3 : 2).map((slot, idx) => (
                    <Slot
                      key={idx}
                      {...slot}
                      state={currentState}
                      size={size}
                    />
                  ))}
                </div>

                {length === 6 && <div className={styles.separator} />}

                <div className={styles.group}>
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

          {error && <span className={styles.errorText}>{error}</span>}

          {helperText && !error && (
            <span className={styles.helperText}>{helperText}</span>
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
        className={cn(otpVariants({ state, size }), isActive && styles.active)}
      >
        {char !== null && <div className={styles.char}>{char}</div>}
        {hasFakeCaret && <div className={styles.caret} />}
      </div>
    );
  }
);

Slot.displayName = "Slot";
