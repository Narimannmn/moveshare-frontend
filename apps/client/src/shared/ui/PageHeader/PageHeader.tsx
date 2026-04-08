import { memo } from "react";

import { cn } from "@/shared/lib/utils";

import { Typography } from "../Typography/Typography";

export interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = memo(({ title, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <Typography variant="bold_24">{title}</Typography>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
});

PageHeader.displayName = "PageHeader";
