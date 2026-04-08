import { memo, useEffect, useRef, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle2, AlertTriangle, CreditCard, Info, Clock3, Settings } from "lucide-react";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { apiClient } from "@/shared/api/client";
import { cn } from "@/shared/lib/utils";
import { Avatar, Button } from "@/shared/ui";

export interface HeaderProps {
  className?: string;
  onNotificationClick?: () => void;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  metadata: Record<string, string> | null;
  created_at: string;
}

const formatRelativeTime = (iso: string): string => {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const NOTIFICATION_STYLES: Record<string, { icon: React.ReactNode; borderColor: string; iconBg: string }> = {
  job_claimed: {
    icon: <CheckCircle2 className="size-4 text-[#4CAF50]" />,
    borderColor: "border-[#4CAF50]",
    iconBg: "bg-[#E8F5E9]",
  },
  job_cancelled: {
    icon: <AlertTriangle className="size-4 text-[#EF4444]" />,
    borderColor: "border-[#EF4444]",
    iconBg: "bg-[#FEF2F2]",
  },
  payment: {
    icon: <CreditCard className="size-4 text-[#60A5FA]" />,
    borderColor: "border-[#60A5FA]",
    iconBg: "bg-[#EFF6FF]",
  },
};

const DEFAULT_STYLE = {
  icon: <Info className="size-4 text-[#60A5FA]" />,
  borderColor: "border-[#60A5FA]",
  iconBg: "bg-[#EFF6FF]",
};

const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/notifications?limit=20");
      return response.data as { notifications: NotificationItem[]; unread_count: number };
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const Header = memo(({ className, onNotificationClick }: HeaderProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyProfile = useAuthStore((s) => s.companyProfile);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data } = useNotifications();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isNotificationsOpen]);

  // Mark all as read when dropdown opens
  useEffect(() => {
    if (isNotificationsOpen && unreadCount > 0) {
      apiClient.patch("/api/v1/notifications/read-all").then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    }
  }, [isNotificationsOpen, unreadCount, queryClient]);

  const handleOpenNotifications = () => {
    onNotificationClick?.();
    setIsNotificationsOpen((prev) => !prev);
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between h-17.5 px-4 bg-white border-b border-[#D8D8D8]",
        className
      )}
    >
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="MoveShare logo" className="h-9 w-auto" />
        <span className="text-xl font-semibold text-[#60A5FA]">MoveShare</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={handleOpenNotifications}
            className="relative p-2 text-[#2C3E50] hover:text-[#60A5FA] transition-colors"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="size-6" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-[#EF4444] text-[11px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 top-full z-50 mt-3 w-[min(480px,calc(100vw-32px))] rounded-lg bg-white shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
                <h3 className="text-base font-bold text-[#202224]">Notifications</h3>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm text-[#60A5FA] hover:opacity-85 transition-opacity"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    navigate({ to: "/profile/notifications" });
                  }}
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="max-h-[400px] overflow-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Bell className="size-10 text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notification) => {
                      const style = NOTIFICATION_STYLES[notification.type] ?? DEFAULT_STYLE;
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "flex items-start gap-3 border-l-4 px-4 py-3 transition-colors hover:bg-gray-50",
                            style.borderColor,
                            !notification.is_read && "bg-[#F8FAFC]"
                          )}
                        >
                          <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full mt-0.5", style.iconBg)}>
                            {style.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-[#202224] truncate">
                                {notification.title}
                              </p>
                              <span className="text-xs text-[#90A4AE] shrink-0">
                                {formatRelativeTime(notification.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-[#666C72] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <span className="size-2 shrink-0 rounded-full bg-[#60A5FA] mt-2" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* User Avatar */}
        <button
          className="shrink-0 rounded-full hover:ring-2 hover:ring-[#60A5FA] transition-all"
          aria-label="User menu"
          onClick={() => navigate({ to: "/profile" })}
        >
          <Avatar
            name={companyProfile?.name ?? "U"}
            avatar={companyProfile?.profile_image_url}
            size="lg"
          />
        </button>
      </div>
    </header>
  );
});

Header.displayName = "Header";
