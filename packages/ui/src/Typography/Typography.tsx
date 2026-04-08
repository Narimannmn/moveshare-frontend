import { type ElementType, type ReactNode, memo } from "react";

import { type TypographyVariant } from "@moveshare/shared/config";
import { cn } from "@moveshare/shared";

import styles from "./Typography.module.scss";

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
