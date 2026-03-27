import { useEffect, useMemo, useState } from "react";

import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { useAppliedJobs } from "@/entities/Job";
import { PageHeader } from "@/shared/ui";
import { ClaimedJobCard, type ClaimedTab } from "@/widgets/ClaimedJobCard";

export const Route = createFileRoute("/(app)/claimed/")({
  component: ClaimedJobsPage,
});

const TABS: { key: ClaimedTab; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "in_transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
];

const TAB_STATUS_MAP: Record<ClaimedTab, string[]> = {
  active: ["assigned", "documents_ready"],
  in_transit: ["in_progress", "in_transit"],
  delivered: ["delivered"],
  completed: ["completed"],
  disputed: ["disputed"],
};

const getTabForStatus = (status: string): ClaimedTab => {
  for (const [tab, statuses] of Object.entries(TAB_STATUS_MAP)) {
    if (statuses.includes(status)) return tab as ClaimedTab;
  }
  return "active";
};

function ClaimedJobsPage() {
  const [activeTab, setActiveTab] = useState<ClaimedTab>("active");

  const { data, isLoading, isError, error } = useAppliedJobs({
    status: "accepted",
    skip: 0,
    limit: 50,
  });

  useEffect(() => {
    if (isError && error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast.error("Failed to Load", { description: `Failed to load claimed jobs: ${msg}` });
    }
  }, [isError, error]);

  const items = data?.items ?? [];

  const tabCounts = useMemo(() => {
    const counts: Record<ClaimedTab, number> = { active: 0, in_transit: 0, delivered: 0, completed: 0, disputed: 0 };
    for (const item of items) {
      counts[getTabForStatus(item.job.status)]++;
    }
    return counts;
  }, [items]);

  const filteredItems = useMemo(() => {
    const statuses = TAB_STATUS_MAP[activeTab];
    return items.filter((item) => statuses.includes(item.job.status));
  }, [items, activeTab]);

  return (
    <div>
      <PageHeader title="Claimed Jobs" />

      <div className="mb-6">
        <div className="flex gap-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                activeTab === tab.key ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}{" "}
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tabCounts[tab.key]}
              </span>
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading claimed jobs...</div>
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">
            Failed to load jobs: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        </div>
      )}

      {!isLoading && !isError && filteredItems.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">
            No {TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} jobs
          </div>
        </div>
      )}

      {!isLoading && !isError && filteredItems.length > 0 && (
        <div className="flex flex-col gap-6">
          {filteredItems.map((item) => (
            <ClaimedJobCard key={item.application.id} item={item} tab={activeTab} />
          ))}
        </div>
      )}
    </div>
  );
}
