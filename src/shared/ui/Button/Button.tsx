import { forwardRef, memo } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "flex w-full gap-2 items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#60A5FA] text-white hover:bg-[#60A5FA]/90",
        danger: "bg-[#FF0000] text-white hover:bg-[#FF0000]/90",
        secondary: "bg-[#F5F5F5] text-[#202224] hover:bg-[#F5F5F5]/80",
        ghost: "bg-[#ECEFF1] text-[#202224] hover:bg-[#ECEFF1]/80",
        outline: "border border-[#D8D8D8] bg-transparent text-[#202224] hover:bg-[#F5F5F5]",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        default: "px-6 py-2.5 text-base",
        lg: "px-8 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof buttonVariants> {
  variant?: "primary" | "danger" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  loading?: boolean;
}

export const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "default", loading = false, disabled, className, children, ...props }, ref) => {
      return (
        <button
          ref={ref}
          disabled={disabled || loading}
          className={cn(
            buttonVariants({
              variant,
              size,
            }),
            className
          )}
          {...props}
        >
          {loading ? <span className="animate-spin">⏳</span> : children}
        </button>
      );
    }
  )
);

Button.displayName = "Button";
