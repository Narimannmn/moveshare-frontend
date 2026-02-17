import { useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { Ban, ShieldCheck } from "lucide-react";

import { Button, Dialog, DialogContent, Input } from "@/shared/ui";

export const Route = createFileRoute("/(app)/admin/freeze-company/")({
  component: FreezeCompanyPage,
});

interface CompanyAccessItem {
  id: string;
  company: string;
  owner: string;
  email: string;
  jobs: number;
  complaints: number;
  isFrozen: boolean;
  freezeReason?: string;
}

const initialRows: CompanyAccessItem[] = [
  {
    id: "acc-1",
    company: "TransAtlantic Logistics",
    owner: "John Smith",
    email: "john@transatlantic.com",
    jobs: 18,
    complaints: 0,
    isFrozen: false,
  },
  {
    id: "acc-2",
    company: "Peak Movers",
    owner: "Sasha York",
    email: "sasha@peakmovers.com",
    jobs: 14,
    complaints: 3,
    isFrozen: true,
    freezeReason: "Repeated no-show complaints",
  },
  {
    id: "acc-3",
    company: "NorthStar Freight",
    owner: "Maria Lewis",
    email: "maria@northstarfreight.com",
    jobs: 9,
    complaints: 1,
    isFrozen: false,
  },
];

function FreezeCompanyPage() {
  const [rows, setRows] = useState(initialRows);
  const [selectedRow, setSelectedRow] = useState<CompanyAccessItem | null>(null);
  const [reason, setReason] = useState("");

  const closeDialog = () => {
    setSelectedRow(null);
    setReason("");
  };

  const toggleFreeze = () => {
    if (!selectedRow) {
      return;
    }

    const nextFrozenState = !selectedRow.isFrozen;

    setRows((prev) =>
      prev.map((row) =>
        row.id === selectedRow.id
          ? {
              ...row,
              isFrozen: nextFrozenState,
              freezeReason: nextFrozenState ? reason || "Manual admin action" : undefined,
            }
          : row
      )
    );

    closeDialog();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D8D8D8] rounded-[10px] p-4">
        <h1 className="text-[#202224] text-[24px] font-bold">Freeze Company</h1>
        <p className="text-[#666C72] text-[14px] mt-1">
          Temporarily restrict platform access for companies with policy violations.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link
            to="/admin/review-company"
            className="px-3 py-1.5 rounded-[8px] border border-[#D8D8D8] text-[#202224] text-[14px]"
          >
            Review Company
          </Link>
          <Link
            to="/admin/freeze-company"
            className="px-3 py-1.5 rounded-[8px] bg-[#60A5FA] text-white text-[14px] font-semibold"
          >
            Freeze Company
          </Link>
        </div>
      </div>

      <section className="bg-white border border-[#D8D8D8] rounded-[10px] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6E8EB] flex items-center justify-between">
          <h2 className="text-[#202224] text-[18px] font-bold">Company Access Controls</h2>
          <span className="text-[#90A4AE] text-[12px]">{rows.length} companies</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Company</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Owner</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Email</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Jobs</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Complaints</th>
                <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Status</th>
                <th className="text-right text-[#666C72] text-[12px] px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#EEF1F5]">
                  <td className="px-4 py-3 text-[#202224] text-[14px] font-semibold">
                    {row.company}
                  </td>
                  <td className="px-4 py-3 text-[#202224] text-[14px]">{row.owner}</td>
                  <td className="px-4 py-3 text-[#202224] text-[14px]">{row.email}</td>
                  <td className="px-4 py-3 text-[#202224] text-[14px]">{row.jobs}</td>
                  <td className="px-4 py-3 text-[#202224] text-[14px]">{row.complaints}</td>
                  <td className="px-4 py-3">
                    {row.isFrozen ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#EA4335]">
                        <Ban size={14} /> Frozen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#34A853]">
                        <ShieldCheck size={14} /> Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant={row.isFrozen ? "secondary" : "danger"}
                      size="sm"
                      onClick={() => setSelectedRow(row)}
                    >
                      {row.isFrozen ? "Unfreeze" : "Freeze"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Dialog open={!!selectedRow} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-[520px] p-6" showClose={false}>
          <h3 className="text-[#202224] text-[20px] font-bold">
            {selectedRow?.isFrozen ? "Unfreeze Company" : "Freeze Company"}
          </h3>
          <p className="text-[#666C72] text-[14px] mt-1">
            {selectedRow?.isFrozen
              ? "This company will regain access to posting and claiming jobs."
              : "This company will lose access to posting and claiming jobs until reactivated."}
          </p>

          {selectedRow && !selectedRow.isFrozen && (
            <Input
              label="Freeze reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Violation details"
              className="mt-4"
              bg={false}
            />
          )}

          {selectedRow?.isFrozen && selectedRow.freezeReason && (
            <div className="mt-4 text-[14px] text-[#202224] bg-[#F8F9FA] border border-[#E6E8EB] rounded-[8px] p-3">
              Previous reason: {selectedRow.freezeReason}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 mt-5">
            <Button variant="secondary" size="sm" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant={selectedRow?.isFrozen ? "primary" : "danger"}
              size="sm"
              onClick={toggleFreeze}
            >
              {selectedRow?.isFrozen ? "Confirm Unfreeze" : "Confirm Freeze"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
