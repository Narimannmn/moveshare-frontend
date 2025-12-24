import { memo } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface HeaderProps {
  className?: string;
  onNotificationClick?: () => void;
}

export const Header = memo(
  ({ className, onNotificationClick }: HeaderProps) => {
    return (
      <header
        className={cn(
          "flex items-center justify-between h-17.5 px-4 bg-white border-b border-[#D8D8D8]",
          className
        )}
      >
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" />
          <span className="text-xl font-semibold text-[#60A5FA]">
            Moveshare
          </span>
        </div>

        {/* Right Section - Notification & Avatar */}
        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 text-[#2C3E50] hover:text-[#60A5FA] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="size-6" strokeWidth={2} />
          </button>

          {/* User Avatar */}
          <button
            className="size-11 rounded-full bg-[#D8D8D8] flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-[#60A5FA] transition-all"
            aria-label="User menu"
          >
            {/* Placeholder for user avatar */}
            <span className="text-sm font-medium text-[#404040]">U</span>
          </button>
        </div>
      </header>
    );
  }
);

Header.displayName = "Header";
