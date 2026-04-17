import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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
} from "recharts";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

interface ActivityLog {
  id: number;
  admin_id: number;
  action: string;
  description: string;
  entity_type: string;
  entity_id: number;
  created_at: string;
  first_name?: string;
  last_name?: string;
}

const Dashboard: React.FC = () => {
  const {
    admin,
    stats,
    fetchStats,
    applications,
    fetchApplications,
    isLoading,
  } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (admin) {
      fetchStats();
      fetchApplications();
      // Fetch activities
      fetch("/api/admin/activity", {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setActivities(data.data);
          }
        })
        .catch((err) => console.error("Failed to fetch activities:", err));
    }
  }, [admin]);

  const recentActivities = activities.slice(0, 6);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application_submitted":
        return <FileText className="w-4 h-4" />;
      case "document_uploaded":
        return <FileText className="w-4 h-4" />;
      case "status_change":
        return <Activity className="w-4 h-4" />;
      case "admin_login":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "application_submitted":
        return "bg-blue-100 text-blue-600";
      case "document_uploaded":
        return "bg-purple-100 text-purple-600";
      case "status_change":
        return "bg-amber-100 text-amber-600";
      case "admin_login":
        return "bg-green-100 text-green-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: Users,
      change: "+12%",
      trend: "up",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: Clock,
      change: "+5%",
      trend: "up",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Under Review",
      value: stats.under_review,
      icon: Activity,
      change: "+3%",
      trend: "up",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: CheckCircle,
      change: "+8%",
      trend: "up",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      change: "-2%",
      trend: "down",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
  ];

  // Prepare chart data
  const statusData = [
    { name: "Pending", value: stats.pending },
    { name: "Under Review", value: stats.under_review },
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
  ].filter((item) => item.value > 0);

  // Program distribution from applications
  const programData = applications.reduce(
    (acc: Record<string, number>, app) => {
      const program = app.selected_program || "Other";
      acc[program] = (acc[program] || 0) + 1;
      return acc;
    },
    {},
  );

  const programChartData = Object.entries(programData).map(
    ([program, count]) => ({
      program,
      count,
    }),
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1d4746] to-[#1d4746] rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {admin?.first_name} {admin?.last_name}!
        </h1>
        <p className="text-slate-100">
          Here's what's happening with admissions today.
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {admin?.role_label}
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            ID: {admin?.admin_id}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {isLoading ? "..." : stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className="w-5 h-5 text-[#1d4746]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-slate-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Program */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Applications by Program
          </h2>
          <div className="h-64">
            {programChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={programChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} />
                  <YAxis
                    dataKey="program"
                    type="category"
                    stroke="#64748B"
                    fontSize={12}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="count" fill="#e88418" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                No application data yet
              </div>
            )}
          </div>
        </div>

        {/* Application Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Application Status Distribution
          </h2>
          <div className="h-64 flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400">No application data yet</div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-slate-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Activity
          </h2>
          <button className="text-sm text-[#e88418] hover:text-[#d67610] font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`p-2.5 rounded-xl ${getActivityColor(activity.action)}`}
                >
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {activity.description}
                  </p>
                  <p className="text-sm text-slate-500">
                    {activity.entity_type}: #{activity.entity_id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">
                    {formatTimeAgo(activity.created_at)}
                  </p>
                  {activity.first_name && (
                    <p className="text-xs text-slate-500 mt-1">
                      by {activity.first_name} {activity.last_name}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
