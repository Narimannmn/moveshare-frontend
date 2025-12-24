import { forwardRef, memo } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const checkboxVariants = cva(
  "peer shrink-0 rounded-full border bg-white transition-all hover:border-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-[#60A5FA] data-[state=checked]:bg-white",
  {
    variants: {
      size: {
        sm: "size-5",
        default: "size-6",
        lg: "size-7",
      },
      state: {
        default: "border-[#D8D8D8]",
        error: "border-[#FF0000] data-[state=checked]:border-[#FF0000]",
      },
    },
    defaultVariants: {
      size: "default",
      state: "default",
    },
  }
);

const iconSizeMap = {
  sm: "size-3",
  default: "size-3.5",
  lg: "size-4",
};

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
        <div className={cn("flex flex-col gap-1.5", containerClassName)}>
          <div className="flex items-start gap-2.5">
            <CheckboxPrimitive.Root
              ref={ref}
              disabled={disabled}
              className={cn(checkboxVariants({ size, state }), className)}
              {...props}
            >
              <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[#60A5FA]">
                <Check className={iconSizeMap[size]} />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            {(label || description) && (
              <div className="flex flex-col gap-1">
                {label && (
                  <label
                    className={cn(
                      "text-sm font-medium text-[#202224] cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:text-[#A6A6A6]",
                      disabled && "cursor-not-allowed text-[#A6A6A6]"
                    )}
                    onClick={(e) => {
                      if (!disabled) {
                        const checkbox =
                          e.currentTarget.parentElement?.parentElement?.querySelector(
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
                  <span
                    className={cn(
                      "text-xs text-[#A6A6A6]",
                      disabled && "text-[#A6A6A6]"
                    )}
                  >
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>

          {error && (
            <span className="text-xs text-[#FF0000] font-medium">{error}</span>
          )}
        </div>
      );
    }
  )
);

Checkbox.displayName = "Checkbox";
