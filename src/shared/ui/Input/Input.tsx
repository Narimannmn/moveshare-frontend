import { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import styles from "./Input.module.scss";

const inputVariants = cva(styles.input, {
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
    hasPrefix: {
      true: styles.hasPrefix,
      false: "",
    },
    hasPostfix: {
      true: styles.hasPostfix,
      false: "",
    },
  },
  defaultVariants: {
    state: "default",
    bg: true,
    hasPrefix: false,
    hasPostfix: false,
  },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
  bg?: boolean;
  containerClassName?: string;
}

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        error,
        helperText,
        prefix,
        postfix,
        state = "default",
        bg = true,
        disabled,
        className,
        containerClassName,
        ...props
      },
      ref
    ) => {
      const inputState = disabled ? "disabled" : error ? "error" : state;

      return (
        <div className={cn(styles.container, containerClassName)}>
          {label && (
            <label className={styles.label} htmlFor={props.id}>
              {label}
            </label>
          )}

          <div className={styles.inputWrapper}>
            {prefix && <div className={styles.prefix}>{prefix}</div>}

            <input
              ref={ref}
              disabled={disabled}
              className={cn(
                inputVariants({
                  state: inputState,
                  bg,
                  hasPrefix: !!prefix,
                  hasPostfix: !!postfix,
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

            {postfix && <div className={styles.postfix}>{postfix}</div>}
          </div>

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

Input.displayName = "Input";
