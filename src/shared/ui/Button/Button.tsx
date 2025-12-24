import { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#60A5FA] text-white hover:bg-[#60A5FA]/90",
        danger: "bg-[#FF0000] text-white hover:bg-[#FF0000]/90",
        secondary: "bg-[#F5F5F5] text-[#202224] hover:bg-[#F5F5F5]/80",
        ghost: "bg-[#ECEFF1] text-[#202224] hover:bg-[#ECEFF1]/80",
        outline:
          "border border-[#D8D8D8] bg-transparent text-[#202224] hover:bg-[#F5F5F5]",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        default: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size" | "prefix">,
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
            <span className="animate-spin" aria-hidden="true">
              ⏳
            </span>
          )}
          {!loading && prefix && (
            <span className="shrink-0" aria-hidden="true">
              {prefix}
            </span>
          )}
          <span>{children}</span>
          {!loading && postfix && (
            <span className="shrink-0" aria-hidden="true">
              {postfix}
            </span>
          )}
        </button>
      );
    }
  )
);

Button.displayName = "Button";
