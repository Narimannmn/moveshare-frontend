import { createFileRoute } from "@tanstack/react-router";

import { FileText, IdCard } from "lucide-react";

export const Route = createFileRoute("/(app)/profile/verification/")({
  component: VerificationPage,
});

interface DocumentData {
  id: number;
  name: string;
  status: "approved" | "pending" | "rejected";
  icon: "file" | "id-card";
}

const mockDocuments: DocumentData[] = [
  {
    id: 1,
    name: "MC License",
    status: "approved",
    icon: "file",
  },
  {
    id: 2,
    name: "DOT Certificate",
    status: "approved",
    icon: "file",
  },
  {
    id: 3,
    name: "Insurance Certificate",
    status: "approved",
    icon: "file",
  },
  {
    id: 4,
    name: "Business License",
    status: "approved",
    icon: "id-card",
  },
];

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
      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded">
        Approved
      </span>
    </div>
  );
}

function VerificationPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#202224] mb-6">Account Verification</h2>

      <div className="border-t border-gray-200 pt-6">
        {/* Verified Account Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6 inline-block">
          <span className="text-green-700 font-medium text-sm">Verified Account</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-8">
          Your account has been fully verified. This helps build trust with other companies on
          MoveShare.
        </p>

        {/* Required Documents Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            <h3 className="text-lg font-semibold text-[#202224]">Required Documents</h3>
          </div>

          {/* Documents grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
