import { createFileRoute } from "@tanstack/react-router";

import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/entities/Auth";
import type { UpdateNotificationPreferencesRequest } from "@/entities/Auth";

export const Route = createFileRoute("/(app)/profile/notifications/")({
  component: NotificationsPage,
});

interface NotificationSetting {
  id: keyof UpdateNotificationPreferencesRequest;
  title: string;
  description: string;
}

interface NotificationToggleProps {
  setting: NotificationSetting & { enabled: boolean };
  onToggle: (id: NotificationSetting["id"], currentValue: boolean) => void;
  disabled?: boolean;
}

function NotificationToggle({ setting, onToggle, disabled = false }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-200">
      <div className="flex-1">
        <h3 className="text-base font-semibold text-[#202224] mb-1">{setting.title}</h3>
        <p className="text-sm text-gray-500">{setting.description}</p>
      </div>

      {/* Toggle Switch */}
      <button
        onClick={() => onToggle(setting.id, setting.enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          setting.enabled ? "bg-blue-500" : "bg-gray-300"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        role="switch"
        aria-checked={setting.enabled}
        disabled={disabled}
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
  const { data, isLoading, isError } = useNotificationPreferences();
  const updatePreferencesMutation = useUpdateNotificationPreferences();

  const settings: Array<NotificationSetting & { enabled: boolean }> = [
    {
      id: "job_matches_enabled",
      title: "New Job Matches",
      description: "Get notified when new jobs match your fleet availability",
      enabled: data?.job_matches_enabled ?? false,
    },
    {
      id: "job_claims_enabled",
      title: "Job Claims",
      description: "When someone claims your job or you claim a job",
      enabled: data?.job_claims_enabled ?? false,
    },
    {
      id: "messages_enabled",
      title: "Messages",
      description: "When you receive new messages",
      enabled: data?.messages_enabled ?? false,
    },
    {
      id: "payment_updates_enabled",
      title: "Payment Updates",
      description: "When payments are sent or received",
      enabled: data?.payment_updates_enabled ?? false,
    },
    {
      id: "system_updates_enabled",
      title: "System Updates",
      description: "Important platform updates and announcements",
      enabled: data?.system_updates_enabled ?? false,
    },
  ];

  const handleToggle = (id: NotificationSetting["id"], currentValue: boolean) => {
    const payload: UpdateNotificationPreferencesRequest = {
      [id]: !currentValue,
    };
    void updatePreferencesMutation.mutateAsync(payload);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Notification Preferences</h2>

      <div className="border-t border-gray-200">
        {isLoading ? (
          <div className="py-5 text-sm text-gray-500">Loading notification preferences...</div>
        ) : isError ? (
          <div className="py-5 text-sm text-red-500">Failed to load notification preferences.</div>
        ) : (
          <div>
            {settings.map((setting) => (
              <NotificationToggle
                key={setting.id}
                setting={setting}
                onToggle={handleToggle}
                disabled={updatePreferencesMutation.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
