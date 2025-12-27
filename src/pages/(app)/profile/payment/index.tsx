import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Landmark, Plus } from "lucide-react";
import { Button } from "@/shared/ui/Button/Button";

export const Route = createFileRoute("/(app)/profile/payment/")({
  component: PaymentSettingsPage,
});

interface BankAccount {
  id: number;
  accountNumber: string;
  bankName: string;
  accountType: string;
  routingNumber: string;
  isDefault: boolean;
}

const mockAccounts: BankAccount[] = [
  {
    id: 1,
    accountNumber: "**** **** 1234",
    bankName: "Chase Bank",
    accountType: "Business Checking",
    routingNumber: "*****0720",
    isDefault: true,
  },
  {
    id: 2,
    accountNumber: "**** **** 1234",
    bankName: "Chase Bank",
    accountType: "Business Checking",
    routingNumber: "*****0720",
    isDefault: false,
  },
];

function BankAccountCard({ account }: { account: BankAccount }) {
  const handleEdit = () => {
    console.log("Edit account", account.id);
  };

  const handleRemove = () => {
    console.log("Remove account", account.id);
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Default badge */}
      {account.isDefault && (
        <div className="absolute top-4 right-4">
          <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded">
            DEFAULT
          </span>
        </div>
      )}

      {/* Header with icon and title */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
          <Landmark className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#202224]">
            Bank Account
          </h3>
          <p className="text-sm text-gray-500">{account.accountNumber}</p>
        </div>
      </div>

      {/* Account details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Bank Name:</span>
          <span className="text-sm font-medium text-[#202224]">
            {account.bankName}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Account Type:</span>
          <span className="text-sm font-medium text-[#202224]">
            {account.accountType}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Routing Number:</span>
          <span className="text-sm font-medium text-[#202224]">
            {account.routingNumber}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleEdit} className="flex-1">
          Edit
        </Button>
        <Button variant="secondary" onClick={handleRemove} className="flex-1">
          Remove
        </Button>
      </div>
    </div>
  );
}

function PaymentSettingsPage() {
  const [accounts] = useState<BankAccount[]>(mockAccounts);

  const handleAddPaymentMethod = () => {
    console.log("Add payment method clicked");
    // TODO: Open modal or navigate to add payment method form
  };

  return (
    <div>
      {/* Header with title and Add button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#202224]">
          Payment Management
        </h2>
        <Button
          variant="primary"
          onClick={handleAddPaymentMethod}
          className="gap-2"
        >
          <Plus size={20} />
          Add Payment Method
        </Button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        {/* Bank account cards grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <BankAccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}
