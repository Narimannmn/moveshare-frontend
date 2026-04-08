import { useState } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";

import { type CompanyVerificationStatus, useCompanies } from "@/entities/Company";

import { Button } from "@/shared/ui";

export const Route = createFileRoute("/(app)/companies/")({
  component: CompaniesPage,
});

const statusTabs: Array<{ id: CompanyVerificationStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "approved", label: "Approved" },
  { id: "pending", label: "Pending" },
  { id: "rejected", label: "Rejected" },
];

const statusStyles: Record<CompanyVerificationStatus, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<CompanyVerificationStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function CompaniesPage() {
  const [activeFilter, setActiveFilter] = useState<CompanyVerificationStatus | "all">("all");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading, isError, error } = useCompanies({
    status: activeFilter === "all" ? undefined : activeFilter,
    offset,
    limit,
  });

  const companies = data?.companies ?? [];
  const total = data?.total ?? 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#202224]">Companies</h1>
        <p className="text-sm text-gray-500 mt-1">Manage registered companies, review applications, and monitor activity.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex gap-6">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveFilter(tab.id); setOffset(0); }}
                className={`pb-3 pt-3 text-sm font-medium transition-colors relative ${
                  activeFilter === tab.id ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {activeFilter === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400">{total} companies</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Company Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Joined</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#202224]">Jobs Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
              )}
              {isError && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-red-500">Failed to load: {error?.message}</td></tr>
              )}
              {!isLoading && !isError && companies.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No companies found</td></tr>
              )}
              {!isLoading && !isError && companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      to="/companies/$id"
                      params={{ id: company.id }}
                      className="text-sm font-semibold text-[#60A5FA] hover:underline"
                    >
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(company.joined_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyles[company.status]}`}>
                      {statusLabels[company.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{company.orders_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setOffset(Math.max(0, offset - limit))} disabled={currentPage <= 1}>Previous</Button>
              <Button variant="secondary" size="sm" onClick={() => setOffset(offset + limit)} disabled={currentPage >= totalPages}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
