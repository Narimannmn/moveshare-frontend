import { createFileRoute } from "@tanstack/react-router";

import { FileText, IdCard } from "lucide-react";

import { useCompanyProfile } from "@/entities/Auth/api";
import type { CompanyProfileResponse } from "@/entities/Auth/schemas";

export const Route = createFileRoute("/(app)/profile/verification/")({
  component: VerificationPage,
});

interface DocumentData {
  id: string;
  type: CompanyProfileResponse["documents"][number]["document_type"];
  name: string;
  status: CompanyProfileResponse["documents"][number]["status"];
  icon: "file" | "id-card";
  rejectionReason?: string | null;
}

const requiredDocuments: Omit<DocumentData, "id" | "status" | "rejectionReason">[] = [
  {
    type: "mc_license",
    name: "MC License",
    icon: "file",
  },
  {
    type: "dot_certificate",
    name: "DOT Certificate",
    icon: "file",
  },
  {
    type: "insurance_certificate",
    name: "Insurance Certificate",
    icon: "file",
  },
  {
    type: "business_license",
    name: "Business License",
    icon: "id-card",
  },
];

const statusBadgeStyles: Record<DocumentData["status"], string> = {
  approved: "text-green-600 bg-green-50",
  pending: "text-amber-600 bg-amber-50",
  rejected: "text-red-600 bg-red-50",
};

const statusLabels: Record<DocumentData["status"], string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

function DocumentCard({ document }: { document: DocumentData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        {document.icon === "file" ? (
          <FileText className="w-8 h-8 text-blue-500" />
        ) : (
          <IdCard className="w-8 h-8 text-blue-500" />
        )}
      </div>

      {/* Document name */}
      <h3 className="text-base font-semibold text-[#202224] mb-2 text-center">{document.name}</h3>

      {/* Status badge */}
      <span
        className={`text-sm font-medium px-3 py-1 rounded ${statusBadgeStyles[document.status]}`}
      >
        {statusLabels[document.status]}
      </span>

      {document.status === "rejected" && document.rejectionReason ? (
        <p className="mt-3 text-xs text-red-600 text-center">{document.rejectionReason}</p>
      ) : null}
    </div>
  );
}

function VerificationPage() {
  const { data: profile } = useCompanyProfile();
  const apiDocuments = profile?.documents ?? [];

  const documents: DocumentData[] = requiredDocuments.map((requiredDoc) => {
    const found = apiDocuments.find((doc) => doc.document_type === requiredDoc.type);
    return {
      id: found?.id ?? requiredDoc.type,
      type: requiredDoc.type,
      name: requiredDoc.name,
      status: found?.status ?? "pending",
      icon: requiredDoc.icon,
      rejectionReason: found?.rejection_reason,
    };
  });

  const isVerified = documents.every((document) => document.status === "approved");

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Account Verification</h2>

      <div className="border-t border-gray-200 pt-6">
        {/* Verified Account Badge */}
        <div
          className={`rounded-lg px-4 py-3 mb-6 inline-block ${
            isVerified ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
          }`}
        >
          <span className={`font-medium text-sm ${isVerified ? "text-green-700" : "text-amber-700"}`}>
            {isVerified ? "Verified Account" : "Verification In Progress"}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-8">
          {isVerified
            ? "Your account has been fully verified. This helps build trust with other companies on MoveShare."
            : "Your documents are under review. Statuses below are synced from your uploaded verification documents."}
        </p>

        {/* Required Documents Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            <h3 className="text-lg font-semibold text-[#202224]">Required Documents</h3>
          </div>

          {/* Documents grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
