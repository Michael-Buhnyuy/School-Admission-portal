import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Download, Users, CheckCircle, XCircle, Clock, TrendingUp, PieChart as PieChartIcon, BarChart as BarChartIcon, FileText, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

const Reports: React.FC = () => {
  const { admin, fetchApplications, applications } = useAuth();
  const [dateRange, setDateRange] = useState("30");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportNote, setReportNote] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const API_BASE = "http://localhost:8080/api";

  useEffect(() => {
    if (admin) {
      fetchDashboardData();
    }
  }, [admin]);

  const fetchDashboardData = async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!dashboardData) {
      return {
        totalApplications: 0,
        pendingApplications: 0,
        underReviewApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        applicationsPerProgram: [],
      };
    }

    const apps = dashboardData.applications || {};
    return {
      totalApplications: apps.total || 0,
      pendingApplications: apps.pending || 0,
      underReviewApplications: apps.under_review || 0,
      approvedApplications: apps.approved || 0,
      rejectedApplications: apps.rejected || 0,
      applicationsPerProgram: apps.by_program || [],
    };
  }, [dashboardData]);

  const officerPerformance = useMemo(() => {
    if (!dashboardData?.activity) return [];
    const activity = dashboardData.activity.recent_activity || [];
    
    const officerStats: Record<string, { name: string; total: number; approved: number; rejected: number }> = {};
    
    activity.forEach((act: any) => {
      if (act.action === 'status_change' && act.admin_name && act.description) {
        const officerId = act.admin_id?.toString() || "";
        if (!officerStats[officerId]) {
          officerStats[officerId] = {
            name: act.admin_name || "Unknown",
            total: 0,
            approved: 0,
            rejected: 0,
          };
        }
        officerStats[officerId].total++;
        if (act.description.includes("approved")) {
          officerStats[officerId].approved++;
        } else if (act.description.includes("rejected")) {
          officerStats[officerId].rejected++;
        }
      }
    });

    return Object.entries(officerStats).map(([officerId, data]) => ({
      officerId,
      ...data,
    }));
  }, [dashboardData]);

  const statusData = [
    { name: "Pending", value: stats.pendingApplications },
    { name: "Under Review", value: stats.underReviewApplications },
    { name: "Approved", value: stats.approvedApplications },
    { name: "Rejected", value: stats.rejectedApplications },
  ].filter(item => item.value > 0);

  const monthlyData = [
    { month: "Jan", applications: 45, approved: 30, rejected: 5 },
    { month: "Feb", applications: 52, approved: 35, rejected: 8 },
    { month: "Mar", applications: 48, approved: 32, rejected: 6 },
    { month: "Apr", applications: 61, approved: 40, rejected: 10 },
    { month: "May", applications: 55, approved: 38, rejected: 7 },
    { month: "Jun", applications: 43, approved: 28, rejected: 4 },
  ];

  const handleSubmitReport = async () => {
    if (!reportNote.trim() || !admin) return;

    setSubmittingReport(true);
    try {
      const response = await fetch(`${API_BASE}/admin/review/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-ID": admin.id.toString(),
        },
        body: JSON.stringify({
          entity_type: "report",
          entity_id: Date.now(),
          description: reportNote,
          action: "review_submitted",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReportNote("");
        alert("Report submitted for review successfully!");
      } else {
        alert(data.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Submit report error:", error);
      alert("Network error");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">View application statistics and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746]"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1d4746] text-white rounded-xl hover:bg-[#1d4746]/90">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.totalApplications, icon: Users, color: "from-blue-500 to-blue-600" },
          { label: "Approved", value: stats.approvedApplications, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
          { label: "Pending", value: stats.pendingApplications, icon: Clock, color: "from-amber-500 to-amber-600" },
          { label: "Rejected", value: stats.rejectedApplications, icon: XCircle, color: "from-red-500 to-red-600" },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{loading ? "..." : stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications by Program */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BarChartIcon className="w-5 h-5 text-[#1d4746]" />
            Applications by Program
          </h2>
          <div className="h-64">
            {stats.applicationsPerProgram.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.applicationsPerProgram}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis stroke="#64748B" fontSize={12} />
                  <YAxis stroke="#64748B" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="#e88418" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-[#1d4746]" />
            Application Status Distribution
          </h2>
          <div className="h-64">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1d4746]" />
          Monthly Application Trends
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} name="Approved" />
              <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={2} name="Rejected" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Officer Performance */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#1d4746]" />
          Officer Performance
        </h2>
        {officerPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Officer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Total Reviewed</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Approved</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Rejected</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Approval Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {officerPerformance.map((officer) => (
                  <tr key={officer.officerId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{officer.name}</td>
                    <td className="px-4 py-3 text-slate-600">{officer.total}</td>
                    <td className="px-4 py-3 text-emerald-600">{officer.approved}</td>
                    <td className="px-4 py-3 text-red-600">{officer.rejected}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {officer.total > 0 ? Math.round((officer.approved / officer.total) * 100) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No officer activity data available yet</p>
          </div>
        )}
      </div>

      {/* Submit Changes for Review */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#1d4746]" />
          Submit Changes for Review
        </h2>
        <p className="text-slate-600 mb-4">
          As an admin, you can submit your work (status changes, document verifications, etc.) for supervisor review.
          This helps maintain quality control and accountability.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Changes Summary</label>
            <textarea
              value={reportNote}
              onChange={(e) => setReportNote(e.target.value)}
              placeholder="Describe the changes you've made for review..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4746] resize-none"
              rows={4}
            />
          </div>
          <button
            onClick={handleSubmitReport}
            disabled={submittingReport || !reportNote.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1d4746] text-white rounded-xl hover:bg-[#1d4746]/90 disabled:opacity-50"
          >
            {submittingReport ? "Submitting..." : (
              <>
                <CheckCircle className="w-4 h-4" />
                Submit for Review
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
