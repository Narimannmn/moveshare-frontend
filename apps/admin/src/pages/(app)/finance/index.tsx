import { useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/shared/api/client";
import { Button, Dialog, DialogContent } from "@/shared/ui";

export const Route = createFileRoute("/(app)/finance/")({
  component: FinancePage,
});

interface AdminPayment {
  id: string;
  flow: string;
  status: string;
  amount_cents: number;
  currency: string;
  company_name: string;
  job_id: string | null;
  description: string | null;
  card_brand: string | null;
  card_last4: string | null;
  receipt_url: string | null;
  created_at: string;
}

const statusTabs: Array<{ id: string; label: string }> = [
  { id: "all", label: "All" },
  { id: "succeeded", label: "Succeeded" },
  { id: "pending", label: "Pending" },
  { id: "failed", label: "Failed" },
  { id: "refunded", label: "Refunded" },
];

const statusStyles: Record<string, string> = {
  succeeded: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

const flowLabels: Record<string, string> = {
  claim_job: "Claim Fee",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const toShortJobId = (id: string | null) => {
  if (!id) return "-";
  return `#${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
};

function FinancePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [offset, setOffset] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
  const limit = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "payments", activeTab, offset],
    queryFn: async () => {
      const params: Record<string, string | number> = { offset, limit };
      if (activeTab !== "all") params.status = activeTab;
      const res = await apiClient.get("/api/v1/admin/payments", { params });
      return res.data as { payments: AdminPayment[]; total: number };
    },
  });

  const payments = data?.payments ?? [];
  const total = data?.total ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202224]">Finance</h1>
        <p className="text-sm text-gray-500 mt-1">Review platform payments, claim fees, and refunds.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setOffset(0); }}
                className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Job</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Card</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              )}
              {isError && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-red-500">Failed to load payments</td></tr>
              )}
              {!isLoading && !isError && payments.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No payments found</td></tr>
              )}
              {!isLoading && !isError && payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#202224]">
                    {flowLabels[payment.flow] ?? payment.flow}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.company_name}</td>
                  <td className="px-6 py-4 text-sm text-[#60A5FA]">{toShortJobId(payment.job_id)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">
                    {formatAmount(payment.amount_cents)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {payment.card_brand && payment.card_last4
                      ? `${payment.card_brand} •••• ${payment.card_last4}`
                      : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[payment.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(payment.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages} ({total} payments)</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setOffset(Math.max(0, offset - limit))} disabled={currentPage <= 1}>Previous</Button>
              <Button variant="secondary" size="sm" onClick={() => setOffset(offset + limit)} disabled={currentPage >= totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-[520px] p-6" showClose={false}>
          <h3 className="text-lg font-bold text-[#202224]">Payment Details</h3>
          {selectedPayment && (
            <div className="space-y-3 mt-4">
              <DetailRow label="Type" value={flowLabels[selectedPayment.flow] ?? selectedPayment.flow} />
              <DetailRow label="Company" value={selectedPayment.company_name} />
              <DetailRow label="Job" value={toShortJobId(selectedPayment.job_id)} />
              <DetailRow label="Amount" value={formatAmount(selectedPayment.amount_cents)} />
              <DetailRow label="Currency" value={selectedPayment.currency.toUpperCase()} />
              <DetailRow label="Status" value={selectedPayment.status} />
              <DetailRow label="Card" value={
                selectedPayment.card_brand && selectedPayment.card_last4
                  ? `${selectedPayment.card_brand} •••• ${selectedPayment.card_last4}`
                  : "N/A"
              } />
              <DetailRow label="Description" value={selectedPayment.description ?? "N/A"} />
              <DetailRow label="Date" value={formatDate(selectedPayment.created_at)} />
              {selectedPayment.receipt_url && (
                <div className="pt-2">
                  <a href={selectedPayment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#60A5FA] hover:underline">
                    View Receipt →
                  </a>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end mt-5">
            <Button variant="primary" size="sm" onClick={() => setSelectedPayment(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-[#202224] capitalize">{value}</span>
    </div>
  );
}
