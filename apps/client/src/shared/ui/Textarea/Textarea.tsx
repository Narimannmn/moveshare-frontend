import { forwardRef, memo } from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/shared/lib/utils";

const textareaVariants = cva(
  "w-full rounded-[7.5px] px-4 py-2.5 text-base text-[#202224] border transition-colors placeholder:text-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 min-h-[80px] resize-y",
  {
    variants: {
      state: {
        default: "border-[#D8D8D8]",
        error: "border-[#FF0000] focus:ring-[#FF0000]",
        focused: "border-[#60A5FA]",
        disabled: "border-[#D8D8D8]",
      },
      bg: {
        true: "bg-[#F1F4F9]",
        false: "bg-white",
      },
    },
    defaultVariants: {
      state: "default",
      bg: true,
    },
  }
);

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
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
        <div className={cn("flex flex-col gap-1.5", containerClassName)}>
          {label && (
            <label className="text-sm font-medium text-[#202224]" htmlFor={props.id}>
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
              error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined
            }
            {...props}
          />

          {error && (
            <span id={`${props.id}-error`} className="text-xs text-[#FF0000] font-medium">
              {error}
            </span>
          )}

          {helperText && !error && (
            <span id={`${props.id}-helper`} className="text-xs text-[#666C72]">
              {helperText}
            </span>
          )}
        </div>
      );
    }
  )
);

Textarea.displayName = "Textarea";
