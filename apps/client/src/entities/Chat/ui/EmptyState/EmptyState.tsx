import { type ReactNode, memo } from "react";

import { cn } from "@/shared/lib/utils";

import styles from "./EmptyState.module.scss";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  className?: string;
}

export const EmptyState = memo(
  ({
    title = "No messages yet",
    message = "Select a conversation to start messaging",
    icon,
    className,
  }: EmptyStateProps) => {
    return (
      <div className={cn(styles.container, className)}>
        {icon ? <div className={styles.icon}>{icon}</div> : null}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
      </div>
    );
  }
);

EmptyState.displayName = "EmptyState";
