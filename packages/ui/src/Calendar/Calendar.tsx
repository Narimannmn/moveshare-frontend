import { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@moveshare/shared";

interface CalendarProps {
  value: string;
  onSelect: (isoDate: string) => void;
  disablePast?: boolean;
  className?: string;
}

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (value: number) => String(value).padStart(2, "0");

export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseIsoDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

export const Calendar = ({ value, onSelect, disablePast = false, className }: CalendarProps) => {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [
    ...Array(firstWeekDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  return (
    <div className={cn("rounded-lg border border-[#D8D8D8] bg-white p-3 shadow-lg", className)}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          className="inline-flex size-8 items-center justify-center rounded-md text-[#202224] hover:bg-[#F5F6FA]"
        >
          <ChevronLeft className="size-4" />
        </button>

        <p className="text-sm font-semibold text-[#202224]">{monthLabel}</p>

        <button
          type="button"
          onClick={() => setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          className="inline-flex size-8 items-center justify-center rounded-md text-[#202224] hover:bg-[#F5F6FA]"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-[#666C72]">
            {day}
          </div>
        ))}

        {calendarCells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-8" />;
          }

          const dayDate = new Date(year, month, day);
          const dayIso = toIsoDate(dayDate);
          const isSelected = dayIso === value;
          const isPast = disablePast && dayDate < today;

          return (
            <button
              key={dayIso}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(dayIso)}
              className={cn(
                "h-8 rounded-md text-sm transition-colors",
                isPast && "text-[#D8D8D8] cursor-not-allowed",
                !isPast && isSelected && "bg-[#60A5FA] text-white",
                !isPast && !isSelected && "text-[#202224] hover:bg-[#F1F4F9]"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};
