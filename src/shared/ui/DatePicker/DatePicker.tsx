import { useEffect, useMemo, useRef, useState } from "react";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (value: number) => String(value).padStart(2, "0");

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseIsoDate = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const formatDisplayDate = (value: string) => {
  const parsed = parseIsoDate(value);
  if (!parsed) return "";
  return `${pad(parsed.getDate())}.${pad(parsed.getMonth() + 1)}.${parsed.getFullYear()}`;
};

export const DatePicker = ({ value, onChange, placeholder = "Select date", className }: DatePickerProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());

  useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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

  const selectDay = (day: number) => {
    const picked = new Date(year, month, day);
    onChange(toIsoDate(picked));
    setIsOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal focus:outline-none focus:border-[#60A5FA] bg-white flex items-center justify-between",
          value ? "text-[#202224]" : "text-[#A6A6A6]"
        )}
      >
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        <CalendarDays className="size-5 text-[#666C72]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full rounded-lg border border-[#D8D8D8] bg-white p-3 shadow-lg">
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

              const dayIso = toIsoDate(new Date(year, month, day));
              const isSelected = dayIso === value;

              return (
                <button
                  key={dayIso}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={cn(
                    "h-8 rounded-md text-sm transition-colors",
                    isSelected
                      ? "bg-[#60A5FA] text-white"
                      : "text-[#202224] hover:bg-[#F1F4F9]"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
