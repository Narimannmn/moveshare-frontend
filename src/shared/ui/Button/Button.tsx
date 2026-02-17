import { forwardRef, memo } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "flex gap-2 items-center justify-center rounded-lg font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-[#60A5FA] text-white hover:bg-[#60A5FA]/90",
        danger: "bg-[#FF0000] text-white hover:bg-[#FF0000]/90",
        secondary: "bg-white border border-[#A6A6A6] text-[#202224] hover:bg-gray-50",
        ghost: "bg-[#ECEFF1] text-[#202224] hover:bg-[#ECEFF1]/80",
        outline: "border border-[#A6A6A6] bg-white text-[#202224] hover:bg-gray-50",
      },
      size: {
        sm: "px-3 py-1.5 text-sm h-9",
        default: "px-4 py-2.5 text-base h-11",
        lg: "px-4 py-2.5 text-base h-11",
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
