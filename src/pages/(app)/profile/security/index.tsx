import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/shared/ui/Button/Button";

export const Route = createFileRoute("/(app)/profile/security/")({
  component: SecurityPage,
});

function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleChangePassword = () => {
    console.log("Change password clicked");
    // TODO: Open password change modal or navigate to password change page
  };

  const handleViewAllSessions = () => {
    console.log("View all sessions clicked");
    // TODO: Navigate to active sessions page or open modal
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled((prev) => !prev);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Security Settings</h2>

      <div className="border-t border-gray-200">
        {/* Password Section */}
        <div className="flex items-center justify-between py-5 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#202224] mb-1">Password</h3>
            <p className="text-sm text-gray-500">Last changed: 3 months ago</p>
          </div>
          <Button variant="secondary" onClick={handleChangePassword}>
            Change Password
          </Button>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="flex items-center justify-between py-5 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#202224] mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-blue-500 mb-1">Active</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>

          {/* Toggle Switch */}
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
        </div>

        {/* Active Sessions Section */}
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
    </div>
  );
}
