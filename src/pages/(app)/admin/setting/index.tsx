import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button, Input, Textarea } from "@/shared/ui";

export const Route = createFileRoute("/(app)/admin/setting/")({
  component: SettingPage,
});

interface SettingForm {
  platformName: string;
  commissionRate: string;
  newUserApproval: string;
  defaultCurrency: string;
  minimumPayout: string;
  jobExpirationDays: string;
  platformNotification: string;
  termsOfService: string;
}

const defaultSettings: SettingForm = {
  platformName: "MoveShare",
  commissionRate: "7.5",
  newUserApproval: "Manual Approval",
  defaultCurrency: "US Dollar (USD)",
  minimumPayout: "500",
  jobExpirationDays: "14",
  platformNotification:
    "Important: System maintenance scheduled for June 25, 2023 from 2:00 AM to 4:00 AM EST.",
  termsOfService:
    "By using MoveShare, you agree to our terms and conditions. All transactions are subject to our commission policy. Users must maintain proper insurance coverage at all times.",
};

function SettingPage() {
  const [form, setForm] = useState(defaultSettings);

  const updateField = <K extends keyof SettingForm>(key: K, value: SettingForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setForm(defaultSettings);
  };

  const handleSave = () => {
    window.alert("Settings saved");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D8D8D8] rounded-[10px] p-4">
        <h1 className="text-[#202224] text-[24px] font-bold">System Settings</h1>
        <p className="text-[#666C72] text-[14px] mt-1">
          Configure core platform defaults, moderation flow, and legal content.
        </p>
      </div>

      <section className="bg-white border border-[#D8D8D8] rounded-[10px] p-6 space-y-6">
        <h2 className="text-[#202224] text-[20px] font-bold">Platform Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Input
            label="Platform Name"
            value={form.platformName}
            onChange={(event) => updateField("platformName", event.target.value)}
            bg={false}
          />
          <Input
            label="Commission Rate (%)"
            value={form.commissionRate}
            onChange={(event) => updateField("commissionRate", event.target.value)}
            bg={false}
          />
          <Input
            label="New User Approval"
            value={form.newUserApproval}
            onChange={(event) => updateField("newUserApproval", event.target.value)}
            bg={false}
          />
          <Input
            label="Default Currency"
            value={form.defaultCurrency}
            onChange={(event) => updateField("defaultCurrency", event.target.value)}
            bg={false}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Payout"
            value={form.minimumPayout}
            onChange={(event) => updateField("minimumPayout", event.target.value)}
            bg={false}
          />
          <Input
            label="Job Expiration Days"
            value={form.jobExpirationDays}
            onChange={(event) => updateField("jobExpirationDays", event.target.value)}
            bg={false}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Textarea
            label="Platform Notification"
            value={form.platformNotification}
            onChange={(event) => updateField("platformNotification", event.target.value)}
            bg={false}
            className="min-h-[140px]"
          />
          <Textarea
            label="Terms of Service"
            value={form.termsOfService}
            onChange={(event) => updateField("termsOfService", event.target.value)}
            bg={false}
            className="min-h-[140px]"
          />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="danger" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </section>
    </div>
  );
}
