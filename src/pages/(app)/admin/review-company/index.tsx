import { useMemo, useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Button, Dialog, DialogContent, Input, Textarea } from "@/shared/ui";

export const Route = createFileRoute("/(app)/admin/review-company/")({
  component: ReviewCompanyPage,
});

type ReviewStatus = "pending" | "approved" | "rejected";

interface CompanyDocument {
  name: string;
  status: "approved" | "pending";
}

interface CompanyReviewItem {
  id: string;
  company: string;
  owner: string;
  email: string;
  state: string;
  submittedAt: string;
  jobsPosted: number;
  rating: number;
  status: ReviewStatus;
  about: string;
  documents: CompanyDocument[];
}

const initialCompanies: CompanyReviewItem[] = [
  {
    id: "cmp-1001",
    company: "TransAtlantic Logistics",
    owner: "John Smith",
    email: "john@transatlantic.com",
    state: "Illinois",
    submittedAt: "2026-02-05",
    jobsPosted: 18,
    rating: 4.8,
    status: "pending",
    about: "Specialized in midwest furniture and equipment relocation.",
    documents: [
      { name: "MC License", status: "approved" },
      { name: "DOT Certificate", status: "approved" },
      { name: "Insurance Certificate", status: "pending" },
      { name: "Business License", status: "approved" },
    ],
  },
  {
    id: "cmp-1002",
    company: "NorthStar Freight",
    owner: "Maria Lewis",
    email: "maria@northstarfreight.com",
    state: "Texas",
    submittedAt: "2026-02-08",
    jobsPosted: 9,
    rating: 4.4,
    status: "pending",
    about: "Regional carrier focused on same-week corporate moves.",
    documents: [
      { name: "MC License", status: "approved" },
      { name: "DOT Certificate", status: "approved" },
      { name: "Insurance Certificate", status: "approved" },
      { name: "Business License", status: "approved" },
    ],
  },
  {
    id: "cmp-1003",
    company: "Peak Movers",
    owner: "Sam Carter",
    email: "sam@peakmovers.com",
    state: "Florida",
    submittedAt: "2026-02-09",
    jobsPosted: 4,
    rating: 4.1,
    status: "pending",
    about: "Cross-state carrier with dedicated flatbed capacity.",
    documents: [
      { name: "MC License", status: "approved" },
      { name: "DOT Certificate", status: "approved" },
      { name: "Insurance Certificate", status: "pending" },
      { name: "Business License", status: "pending" },
    ],
  },
];

function ReviewCompanyPage() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState(initialCompanies[0]?.id ?? "");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const selectedCompany = useMemo(
    () => companies.find((company) => company.id === selectedCompanyId),
    [companies, selectedCompanyId]
  );

  const updateStatus = (status: ReviewStatus) => {
    if (!selectedCompanyId) {
      return;
    }

    setCompanies((prev) =>
      prev.map((company) => (company.id === selectedCompanyId ? { ...company, status } : company))
    );
  };

  const handleApprove = () => {
    updateStatus("approved");
  };

  const handleReject = () => {
    updateStatus("rejected");
    setRejectReason("");
    setShowRejectDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D8D8D8] rounded-[10px] p-4">
        <h1 className="text-[#202224] text-[24px] font-bold">Review Company</h1>
        <p className="text-[#666C72] text-[14px] mt-1">
          Validate company documents and approve or reject onboarding requests.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Link
            to="/admin/review-company"
            className="px-3 py-1.5 rounded-[8px] bg-[#60A5FA] text-white text-[14px] font-semibold"
          >
            Review Company
          </Link>
          <Link
            to="/admin/freeze-company"
            className="px-3 py-1.5 rounded-[8px] border border-[#D8D8D8] text-[#202224] text-[14px]"
          >
            Freeze Company
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-6">
        <section className="bg-white border border-[#D8D8D8] rounded-[10px] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E6E8EB] flex items-center justify-between">
            <h2 className="text-[#202224] text-[18px] font-bold">Pending Companies</h2>
            <span className="text-[#90A4AE] text-[12px]">{companies.length} records</span>
          </div>

          <div className="overflow-auto">
            <table className="w-full min-w-[780px]">
              <thead className="bg-[#F8F9FA]">
                <tr>
                  <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Company</th>
                  <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Owner</th>
                  <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Email</th>
                  <th className="text-left text-[#666C72] text-[12px] px-4 py-3">State</th>
                  <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Submitted</th>
                  <th className="text-left text-[#666C72] text-[12px] px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => setSelectedCompanyId(company.id)}
                    className={
                      company.id === selectedCompanyId
                        ? "bg-[#E6F2FF] cursor-pointer"
                        : "hover:bg-[#F8F9FA] cursor-pointer"
                    }
                  >
                    <td className="px-4 py-3 text-[#202224] text-[14px] font-semibold">
                      {company.company}
                    </td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">{company.owner}</td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">{company.email}</td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">{company.state}</td>
                    <td className="px-4 py-3 text-[#202224] text-[14px]">{company.submittedAt}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={company.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white border border-[#D8D8D8] rounded-[10px] p-4 space-y-4">
          <h2 className="text-[#202224] text-[18px] font-bold">Company Profile</h2>

          {selectedCompany ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Company" value={selectedCompany.company} readOnly bg={false} />
                <Input label="Owner" value={selectedCompany.owner} readOnly bg={false} />
                <Input label="Email" value={selectedCompany.email} readOnly bg={false} />
                <Input label="State" value={selectedCompany.state} readOnly bg={false} />
                <Input
                  label="Jobs Posted"
                  value={String(selectedCompany.jobsPosted)}
                  readOnly
                  bg={false}
                />
                <Input label="Rating" value={String(selectedCompany.rating)} readOnly bg={false} />
              </div>

              <Textarea
                label="About"
                value={selectedCompany.about}
                readOnly
                bg={false}
                className="resize-none"
              />

              <div>
                <p className="text-[#202224] text-[14px] font-semibold mb-2">
                  Verification Documents
                </p>
                <div className="space-y-2">
                  {selectedCompany.documents.map((document) => (
                    <div
                      key={document.name}
                      className="flex items-center justify-between bg-[#F8F9FA] border border-[#E6E8EB] rounded-[8px] px-3 py-2"
                    >
                      <span className="text-[#202224] text-[14px]">{document.name}</span>
                      <span
                        className={
                          document.status === "approved"
                            ? "text-[#34A853] text-[12px] font-semibold"
                            : "text-[#F5A623] text-[12px] font-semibold"
                        }
                      >
                        {document.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="danger" size="sm" onClick={() => setShowRejectDialog(true)}>
                  Reject
                </Button>
                <Button variant="primary" size="sm" onClick={handleApprove}>
                  Approve
                </Button>
              </div>
            </>
          ) : (
            <p className="text-[#666C72] text-[14px]">Select a company to review details.</p>
          )}
        </section>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-[520px] p-6" showClose={false}>
          <h3 className="text-[#202224] text-[20px] font-bold">Reject Company</h3>
          <p className="text-[#666C72] text-[14px] mt-1">
            Add rejection reason. This note will be visible to the company.
          </p>
          <Textarea
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            placeholder="Missing insurance certificate and business registration details."
            className="mt-4"
          />
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button variant="secondary" size="sm" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleReject}>
              Confirm Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusPill({ status }: { status: ReviewStatus }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#34A853]">
        <CheckCircle2 size={14} /> Approved
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#EA4335]">
        <XCircle size={14} /> Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#F5A623]">
      <Clock3 size={14} /> Pending
    </span>
  );
}
