import type { ReactNode } from "react";
import { memo } from "react";

export interface InfoRowProps {
  label: string;
  value: string;
}

export const InfoRow = memo(({ label, value }: InfoRowProps) => (
  <div className="flex items-center gap-6">
    <span className="w-24 shrink-0 text-sm font-medium text-[#263238]">{label}</span>
    <span className="text-sm text-[#263238]">{value}</span>
  </div>
));
InfoRow.displayName = "InfoRow";

export interface InfoPanelProps {
  title: string;
  children: ReactNode;
  highlighted?: boolean;
}

export const InfoPanel = memo(({ title, children, highlighted = false }: InfoPanelProps) => (
  <div className="flex flex-1 flex-col gap-4 rounded-lg bg-[#F9F9F9] p-4">
    <h4 className="text-base font-bold text-[#263238]">{title}</h4>
    <div className={`flex flex-col gap-3.5 ${highlighted ? "rounded-lg bg-[#E6F2FF] p-4" : ""}`}>
      {children}
    </div>
  </div>
));
InfoPanel.displayName = "InfoPanel";
