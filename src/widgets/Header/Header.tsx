import { memo, useEffect, useRef, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCircle2, Clock3, Settings } from "lucide-react";

import { useAuthStore } from "@/entities/Auth/model/store/authStore";
import { cn } from "@/shared/lib/utils";
import { Avatar, Button } from "@/shared/ui";

export interface HeaderProps {
  className?: string;
  onNotificationClick?: () => void;
}

interface HeaderNotificationItem {
  id: string;
  title: string;
  description: string;
  createdAtLabel: string;
  unread: boolean;
}

const INITIAL_NOTIFICATIONS: HeaderNotificationItem[] = [
  {
    id: "n1",
    title: "Job Claimed Successfully",
    description:
      'You\'ve successfully claimed the "Furniture Delivery" job from Chicago to Indianapolis. The company has been notified and will contact you shortly.',
    createdAtLabel: "Just now",
    unread: true,
  },
  {
    id: "n2",
    title: "Job Claimed Successfully",
    description:
      'You\'ve successfully claimed the "Furniture Delivery" job from Chicago to Indianapolis. The company has been notified and will contact you shortly.',
    createdAtLabel: "Just now",
    unread: true,
  },
  {
    id: "n3",
    title: "Job Claimed Successfully",
    description:
      'You\'ve successfully claimed the "Furniture Delivery" job from Chicago to Indianapolis. The company has been notified and will contact you shortly.',
    createdAtLabel: "Just now",
    unread: true,
  },
];

export const Header = memo(({ className, onNotificationClick }: HeaderProps) => {
  const navigate = useNavigate();
  const companyProfile = useAuthStore((s) => s.companyProfile);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<HeaderNotificationItem[]>(INITIAL_NOTIFICATIONS);

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

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification
      )
    );
  };

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

      {/* Right Section - Notification & Avatar */}
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
          </button>

          {isNotificationsOpen ? (
            <div className="absolute right-0 top-full z-50 mt-3 w-[min(680px,calc(100vw-32px))] rounded-[8px] bg-white p-4 shadow-[7px_7px_13.9px_0px_rgba(99,99,99,0.29)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[20px] font-bold leading-none text-[#202224]">Notification</h3>
                <button
                  type="button"
                  className="flex items-center gap-2 text-[16px] leading-none text-[#60A5FA] hover:opacity-85 transition-opacity"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    navigate({ to: "/profile/notifications" });
                  }}
                >
                  <span>Setting</span>
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              <div className="flex max-h-[560px] flex-col gap-4 overflow-auto pr-1">
                {notifications.map((notification) => (
                  <article
                    key={notification.id}
                    className="rounded-[8px] border-l-[6px] border-[#2ECC71] bg-white shadow-[7px_7px_13.9px_0px_rgba(99,99,99,0.29)]"
                  >
                    <div className="flex flex-col gap-4 rounded-[8px] border-b border-[#D8D8D8] p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
                          <CheckCircle2 className="h-4 w-4 text-[#4CAF50]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <p className="truncate text-[16px] font-bold leading-none text-[#263238]">
                                {notification.title}
                              </p>
                              {notification.unread ? (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-[#4CAF50]" />
                              ) : null}
                            </div>

                            <div className="flex shrink-0 items-center gap-1 text-[#A6A6A6]">
                              <Clock3 className="h-4 w-4" />
                              <span className="text-[16px] leading-none">
                                {notification.createdAtLabel}
                              </span>
                            </div>
                          </div>

                          <p className="mt-2 text-[14px] leading-[1.35] text-[#A6A6A6]">
                            {notification.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="default"
                          className="h-11 rounded-[8px] bg-[#ECEFF1] px-4 text-base text-[#202224] hover:bg-[#E1E6EA]"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          Mark as Read
                        </Button>
                        <Button
                          variant="primary"
                          size="default"
                          className="h-11 rounded-[8px] px-5 text-base"
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigate({ to: "/jobs" });
                          }}
                        >
                          View Job
                        </Button>
                        <Button
                          variant="ghost"
                          size="default"
                          className="h-11 rounded-[8px] bg-[#ECEFF1] px-4 text-base text-[#202224] hover:bg-[#E1E6EA]"
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            navigate({ to: "/chat" });
                          }}
                        >
                          Message Company
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
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
