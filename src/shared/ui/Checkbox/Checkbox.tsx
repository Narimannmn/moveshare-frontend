import { forwardRef, memo } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import styles from "./Checkbox.module.scss";

const checkboxVariants = cva(styles.checkbox, {
  variants: {
    size: {
      default: styles.sizeDefault,
      sm: styles.sizeSm,
      lg: styles.sizeLg,
    },
    state: {
      default: styles.stateDefault,
      error: styles.stateError,
    },
  },
  defaultVariants: {
    size: "default",
    state: "default",
  },
});

export interface CheckboxProps
  extends Omit<CheckboxPrimitive.CheckboxProps, "size">,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
  size?: "default" | "sm" | "lg";
  containerClassName?: string;
}

export const Checkbox = memo(
  forwardRef<HTMLButtonElement, CheckboxProps>(
    (
      {
        label,
        description,
        error,
        size = "default",
        disabled,
        className,
        containerClassName,
        ...props
      },
      ref
    ) => {
      const state = error ? "error" : "default";

      return (
        <div className={cn(styles.container, containerClassName)}>
          <div className={styles.wrapper}>
            <CheckboxPrimitive.Root
              ref={ref}
              disabled={disabled}
              className={cn(checkboxVariants({ size, state }), className)}
              {...props}
            >
              <CheckboxPrimitive.Indicator className={styles.indicator}>
                <Check className={styles.icon} />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            {(label || description) && (
              <div className={styles.labelWrapper}>
                {label && (
                  <label
                    className={cn(styles.label, disabled && styles.disabled)}
                    onClick={(e) => {
                      if (!disabled) {
                        const checkbox = e.currentTarget.parentElement?.parentElement?.querySelector(
                          '[role="checkbox"]'
                        ) as HTMLButtonElement;
                        checkbox?.click();
                      }
                    }}
                  >
                    {label}
                  </label>
                )}
                {description && (
                  <span className={cn(styles.description, disabled && styles.disabled)}>
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>

          {error && <span className={styles.errorText}>{error}</span>}
        </div>
      );
    }
  )
);

Checkbox.displayName = "Checkbox";
