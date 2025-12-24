import { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import styles from "./Textarea.module.scss";

const textareaVariants = cva(styles.textarea, {
  variants: {
    state: {
      default: styles.default,
      error: styles.error,
      focused: styles.focused,
      disabled: styles.disabled,
    },
    bg: {
      true: styles.withBg,
      false: styles.noBg,
    },
  },
  defaultVariants: {
    state: "default",
    bg: true,
  },
});

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  bg?: boolean;
  containerClassName?: string;
}

export const Textarea = memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
      {
        label,
        error,
        helperText,
        state = "default",
        bg = true,
        disabled,
        className,
        containerClassName,
        ...props
      },
      ref
    ) => {
      const textareaState = disabled ? "disabled" : error ? "error" : state;

      return (
        <div className={cn(styles.container, containerClassName)}>
          {label && (
            <label className={styles.label} htmlFor={props.id}>
              {label}
            </label>
          )}

          <textarea
            ref={ref}
            disabled={disabled}
            className={cn(
              textareaVariants({
                state: textareaState,
                bg,
              }),
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${props.id}-error`
                : helperText
                  ? `${props.id}-helper`
                  : undefined
            }
            {...props}
          />

          {error && (
            <span id={`${props.id}-error`} className={styles.errorText}>
              {error}
            </span>
          )}

          {helperText && !error && (
            <span id={`${props.id}-helper`} className={styles.helperText}>
              {helperText}
            </span>
          )}
        </div>
      );
    }
  )
);

Textarea.displayName = "Textarea";
