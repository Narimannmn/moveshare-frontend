import { forwardRef, memo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
  "w-full rounded-[7.5px] px-4 py-2.5 text-base text-[#202224] border transition-colors placeholder:text-[#A6A6A6] focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
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
      hasPrefix: {
        true: "pl-12",
        false: "",
      },
      hasPostfix: {
        true: "pr-12",
        false: "",
      },
    },
    defaultVariants: {
      state: "default",
      bg: true,
      hasPrefix: false,
      hasPostfix: false,
    },
  }
);

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
        <div className={cn("flex flex-col gap-1.5", containerClassName)}>
          {label && (
            <label
              className="text-sm font-medium text-[#202224]"
              htmlFor={props.id}
            >
              {label}
            </label>
          )}

          <div className="relative flex items-center">
            {prefix && (
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#666C72]">
                {prefix}
              </div>
            )}

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

            {postfix && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#666C72]">
                {postfix}
              </div>
            )}
          </div>

          {error && (
            <span
              id={`${props.id}-error`}
              className="text-xs text-[#FF0000] font-medium"
            >
              {error}
            </span>
          )}

          {helperText && !error && (
            <span
              id={`${props.id}-helper`}
              className="text-xs text-[#666C72]"
            >
              {helperText}
            </span>
          )}
        </div>
      );
    }
  )
);

Input.displayName = "Input";
