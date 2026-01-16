import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/profile/notifications/")({
  component: NotificationsPage,
});

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NotificationToggleProps {
  setting: NotificationSetting;
  onToggle: (id: string) => void;
}

function NotificationToggle({ setting, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-200">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-[#202224] mb-1">{setting.title}</h3>
        <p className="text-sm text-gray-500">{setting.description}</p>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={() => onToggle(setting.id)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          setting.enabled ? "bg-blue-500" : "bg-gray-300"
        }`}
        role="switch"
        aria-checked={setting.enabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            setting.enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "job-matches",
      title: "New Job Matches",
      description: "Get notified when new jobs match your fleet availability",
      enabled: false,
    },
    {
      id: "job-claims",
      title: "Job Claims",
      description: "When someone claims your job or you claim a job",
      enabled: false,
    },
    {
      id: "messages",
      title: "Messages",
      description: "When you receive new messages",
      enabled: false,
    },
    {
      id: "payment-updates",
      title: "Payment Updates",
      description: "When payments are sent or received",
      enabled: false,
    },
    {
      id: "system-updates",
      title: "System Updates",
      description: "Important platform updates and announcements",
      enabled: false,
    },
  ]);

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Notification Preferences</h2>

      <div className="border-t border-gray-200">
        {/* Notification toggles */}
        <div>
          {settings.map((setting) => (
            <NotificationToggle key={setting.id} setting={setting} onToggle={handleToggle} />
          ))}
        </div>

        {/* Email for notifications section */}
        <div className="flex items-center justify-between py-5">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#202224] mb-1">Email for notifications</h3>
            <p className="text-sm text-gray-500">
              Link your personal email to receive notifications from the MoveShare platform.
            </p>
          </div>
          <button className="text-blue-500 font-medium text-sm hover:text-blue-600 transition-colors">
            Привязать
          </button>
        </div>
      </div>
    </div>
  );
}
