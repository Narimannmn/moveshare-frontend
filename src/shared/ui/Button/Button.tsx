import { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
import styles from "./Button.module.scss";

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      danger: styles.danger,
      secondary: styles.secondary,
      ghost: styles.ghost,
      outline: styles.outline,
    },
    size: {
      default: styles.sizeDefault,
      sm: styles.sizeSm,
      lg: styles.sizeLg,
    },
    fullWidth: {
      true: styles.fullWidth,
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
    fullWidth: false,
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof buttonVariants> {
  variant?: "primary" | "danger" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    (
      {
        variant = "primary",
        size = "default",
        fullWidth = false,
        loading = false,
        disabled,
        prefix,
        postfix,
        className,
        children,
        ...props
      },
      ref
    ) => {
      return (
        <button
          ref={ref}
          disabled={disabled || loading}
          className={cn(
            buttonVariants({
              variant,
              size,
              fullWidth,
            }),
            className
          )}
          {...props}
        >
          {loading && (
            <span className={styles.spinner} aria-hidden="true">
              ⏳
            </span>
          )}
          {!loading && prefix && (
            <span className={styles.prefix} aria-hidden="true">
              {prefix}
            </span>
          )}
          <span className={styles.content}>{children}</span>
          {!loading && postfix && (
            <span className={styles.postfix} aria-hidden="true">
              {postfix}
            </span>
          )}
        </button>
      );
    }
  )
);

Button.displayName = "Button";
