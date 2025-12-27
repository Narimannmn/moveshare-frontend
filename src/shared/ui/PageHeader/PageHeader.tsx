import { memo } from "react";
import { cn } from "@/shared/lib/utils";

export interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader = memo(({ title, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <h1 className="text-2xl font-bold text-[#202224]">{title}</h1>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
});

PageHeader.displayName = "PageHeader";
