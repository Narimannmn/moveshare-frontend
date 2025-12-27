import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, DollarSign, Truck, Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const Route = createFileRoute("/(app)/dashboard/")({
  component: DashboardPage,
});

interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    id: "active-jobs",
    title: "Active Jobs",
    value: 0,
    icon: <Briefcase size={24} />,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: "monthly-earnings",
    title: "Monthly Earnings",
    value: 0,
    icon: <DollarSign size={24} />,
    bgColor: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    id: "truck-utilization",
    title: "Truck Utilizatio",
    value: 0,
    icon: <Truck size={24} />,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-500",
  },
  {
    id: "rating",
    title: "Your Rating",
    value: 0,
    icon: <Star size={24} />,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-500",
  },
];

const monthlyEarningsData = [
  { month: "Jan", earnings: 6500 },
  { month: "Feb", earnings: 7200 },
  { month: "Mar", earnings: 7800 },
  { month: "Apr", earnings: 7800 },
  { month: "May", earnings: 7800 },
  { month: "Jun", earnings: 8500 },
];

const jobStatusData = [
  { name: "Completed", value: 35, color: "#10B981" },
  { name: "In Progress", value: 25, color: "#60A5FA" },
  { name: "Scheduled", value: 20, color: "#A78BFA" },
  { name: "Available", value: 20, color: "#FBBF24" },
];

type TimeRange = "monthly" | "quarterly" | "annual";

function StatCard({ stat }: { stat: StatCard }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
      <div
        className={`w-14 h-14 rounded-lg ${stat.bgColor} flex items-center justify-center shrink-0`}
      >
        <div className={stat.iconColor}>{stat.icon}</div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
        <p className="text-3xl font-bold text-[#202224]">{stat.value}</p>
      </div>
    </div>
  );
}

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
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Earnings"]}
          />
          <Bar dataKey="earnings" fill="#60A5FA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function JobStatusChart() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-[#202224] mb-6">
        Job Status Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={jobStatusData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {jobStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry: any) => (
              <span className="text-sm text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyStateCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-[#202224] mb-6">{title}</h2>
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-[#202224] mb-2">
          No {title.toLowerCase()}
        </h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#202224] mb-2">
          Welcome back, John!
        </h1>
        <p className="text-gray-500">
          Here's your logistics dashboard for today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

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
        <EmptyStateCard
          title="Messages"
          description="You don't have any messages yet."
        />
      </div>
    </div>
  );
}
