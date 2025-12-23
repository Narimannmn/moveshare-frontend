import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      state: {
        default: "",
        disabled: "opacity-50 pointer-events-none",
        ghost: "bg-[#F5F5F5]",
      },
      variant: {
        // rename from "type" to "variant"
        main: "bg-[#60A5FA] text-white",
        red: "bg-[#FF0000] text-white",
        grey: "bg-[#ECEFF1] text-black",
        outline: "bg-white border border-[#A6A6A6] text-black",
      },
      size: {
        default: "w-[400px] h-[44px] px-4 py-2",
      },
    },
    defaultVariants: {
      state: "default",
      variant: "main",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  state,
  type,
  size,
  asChild = false,
  className,
  ...props
}) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ state, type, size, className }))}
      {...props}
    />
  );
};
