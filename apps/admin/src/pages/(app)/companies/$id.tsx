import { useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Download,
  FileText,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { apiClient } from "@/shared/api/client";
import { Button, Dialog, DialogContent, Textarea } from "@/shared/ui";

export const Route = createFileRoute("/(app)/companies/$id")({
  component: CompanyDetailPage,
});

type CompanyStatus = "approved" | "pending" | "rejected";
type DocumentStatus = "approved" | "pending" | "rejected";
type DocumentType = "mc_license" | "dot_certificate" | "insurance_certificate" | "business_license";

interface CompanyDocument {
  document_type: DocumentType;
  uploaded: boolean;
  status: DocumentStatus | null;
  file_path: string | null;
  file_url: string | null;
}

interface CompanyJob {
  id: string;
  job_type: string;
  bedroom_count: string | null;
  pickup_address: string;
  delivery_address: string;
  pickup_datetime: string;
  payout_amount: string;
  cut_amount: string;
  status: string;
  created_at: string;
}

interface CompanyDetailsResponse {
  id: string;
  name: string;
  mc_license_number: string;
  dot_number: string;
  contact_person: string;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  description: string | null;
  status: CompanyStatus;
  total_jobs_posted: number;
  active_jobs: number;
  completed_jobs: number;
  cancelled_jobs: number;
  total_spend: string;
  documents: CompanyDocument[];
  jobs: CompanyJob[];
}

const documentTypeLabels: Record<DocumentType, string> = {
  mc_license: "MC License",
  dot_certificate: "DOT Certificate",
  insurance_certificate: "Insurance Certificate",
  business_license: "Business License",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function CompanyDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "jobs">("info");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ type: "company" } | { type: "document"; docType: DocumentType } | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: company, isLoading, isError } = useQuery({
    queryKey: ["admin", "company", id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/admin/companies/${id}`);
      return res.data as CompanyDetailsResponse;
    },
  });

  const verificationMutation = useMutation({
    mutationFn: async ({ action, reason }: { action: "approve" | "reject"; reason?: string }) => {
      await apiClient.patch(`/api/v1/admin/companies/${id}/verification`, {
        action,
        rejection_reason: reason,
      });
    },
    onSuccess: (_, { action }) => {
      toast.success(action === "approve" ? "Company approved" : "Company rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "company", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
    },
    onError: () => toast.error("Failed to update verification"),
  });

  const documentMutation = useMutation({
    mutationFn: async ({ docType, action, reason }: { docType: DocumentType; action: "approve" | "reject"; reason?: string }) => {
      await apiClient.patch(`/api/v1/admin/companies/${id}/documents/${docType}/review`, {
        action,
        rejection_reason: reason,
      });
    },
    onSuccess: (_, { action, docType }) => {
      toast.success(`${documentTypeLabels[docType]} ${action === "approve" ? "approved" : "rejected"}`);
      queryClient.invalidateQueries({ queryKey: ["admin", "company", id] });
    },
    onError: () => toast.error("Failed to review document"),
  });

  const handleApproveCompany = () => verificationMutation.mutate({ action: "approve" });

  const handleRejectCompany = () => {
    setRejectTarget({ type: "company" });
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleApproveDocument = (docType: DocumentType) => {
    documentMutation.mutate({ docType, action: "approve" });
  };

  const handleRejectDocument = (docType: DocumentType) => {
    setRejectTarget({ type: "document", docType });
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim() || !rejectTarget) return;

    if (rejectTarget.type === "company") {
      verificationMutation.mutate({ action: "reject", reason: rejectionReason });
    } else {
      documentMutation.mutate({ docType: rejectTarget.docType, action: "reject", reason: rejectionReason });
    }

    setRejectDialogOpen(false);
    setRejectTarget(null);
    setRejectionReason("");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-500">Loading company details...</div>;
  }

  if (isError || !company) {
    return <div className="flex items-center justify-center py-20 text-red-500">Failed to load company</div>;
  }

  const tabs = [
    { id: "info" as const, label: "Company Info" },
    { id: "documents" as const, label: "Documents" },
    { id: "jobs" as const, label: "Jobs History" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/companies" className="text-gray-400 hover:text-[#202224] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#202224]">{company.name}</h1>
              <StatusBadge status={company.status} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {company.status !== "rejected" && (
            <Button variant="danger" size="sm" onClick={handleRejectCompany} disabled={verificationMutation.isPending}>
              Reject
            </Button>
          )}
          {company.status !== "approved" && (
            <Button variant="primary" size="sm" onClick={handleApproveCompany} disabled={verificationMutation.isPending}>
              Approve
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard label="Total Jobs" value={String(company.total_jobs_posted)} />
        <StatCard label="Active" value={String(company.active_jobs)} />
        <StatCard label="Completed" value={String(company.completed_jobs)} />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        <div className="p-6">
          {activeTab === "info" && <CompanyInfoTab company={company} />}
          {activeTab === "documents" && (
            <DocumentsTab
              documents={company.documents}
              onApprove={handleApproveDocument}
              onReject={handleRejectDocument}
              isPending={documentMutation.isPending}
            />
          )}
          {activeTab === "jobs" && <JobsTab jobs={company.jobs} />}
        </div>
      </div>

      {/* Reject dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={(open) => !open && setRejectDialogOpen(false)}>
        <DialogContent className="max-w-[480px] p-6" showClose={false}>
          <h3 className="text-lg font-bold text-[#202224]">
            {rejectTarget?.type === "company"
              ? "Reject Company"
              : rejectTarget?.type === "document"
                ? `Reject ${documentTypeLabels[rejectTarget.docType]}`
                : "Reject"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Please provide a reason for rejection. This will be sent to the company.
          </p>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            bg={false}
            className="mt-4 min-h-[100px]"
          />
          <div className="flex items-center justify-end gap-3 mt-5">
            <Button variant="secondary" size="sm" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReject} disabled={!rejectionReason.trim()}>
              Confirm Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CompanyInfoTab({ company }: { company: CompanyDetailsResponse }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#202224]">General Information</h3>
        <InfoRow icon={<Building2 size={16} />} label="Company Name" value={company.name} />
        <InfoRow icon={<User size={16} />} label="Contact Person" value={company.contact_person} />
        <InfoRow icon={<Phone size={16} />} label="Phone" value={company.phone_number} />
        <InfoRow icon={<MapPin size={16} />} label="Address" value={`${company.address}, ${company.city}, ${company.state} ${company.zip_code}`} />
        {company.description && (
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-1">Description</p>
            <p className="text-sm text-[#202224]">{company.description}</p>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#202224]">License Information</h3>
        <InfoRow icon={<FileText size={16} />} label="MC License Number" value={company.mc_license_number} />
        <InfoRow icon={<FileText size={16} />} label="DOT Number" value={company.dot_number} />
      </div>
    </div>
  );
}

function DocumentsTab({
  documents,
  onApprove,
  onReject,
  isPending,
}: {
  documents: CompanyDocument[];
  onApprove: (docType: DocumentType) => void;
  onReject: (docType: DocumentType) => void;
  isPending: boolean;
}) {
  const [previewDoc, setPreviewDoc] = useState<CompanyDocument | null>(null);

  return (
    <>
      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.document_type} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div
              className={`flex items-center gap-3 ${doc.uploaded && doc.file_url ? "cursor-pointer hover:opacity-80" : ""}`}
              onClick={() => doc.uploaded && doc.file_url && setPreviewDoc(doc)}
            >
              <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#202224]">{documentTypeLabels[doc.document_type]}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {doc.uploaded ? "Click to preview" : "Not uploaded"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {doc.status && <DocumentStatusBadge status={doc.status} />}
              {doc.uploaded && doc.status !== "approved" && (
                <Button variant="primary" size="sm" onClick={() => onApprove(doc.document_type)} disabled={isPending}>Approve</Button>
              )}
              {doc.uploaded && doc.status !== "rejected" && (
                <Button variant="danger" size="sm" onClick={() => onReject(doc.document_type)} disabled={isPending}>Reject</Button>
              )}
            </div>
          </div>
        ))}
        {documents.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No documents uploaded.</p>
        )}
      </div>

      {/* Document Preview Modal */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden rounded-lg" showClose={false}>
          {previewDoc && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
                <h3 className="text-sm font-bold text-[#202224]">{documentTypeLabels[previewDoc.document_type]}</h3>
                <div className="flex items-center gap-2">
                  {previewDoc.file_url && (
                    <a
                      href={previewDoc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#60A5FA] hover:underline"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  )}
                  <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-[#202224] transition-colors" aria-label="Close">
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-gray-100">
                {previewDoc.file_url ? (
                  <iframe
                    src={previewDoc.file_url}
                    className="w-full h-full border-0"
                    title={documentTypeLabels[previewDoc.document_type]}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No preview available
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function JobsTab({ jobs }: { jobs: CompanyJob[] }) {
  const statusStyles: Record<string, string> = {
    listed: "bg-blue-100 text-blue-700",
    assigned: "bg-purple-100 text-purple-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-700",
  };

  const statusLabels: Record<string, string> = {
    listed: "Listed", assigned: "Assigned", in_progress: "In Progress",
    completed: "Completed", cancelled: "Cancelled", draft: "Draft",
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Type</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Route</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Pickup Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Payout</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-700 capitalize">{job.job_type}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <div className="max-w-xs truncate">{job.pickup_address} → {job.delivery_address}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{formatDate(job.pickup_datetime)}</td>
              <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${job.payout_amount}</td>
              <td className="px-6 py-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[job.status] ?? "bg-gray-100 text-gray-700"}`}>
                  {statusLabels[job.status] ?? job.status}
                </span>
              </td>
            </tr>
          ))}
          {jobs.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No jobs found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: CompanyStatus }) {
  const styles: Record<CompanyStatus, string> = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };
  const labels: Record<CompanyStatus, string> = {
    approved: "Approved", pending: "Pending", rejected: "Rejected",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const config: Record<DocumentStatus, { icon: React.ReactNode; className: string; label: string }> = {
    approved: { icon: <CheckCircle size={14} />, className: "text-green-600", label: "Approved" },
    pending: { icon: <Clock size={14} />, className: "text-yellow-600", label: "Pending" },
    rejected: { icon: <XCircle size={14} />, className: "text-red-500", label: "Rejected" },
  };
  const { icon, className, label } = config[status];
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${className}`}>
      {icon} {label}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-bold text-[#202224]">{value}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-[#90A4AE] mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-[#202224]">{value}</p>
      </div>
    </div>
  );
}
