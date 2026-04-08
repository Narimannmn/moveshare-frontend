import { useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { DollarSign, Percent, TrendingUp } from "lucide-react";

import { Button, Dialog, DialogContent, Input } from "@/shared/ui";

export const Route = createFileRoute("/(app)/admin/commission/")({
  component: CommissionPage,
});

interface CommissionRow {
  id: string;
  company: string;
  jobsCompleted: number;
  grossVolume: number;
  commissionRate: number;
}

const initialRows: CommissionRow[] = [
  {
    id: "cm-1",
    company: "TransAtlantic Logistics",
    jobsCompleted: 118,
    grossVolume: 246500,
    commissionRate: 7.5,
  },
  {
    id: "cm-2",
    company: "Peak Movers",
    jobsCompleted: 94,
    grossVolume: 184200,
    commissionRate: 8.0,
  },
  {
    id: "cm-3",
    company: "NorthStar Freight",
    jobsCompleted: 76,
    grossVolume: 163900,
    commissionRate: 7.0,
  },
  {
    id: "cm-4",
    company: "Coastal Warehousing",
    jobsCompleted: 63,
    grossVolume: 121300,
    commissionRate: 6.5,
  },
];

function CommissionPage() {
  const [rows, setRows] = useState(initialRows);
  const [editingRow, setEditingRow] = useState<CommissionRow | null>(null);
  const [nextRate, setNextRate] = useState("7.5");

  const metrics = useMemo(() => {
    const totalGross = rows.reduce((sum, row) => sum + row.grossVolume, 0);
    const totalCommission = rows.reduce(
      (sum, row) => sum + row.grossVolume * (row.commissionRate / 100),
      0
    );
    const averageRate = rows.reduce((sum, row) => sum + row.commissionRate, 0) / rows.length;

    return {
      totalGross,
      totalCommission,
      averageRate,
    };
  }, [rows]);

  const openEditDialog = (row: CommissionRow) => {
    setEditingRow(row);
    setNextRate(String(row.commissionRate));
  };

  const closeEditDialog = () => {
    setEditingRow(null);
    setNextRate("7.5");
  };

  const saveRate = () => {
    if (!editingRow) {
      return;
    }

    const parsedRate = Number(nextRate);

    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return;
    }

    setRows((prev) =>
      prev.map((row) => (row.id === editingRow.id ? { ...row, commissionRate: parsedRate } : row))
    );

    closeEditDialog();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D8D8D8] rounded-[10px] p-4">
        <h1 className="text-[#202224] text-[24px] font-bold">Commission Management</h1>
        <p className="text-[#666C72] text-[14px] mt-1">
          Manage company commission rates and monitor platform earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Gross Volume"
          value={`$${metrics.totalGross.toLocaleString()}`}
          icon={<TrendingUp size={18} />}
        />
        <MetricCard
          title="Total Commission"
          value={`$${Math.round(metrics.totalCommission).toLocaleString()}`}
          icon={<DollarSign size={18} />}
        />
        <MetricCard
          title="Average Commission Rate"
          value={`${metrics.averageRate.toFixed(2)}%`}
          icon={<Percent size={18} />}
        />
      </div>

      <section className="bg-white border border-[#D8D8D8] rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6E8EB] flex items-center justify-between">
          <h2 className="text-[#202224] text-[18px] font-bold">Company Commission Rates</h2>
          <span className="text-[#90A4AE] text-[12px]">{rows.length} companies</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Company</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Jobs Completed</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Gross Volume</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Rate</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Commission</th>
                <th className="text-right text-[#666C72] text-[12px] px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const commissionValue = row.grossVolume * (row.commissionRate / 100);

                return (
                  <tr key={row.id} className="border-t border-[#EEF1F5]">
                    <td className="px-4 py-3 text-[#202224] text-[14px] font-semibold">
                      {row.company}
                    </td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">{row.jobsCompleted}</td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">
                      ${row.grossVolume.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">{row.commissionRate}%</td>
                    <td className="px-4 py-3 text-[#34A853] text-[14px] font-semibold">
                      ${Math.round(commissionValue).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="secondary" size="sm" onClick={() => openEditDialog(row)}>
                        Edit Rate
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={!!editingRow} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="max-w-[420px] p-6" showClose={false}>
          <h3 className="text-[#202224] text-[20px] font-bold">Edit Commission Rate</h3>
          <p className="text-[#666C72] text-[14px] mt-1">
            Set a new commission rate for {editingRow?.company}.
          </p>
          <Input
            label="Commission rate (%)"
            value={nextRate}
            onChange={(event) => setNextRate(event.target.value)}
            bg={false}
            className="mt-4"
          />
          <div className="flex items-center justify-end gap-3 mt-5">
            <Button variant="secondary" size="sm" onClick={closeEditDialog}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={saveRate}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="bg-white border border-[#D8D8D8] rounded-[10px] p-4 flex items-center gap-3">
      <div className="size-10 rounded-[8px] bg-[#E6F2FF] text-[#60A5FA] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[#666C72] text-[12px]">{title}</p>
        <p className="text-[#202224] text-[20px] font-bold">{value}</p>
      </div>
    </article>
  );
}
