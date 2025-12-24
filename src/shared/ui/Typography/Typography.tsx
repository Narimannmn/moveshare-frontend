import { memo, type ElementType, type ReactNode } from "react";
import { type TypographyVariant } from "@/shared/config";
import styles from "./Typography.module.scss";
import { cn } from "@/shared/lib";

interface TypographyProps {
  variant?: TypographyVariant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
  color?: string;
}

export const Typography = memo(
  ({
    variant = "regular_16",
    as: Component = "span",
    className,
    children,
    color,
  }: TypographyProps) => {
    const variantClass = styles[variant];

    return (
      <Component
        className={cn(styles.typography, variantClass, className)}
        style={color ? { color } : undefined}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = "Typography";
