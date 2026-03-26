import { useState } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Briefcase, DollarSign, MessageSquare } from "lucide-react";

import { ConversationListItem, useConversations } from "@/entities/Chat";
import { useMyJobs } from "@/entities/Job";
import { Button, PageHeader } from "@/shared/ui";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/(app)/dashboard/")({
  component: DashboardPage,
});


const monthlyEarningsData: { month: string; earnings: number }[] = [];

const STATUS_COLORS: Record<string, string> = {
  listed: "#FBBF24",
  assigned: "#A78BFA",
  in_progress: "#60A5FA",
  completed: "#10B981",
  cancelled: "#EF4444",
  draft: "#9CA3AF",
};

const STATUS_LABELS: Record<string, string> = {
  listed: "Listed",
  assigned: "Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  draft: "Draft",
};

type TimeRange = "monthly" | "quarterly" | "annual";

function MonthlyEarningsChart({ timeRange }: { timeRange: TimeRange }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#202224]">Monthly Earnings</h2>
        <div className="flex gap-2">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "monthly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "quarterly"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Quarterly
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              timeRange === "annual"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Annual
          </button>
        </div>
      </div>

      {monthlyEarningsData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <div className="relative">
            <div className="size-40 rounded-full border-[12px] border-gray-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="size-10 text-gray-300" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#202224]">No earnings data yet</p>
            <p className="text-xs text-gray-400 mt-1">Complete jobs to see your earnings here</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyEarningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value) => [`$${(value as number).toLocaleString()}`, "Earnings"]}
            />
            <Bar dataKey="earnings" fill="#60A5FA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function JobStatusChart() {
  const { data } = useMyJobs({ offset: 0, limit: 1 });
  const statusCounts = data?.status_counts;

  const chartData = statusCounts
    ? Object.entries(statusCounts)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
          name: STATUS_LABELS[status] ?? status,
          value: count,
          color: STATUS_COLORS[status] ?? "#9CA3AF",
        }))
    : [];

  const hasData = chartData.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-[#202224] mb-6">My Jobs Status</h2>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-[300px] gap-4">
          <div className="relative">
            <div className="size-40 rounded-full border-[12px] border-gray-100" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Briefcase className="size-10 text-gray-300" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#202224]">No jobs posted yet</p>
            <p className="text-xs text-gray-400 mt-1">Post your first job to see status distribution</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value, name) => [`${value} jobs`, name]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function EmptyStateCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-[#202224] mb-6">{title}</h2>
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-[#202224] mb-2">No {title.toLowerCase()}</h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>
    </div>
  );
}

function RecentMessagesCard() {
  const { data: conversations, isLoading } = useConversations();
  const navigate = useNavigate();

  const recentConversations = (conversations ?? [])
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#202224]">Messages</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/chat" })}
        >
          View All
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-sm text-gray-500">Loading messages...</span>
        </div>
      ) : recentConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <MessageSquare className="size-10 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No messages yet</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {recentConversations.map((conversation) => (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              onClick={(id) => navigate({ to: "/chat/$id", params: { id } })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardPage() {
  const [timeRange] = useState<TimeRange>("monthly");

  return (
    <div>
      <PageHeader title="Dashboard" />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MonthlyEarningsChart timeRange={timeRange} />
        <JobStatusChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmptyStateCard
          title="Upcoming Schedule"
          description="You don't have any scheduled events yet."
        />
        <RecentMessagesCard />
      </div>
    </div>
  );
}
