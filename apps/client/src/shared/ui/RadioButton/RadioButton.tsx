import { forwardRef, memo } from "react";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const radioGroupVariants = cva("", {
  variants: {
    orientation: {
      vertical: "flex flex-col gap-3",
      horizontal: "flex flex-row gap-5 flex-wrap",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

const radioItemVariants = cva(
  "peer shrink-0 rounded-full border bg-white transition-all hover:border-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 data-[state=checked]:border-[#60A5FA]",
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

const indicatorSizeMap = {
  sm: "size-2.5",
  default: "size-3",
  lg: "size-3.5",
};

export interface RadioGroupProps
  extends
    Omit<RadioGroupPrimitive.RadioGroupProps, "orientation">,
    VariantProps<typeof radioGroupVariants> {
  label?: string;
  error?: string;
  orientation?: "vertical" | "horizontal";
  containerClassName?: string;
}

export interface RadioItemProps
  extends
    Omit<RadioGroupPrimitive.RadioGroupItemProps, "size">,
    VariantProps<typeof radioItemVariants> {
  label?: string;
  description?: string;
  size?: "default" | "sm" | "lg";
  itemClassName?: string;
}

export const RadioGroup = memo(
  forwardRef<HTMLDivElement, RadioGroupProps>(
    (
      { label, error, orientation = "vertical", className, containerClassName, children, ...props },
      ref
    ) => {
      return (
        <div className={cn("flex flex-col gap-1.5", containerClassName)}>
          {label && <label className="text-sm font-medium text-[#202224] mb-3">{label}</label>}

          <RadioGroupPrimitive.Root
            ref={ref}
            className={cn(radioGroupVariants({ orientation }), className)}
            {...props}
          >
            {children}
          </RadioGroupPrimitive.Root>

          {error && <span className="text-xs text-[#FF0000] font-medium">{error}</span>}
        </div>
      );
    }
  )
);

RadioGroup.displayName = "RadioGroup";

export const RadioItem = memo(
  forwardRef<HTMLButtonElement, RadioItemProps>(
    (
      { label, description, size = "default", disabled, className, itemClassName, ...props },
      ref
    ) => {
      const state = "default";

      return (
        <div className={cn("flex flex-col", itemClassName)}>
          <div className="flex items-start gap-2.5">
            <RadioGroupPrimitive.Item
              ref={ref}
              disabled={disabled}
              className={cn(radioItemVariants({ size, state }), className)}
              {...props}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center size-full">
                <div className={cn("rounded-full bg-[#60A5FA]", indicatorSizeMap[size])} />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>

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
                        const radio = e.currentTarget.parentElement?.parentElement?.querySelector(
                          '[role="radio"]'
                        ) as HTMLButtonElement;
                        radio?.click();
                      }
                    }}
                  >
                    {label}
                  </label>
                )}
                {description && (
                  <span className={cn("text-xs text-[#A6A6A6]", disabled && "text-[#A6A6A6]")}>
                    {description}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  )
);

RadioItem.displayName = "RadioItem";
