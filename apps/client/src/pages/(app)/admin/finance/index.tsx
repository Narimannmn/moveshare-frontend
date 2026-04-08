import { useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { ArrowDownToLine, ArrowUpToLine, Landmark } from "lucide-react";

import { Button, Dialog, DialogContent } from "@/shared/ui";

export const Route = createFileRoute("/(app)/admin/finance/")({
  component: FinancePage,
});

type TransactionStatus = "pending" | "completed" | "failed";

interface FinanceRow {
  id: string;
  company: string;
  type: "payout" | "deposit";
  date: string;
  amount: number;
  commission: number;
  status: TransactionStatus;
}

const financeRows: FinanceRow[] = [
  {
    id: "fin-1001",
    company: "TransAtlantic Logistics",
    type: "deposit",
    date: "2026-02-12",
    amount: 1850,
    commission: 139,
    status: "completed",
  },
  {
    id: "fin-1002",
    company: "Peak Movers",
    type: "payout",
    date: "2026-02-13",
    amount: 1420,
    commission: 113,
    status: "pending",
  },
  {
    id: "fin-1003",
    company: "NorthStar Freight",
    type: "deposit",
    date: "2026-02-13",
    amount: 2200,
    commission: 154,
    status: "completed",
  },
  {
    id: "fin-1004",
    company: "Coastal Warehousing",
    type: "payout",
    date: "2026-02-14",
    amount: 980,
    commission: 64,
    status: "failed",
  },
];

function FinancePage() {
  const [selectedRow, setSelectedRow] = useState<FinanceRow | null>(null);

  const metrics = useMemo(() => {
    const totalVolume = financeRows.reduce((sum, row) => sum + row.amount, 0);
    const pendingPayout = financeRows
      .filter((row) => row.type === "payout" && row.status === "pending")
      .reduce((sum, row) => sum + row.amount, 0);
    const totalCommission = financeRows.reduce((sum, row) => sum + row.commission, 0);

    return {
      totalVolume,
      pendingPayout,
      totalCommission,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D8D8D8] rounded-[10px] p-4">
        <h1 className="text-[#202224] text-[24px] font-bold">Finance</h1>
        <p className="text-[#666C72] text-[14px] mt-1">
          Review deposits, payouts, and commission transactions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceMetric
          title="Total Volume"
          value={`$${metrics.totalVolume.toLocaleString()}`}
          icon={<Landmark size={18} />}
          iconClassName="bg-[#E6F2FF] text-[#60A5FA]"
        />
        <FinanceMetric
          title="Pending Payout"
          value={`$${metrics.pendingPayout.toLocaleString()}`}
          icon={<ArrowDownToLine size={18} />}
          iconClassName="bg-[#FFF8C0] text-[#F5A623]"
        />
        <FinanceMetric
          title="Commission Collected"
          value={`$${metrics.totalCommission.toLocaleString()}`}
          icon={<ArrowUpToLine size={18} />}
          iconClassName="bg-[#E6F7EC] text-[#34A853]"
        />
      </div>

      <section className="bg-white border border-[#D8D8D8] rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6E8EB] flex items-center justify-between">
          <h2 className="text-[#202224] text-[18px] font-bold">Transactions</h2>
          <span className="text-[#90A4AE] text-[12px]">{financeRows.length} records</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Company</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Type</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Date</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Amount</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Commission</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Status</th>
                <th className="text-right text-[#666C72] text-[12px] px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {financeRows.map((row) => (
                <tr key={row.id} className="border-t border-[#EEF1F5]">
                  <td className="px-4 py-3 text-[#202224] text-[14px] font-semibold">
                    {row.company}
                  </td>
                  <td className="px-4 py-3 text-[#202224] text-[14px] capitalize">{row.type}</td>
                  <td className="px-4 py-3 text-[#202224] text-[14px]">{row.date}</td>
                  <td className="px-4 py-3 text-[#202224] text-[14px]">
                    ${row.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[#34A853] text-[14px]">
                    ${row.commission.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="secondary" size="sm" onClick={() => setSelectedRow(row)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)}>
        <DialogContent className="max-w-[520px] p-6" showClose={false}>
          <h3 className="text-[#202224] text-[20px] font-bold">Transaction Details</h3>
          {selectedRow && (
            <div className="space-y-3 mt-4">
              <DetailRow label="Company" value={selectedRow.company} />
              <DetailRow label="Transaction ID" value={selectedRow.id} />
              <DetailRow label="Type" value={selectedRow.type} />
              <DetailRow label="Date" value={selectedRow.date} />
              <DetailRow label="Amount" value={`$${selectedRow.amount.toLocaleString()}`} />
              <DetailRow label="Commission" value={`$${selectedRow.commission.toLocaleString()}`} />
              <DetailRow label="Status" value={selectedRow.status} />
            </div>
          )}
          <div className="flex items-center justify-end mt-5">
            <Button variant="primary" size="sm" onClick={() => setSelectedRow(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FinanceMetric({
  title,
  value,
  icon,
  iconClassName,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <article className="bg-white border border-[#D8D8D8] rounded-[10px] p-4 flex items-center gap-3">
      <div className={`size-10 rounded-[8px] flex items-center justify-center ${iconClassName}`}>
        {icon}
      </div>
      <div>
        <p className="text-[#666C72] text-[12px]">{title}</p>
        <p className="text-[#202224] text-[20px] font-bold">{value}</p>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  if (status === "completed") {
    return <span className="text-[#34A853] text-[12px] font-semibold">Completed</span>;
  }

  if (status === "failed") {
    return <span className="text-[#EA4335] text-[12px] font-semibold">Failed</span>;
  }

  return <span className="text-[#F5A623] text-[12px] font-semibold">Pending</span>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEF1F5] pb-2">
      <span className="text-[#666C72] text-[14px]">{label}</span>
      <span className="text-[#202224] text-[14px] font-semibold">{value}</span>
    </div>
  );
}
