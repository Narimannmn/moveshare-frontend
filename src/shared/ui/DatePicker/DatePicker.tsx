import { useEffect, useMemo, useRef, useState } from "react";

import { CalendarDays } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Calendar, parseIsoDate } from "@/shared/ui/Calendar";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disablePast?: boolean;
}

const pad = (value: number) => String(value).padStart(2, "0");

const formatDisplayDate = (value: string) => {
  const parsed = parseIsoDate(value);
  if (!parsed) return "";
  return `${pad(parsed.getDate())}.${pad(parsed.getMonth() + 1)}.${parsed.getFullYear()}`;
};

export const DatePicker = ({ value, onChange, placeholder = "Select date", className, disablePast = false }: DatePickerProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = useMemo(() => parseIsoDate(value), [value]);

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

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
        className={cn(
          "w-full h-11 border border-[#D8D8D8] rounded-lg px-4 text-base font-normal focus:outline-none focus:border-[#60A5FA] bg-white flex items-center justify-between",
          value ? "text-[#202224]" : "text-[#A6A6A6]"
        )}
      >
        <span>{value ? formatDisplayDate(value) : placeholder}</span>
        <CalendarDays className="size-5 text-[#666C72]" />
      </button>

      {isOpen && (
        <Calendar
          value={value}
          onSelect={(isoDate) => {
            onChange(isoDate);
            setIsOpen(false);
          }}
          disablePast={disablePast}
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-full"
        />
      )}
    </div>
  );
};
