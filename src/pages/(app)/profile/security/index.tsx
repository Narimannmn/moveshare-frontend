import { useState } from "react";
import type { ReactNode } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Monitor, Timer, X } from "lucide-react";
import { FaAndroid, FaChrome, FaFirefoxBrowser, FaSafari } from "react-icons/fa";

import { useActiveSessions, useTerminateSession } from "@/entities/Auth";
import { Button, Dialog, DialogContent } from "@/shared/ui";

export const Route = createFileRoute("/(app)/profile/security/")({
  component: SecurityPage,
});

type SessionCard = {
  id: string;
  title: string;
  location: string;
  isCurrent?: boolean;
  isActive?: boolean;
  canTerminate?: boolean;
  icon: ReactNode;
  lastActiveLabel: string;
};

const getSessionIcon = (deviceLabel: string): ReactNode => {
  const normalized = deviceLabel.toLowerCase();
  if (normalized.includes("android")) return <FaAndroid className="h-5 w-5 text-white" />;
  if (normalized.includes("firefox")) return <FaFirefoxBrowser className="h-5 w-5 text-white" />;
  if (normalized.includes("safari")) return <FaSafari className="h-5 w-5 text-white" />;
  return <FaChrome className="h-5 w-5 text-white" />;
};

const formatLastActive = (lastActiveAt: string): string => {
  const date = new Date(lastActiveAt);
  if (Number.isNaN(date.getTime())) return "Recently active";
  return `Last active ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)}`;
};

function SecurityPage() {
  const navigate = useNavigate();
  // const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const terminateSessionMutation = useTerminateSession();
  const { data: activeSessionsData, isLoading: isSessionsLoading, isError: isSessionsError } =
    useActiveSessions(isSessionsOpen);

  const handleChangePassword = () => {
    navigate({ to: "/forgot" });
  };

  const handleViewAllSessions = () => {
    setIsSessionsOpen(true);
  };

  // const handleToggleTwoFactor = () => {
  //   setTwoFactorEnabled((prev) => !prev);
  // };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSessionMutation.mutateAsync(sessionId);
    } catch (error) {
      console.error("Failed to terminate session:", error);
    }
  };

  const sessions: SessionCard[] =
    activeSessionsData?.sessions.map((session) => ({
      id: session.id,
      title: session.device_label,
      location: session.location,
      isCurrent: session.is_current,
      isActive: session.is_current,
      canTerminate: !session.is_current,
      icon: getSessionIcon(session.device_label),
      lastActiveLabel: session.is_current ? "Current session" : formatLastActive(session.last_active_at),
    })) ?? [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Security Settings</h2>

      <div className="border-t border-gray-200">
        <div className="flex items-center justify-between py-5 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#202224] mb-1">Password</h3>
            <p className="text-sm text-gray-500">Last changed: 3 months ago</p>
          </div>
          <Button variant="secondary" onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>

        {/* <div className="flex items-center justify-between py-5 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#202224] mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-blue-500 mb-1">Active</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>

          <button
            onClick={handleToggleTwoFactor}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              twoFactorEnabled ? "bg-blue-500" : "bg-gray-300"
            }`}
            role="switch"
            aria-checked={twoFactorEnabled}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                twoFactorEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div> */}

        <div className="flex items-center justify-between py-5">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#202224] mb-1">Active Sessions</h3>
            <p className="text-sm text-gray-500">When you receive new messages</p>
          </div>
          <Button variant="secondary" onClick={handleViewAllSessions}>
            View All
          </Button>
        </div>
      </div>

      <Dialog open={isSessionsOpen} onOpenChange={setIsSessionsOpen}>
        <DialogContent
          className="max-w-[430px] p-0 gap-0"
          showClose={false}
          aria-describedby="active-sessions-description"
        >
          <div className="flex flex-col gap-6 bg-white p-6">
            <p id="active-sessions-description" className="sr-only">
              Active sessions list
            </p>

            <div className="flex items-center justify-between">
              <button
                type="button"
                aria-label="Back"
                className="text-[#202224] transition-colors hover:text-[#2C3E50]"
                onClick={() => setIsSessionsOpen(false)}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Close"
                className="text-[#A6A6A6] transition-colors hover:text-[#202224]"
                onClick={() => setIsSessionsOpen(false)}
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold leading-none text-[#2C3E50]">Active Sessions</h2>
              <div
                className="flex h-[50px] w-[50px] items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(135deg, #3A7BD5 0%, #00D2FF 100%)" }}
              >
                <Monitor className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {isSessionsLoading ? (
                <div className="rounded-lg bg-[#F5F6FA] px-4 py-4 text-sm text-[#7F8C8D]">
                  Loading sessions...
                </div>
              ) : isSessionsError ? (
                <div className="rounded-lg bg-[#F5F6FA] px-4 py-4 text-sm text-[#FF5E62]">
                  Failed to load active sessions.
                </div>
              ) : sessions.length === 0 ? (
                <div className="rounded-lg bg-[#F5F6FA] px-4 py-4 text-sm text-[#7F8C8D]">
                  No active sessions found.
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-4 rounded-lg bg-[#F5F6FA] px-4 py-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px]"
                        style={{ background: "linear-gradient(135deg, #4B6CB7 0%, #182848 100%)" }}
                      >
                        {session.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[16px] font-bold leading-none text-[#2C3E50]">
                          {session.title}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-[12px] leading-none text-[#7F8C8D]">
                          <MapPin className="h-[14px] w-[14px]" />
                          <span>{session.location}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[12px] leading-none text-[#7F8C8D]">
                          <Timer className="h-[14px] w-[14px]" />
                          <span>{session.lastActiveLabel}</span>
                        </div>
                      </div>
                    </div>

                    {session.isActive ? (
                      <span
                        className="rounded-full px-3 py-1 text-[12px] font-bold leading-none text-white"
                        style={{ background: "linear-gradient(161deg, #00B09B 0%, #96C93D 100%)" }}
                      >
                        Active
                      </span>
                    ) : null}

                    {session.canTerminate ? (
                      <button
                        type="button"
                        disabled={terminateSessionMutation.isPending}
                        className="text-[16px] font-bold leading-none text-[#FF5E62] transition-opacity hover:opacity-90 disabled:opacity-50"
                        onClick={() => void handleTerminateSession(session.id)}
                      >
                        {terminateSessionMutation.isPending &&
                        terminateSessionMutation.variables === session.id
                          ? "Terminating..."
                          : "Terminate"}
                      </button>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
