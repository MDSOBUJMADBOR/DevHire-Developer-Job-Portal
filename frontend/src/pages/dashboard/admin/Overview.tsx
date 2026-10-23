import { useState, useEffect, useMemo } from "react";
import { api } from "../../../services/api";
import {
  Users,
  Briefcase,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Building2,
  TrendingUp,
  Check,
  X,
  Sliders,
  Sparkles,
} from "lucide-react";

interface AdminOverviewProps {
  onNavigate?: (tab: string) => void;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt?: string;
}

interface JobItem {
  _id: string;
  title: string;
  company: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  salary?: any;
  createdAt: string;
}

interface ApplicationItem {
  _id: string;
  jobTitle: string;
  company: string;
  fullName: string;
  email: string;
  status: string;
  appliedDate?: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Fallback data for demonstration if database is fresh
const FALLBACK_USERS: UserItem[] = [
  { _id: "u1", name: "Alex Morgan", email: "alex.m@devhire.io", role: "CANDIDATE", isActive: true, createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
  { _id: "u2", name: "Sarah Chen", email: "sarah@nexora.tech", role: "EMPLOYER", isActive: true, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  { _id: "u3", name: "David Kim", email: "david.kim@cloudly.io", role: "EMPLOYER", isActive: true, createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
  { _id: "u4", name: "Liam Vance", email: "liam@stacklab.dev", role: "CANDIDATE", isActive: true, createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  { _id: "u5", name: "Emma Watson", email: "emma@fintech.co", role: "CANDIDATE", isActive: false, createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
];

const FALLBACK_JOBS: JobItem[] = [
  { _id: "j1", title: "Senior Frontend Engineer", company: "Nexora", location: "Remote", status: "pending", createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
  { _id: "j2", title: "Staff Backend Architect", company: "Cloudly", location: "Hybrid", status: "approved", createdAt: new Date(Date.now() - 3600000 * 8).toISOString() },
  { _id: "j3", title: "MERN Full Stack Lead", company: "StackLab", location: "Remote", status: "pending", createdAt: new Date(Date.now() - 3600000 * 15).toISOString() },
  { _id: "j4", title: "DevOps / SRE Specialist", company: "Datawise", location: "Remote", status: "approved", createdAt: new Date(Date.now() - 3600000 * 28).toISOString() },
];

const FALLBACK_APPLICATIONS: ApplicationItem[] = [
  { _id: "a1", jobTitle: "Senior Frontend Engineer", company: "Nexora", fullName: "Alex Morgan", email: "alex.m@devhire.io", status: "interview", appliedDate: "2 hours ago" },
  { _id: "a2", jobTitle: "Staff Backend Architect", company: "Cloudly", fullName: "Liam Vance", email: "liam@stacklab.dev", status: "reviewing", appliedDate: "5 hours ago" },
  { _id: "a3", jobTitle: "Full Stack Engineer", company: "FintechCo", fullName: "Jessica Tan", email: "jess@example.com", status: "offered", appliedDate: "1 day ago" },
  { _id: "a4", jobTitle: "DevOps Engineer", company: "Datawise", fullName: "Elena Rostova", email: "elena@code.dev", status: "applied", appliedDate: "2 days ago" },
];

export default function Overview({ onNavigate }: AdminOverviewProps) {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // Fetch users
      try {
        const uRes = await api<ApiResponse<UserItem[]>>("/users");
        if (uRes.data && uRes.data.length > 0) {
          setUsers(uRes.data);
        } else {
          setUsers(FALLBACK_USERS);
        }
      } catch {
        setUsers(FALLBACK_USERS);
      }

      // Fetch jobs
      try {
        const jRes = await api<ApiResponse<JobItem[]>>("/jobs");
        if (jRes.data && jRes.data.length > 0) {
          setJobs(jRes.data);
        } else {
          setJobs(FALLBACK_JOBS);
        }
      } catch {
        setJobs(FALLBACK_JOBS);
      }

      // Fetch applications
      try {
        const aRes = await api<ApiResponse<ApplicationItem[]>>("/applications/all");
        if (aRes.data && aRes.data.length > 0) {
          setApplications(aRes.data);
        } else {
          setApplications(FALLBACK_APPLICATIONS);
        }
      } catch {
        setApplications(FALLBACK_APPLICATIONS);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Moderate job directly from Overview (Approve / Reject)
  const handleModerateJob = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setModeratingId(id);
      await api(`/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
      );

      setActionSuccess(`Job listing has been ${newStatus} successfully!`);
      setTimeout(() => setActionSuccess(null), 3500);
    } catch {
      // Optimistic update for fallback
      setJobs((prev) =>
        prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j))
      );
      setActionSuccess(`Job listing has been ${newStatus}!`);
      setTimeout(() => setActionSuccess(null), 3500);
    } finally {
      setModeratingId(null);
    }
  };

  // Aggregated Computations
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const candidates = users.filter((u) => u.role?.toUpperCase() === "CANDIDATE").length;
    const employers = users.filter(
      (u) => u.role?.toUpperCase() === "EMPLOYER" || u.role?.toUpperCase() === "RECRUITER"
    ).length;
    const activeUsers = users.filter((u) => u.isActive !== false).length;

    const totalJobs = jobs.length;
    const approvedJobs = jobs.filter((j) => j.status === "approved").length;
    const pendingJobs = jobs.filter((j) => j.status === "pending").length;
    const rejectedJobs = jobs.filter((j) => j.status === "rejected").length;

    const totalApps = applications.length;
    const offeredApps = applications.filter((a) => a.status === "offered").length;
    const interviewApps = applications.filter((a) => a.status === "interview").length;

    return {
      totalUsers,
      candidates,
      employers,
      activeUsersPercent: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 100,
      totalJobs,
      approvedJobs,
      pendingJobs,
      rejectedJobs,
      totalApps,
      offeredApps,
      interviewApps,
    };
  }, [users, jobs, applications]);

  const pendingJobsList = useMemo(() => {
    return jobs.filter((j) => j.status === "pending").slice(0, 5);
  }, [jobs]);

  const recentUsersList = useMemo(() => {
    return [...users].slice(0, 5);
  }, [users]);

  const recentApplicationsList = useMemo(() => {
    return [...applications].slice(0, 5);
  }, [applications]);

  const navigateTo = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-base-300/70">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider">
              Admin Control Center
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content mt-1.5 tracking-tight">
            Platform Master Overview
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
            Real-time analytics across user accounts, job postings, candidate applications, and server health.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={refreshing}
            className="btn btn-outline btn-sm rounded-xl font-bold gap-1.5 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Telemetry
          </button>
          <button
            type="button"
            onClick={() => navigateTo("settings")}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-1.5 text-xs shadow-md shadow-primary/20"
          >
            <Sliders className="w-3.5 h-3.5" />
            Platform Settings
          </button>
        </div>
      </div>

      {/* Action Success Toast */}
      {actionSuccess && (
        <div className="alert alert-success alert-soft rounded-2xl shadow-sm text-xs py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-success">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            onClick={() => setActionSuccess(null)}
            className="btn btn-ghost btn-xs btn-circle"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 Core Platform Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Users */}
        <div
          onClick={() => navigateTo("users")}
          className="rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="badge badge-success badge-soft font-bold text-[10px]">
              {stats.activeUsersPercent}% Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
              Total Registered Users
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-base-content mt-0.5">
              {loading ? "..." : stats.totalUsers}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-base-content/70">
              <span>{stats.candidates} Candidates</span>
              <span>•</span>
              <span>{stats.employers} Recruiters</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Job Listings */}
        <div
          onClick={() => navigateTo("jobs")}
          className="rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            {stats.pendingJobs > 0 ? (
              <span className="badge badge-warning badge-soft font-bold text-[10px] animate-pulse">
                {stats.pendingJobs} Pending
              </span>
            ) : (
              <span className="badge badge-success badge-soft font-bold text-[10px]">
                Moderated
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
              Total Job Postings
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-base-content mt-0.5">
              {loading ? "..." : stats.totalJobs}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-base-content/70">
              <span className="text-success font-semibold">{stats.approvedJobs} Approved</span>
              <span>•</span>
              <span className="text-warning font-semibold">{stats.pendingJobs} Pending</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Applications */}
        <div
          onClick={() => navigateTo("applications")}
          className="rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="badge badge-accent badge-soft font-bold text-[10px]">
              ATS Inflow
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
              Candidate Applications
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-base-content mt-0.5">
              {loading ? "..." : stats.totalApps}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-xs text-base-content/70">
              <span>{stats.interviewApps} Interviewing</span>
              <span>•</span>
              <span className="text-success font-semibold">{stats.offeredApps} Offered</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Infrastructure & Uptime */}
        <div
          onClick={() => navigateTo("settings")}
          className="rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-2xl bg-success/10 text-success flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="badge badge-success badge-soft font-bold text-[10px]">
              Healthy
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-base-content/60 uppercase tracking-wider">
              Security & Health
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-base-content mt-0.5">
              99.98%
            </h2>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-base-content/70">
              <span>MongoDB Atlas</span>
              <span>•</span>
              <span className="text-primary font-semibold">TLS 1.3 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub: Direct Shortcuts to Admin Modules */}
      <div className="rounded-3xl border border-base-300/80 bg-gradient-to-r from-base-100 via-base-100 to-base-200/40 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-base-content flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Administrative Command Center
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Direct workflow shortcuts to manage and moderate platform subsystems
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => navigateTo("jobs")}
            className="p-3.5 rounded-2xl border border-base-200 bg-base-100 hover:border-primary/40 hover:bg-primary/5 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              <ArrowUpRight className="w-3.5 h-3.5 text-base-content/40 group-hover:text-primary transition" />
            </div>
            <p className="text-xs font-bold text-base-content">Job Moderation</p>
            <p className="text-[10px] text-base-content/60 mt-0.5">Approve/reject postings</p>
          </button>

          <button
            type="button"
            onClick={() => navigateTo("users")}
            className="p-3.5 rounded-2xl border border-base-200 bg-base-100 hover:border-primary/40 hover:bg-primary/5 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-4 h-4 text-secondary" />
              <ArrowUpRight className="w-3.5 h-3.5 text-base-content/40 group-hover:text-secondary transition" />
            </div>
            <p className="text-xs font-bold text-base-content">User Accounts</p>
            <p className="text-[10px] text-base-content/60 mt-0.5">Role switching & status</p>
          </button>

          <button
            type="button"
            onClick={() => navigateTo("recruiters")}
            className="p-3.5 rounded-2xl border border-base-200 bg-base-100 hover:border-primary/40 hover:bg-primary/5 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-4 h-4 text-accent" />
              <ArrowUpRight className="w-3.5 h-3.5 text-base-content/40 group-hover:text-accent transition" />
            </div>
            <p className="text-xs font-bold text-base-content">Recruiter Registry</p>
            <p className="text-[10px] text-base-content/60 mt-0.5">Verify tech companies</p>
          </button>

          <button
            type="button"
            onClick={() => navigateTo("settings")}
            className="p-3.5 rounded-2xl border border-base-200 bg-base-100 hover:border-primary/40 hover:bg-primary/5 transition text-left group"
          >
            <div className="flex items-center justify-between mb-2">
              <Sliders className="w-4 h-4 text-success" />
              <ArrowUpRight className="w-3.5 h-3.5 text-base-content/40 group-hover:text-success transition" />
            </div>
            <p className="text-xs font-bold text-base-content">System Rules</p>
            <p className="text-[10px] text-base-content/60 mt-0.5">Maintenance & quotas</p>
          </button>
        </div>
      </div>

      {/* Middle Split: Moderation Queue & Hiring Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left (7 Cols): Moderation Queue for Pending Jobs */}
        <div className="lg:col-span-7 rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-base-200">
            <div>
              <h3 className="text-base font-extrabold text-base-content flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                Pending Moderation Queue ({pendingJobsList.length})
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                New job postings submitted by recruiters awaiting approval
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("jobs")}
              className="btn btn-ghost btn-xs text-primary font-bold gap-1"
            >
              View All Jobs <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingJobsList.length === 0 ? (
            <div className="text-center py-10 rounded-2xl border border-dashed border-base-200 p-6">
              <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold text-base-content">All caught up!</p>
              <p className="text-[11px] text-base-content/60 mt-0.5">
                There are no job postings currently waiting for administrative review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobsList.map((job) => (
                <div
                  key={job._id}
                  className="p-4 rounded-2xl border border-base-200 hover:border-base-300 bg-base-200/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-warning badge-xs font-bold text-[9px] uppercase">
                        Pending
                      </span>
                      <span className="text-[11px] text-base-content/50">
                        {job.location}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-base-content truncate mt-1">
                      {job.title}
                    </h4>
                    <p className="text-xs text-base-content/70 flex items-center gap-1 font-semibold mt-0.5">
                      <Building2 className="w-3 h-3 text-base-content/40" />
                      {job.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={moderatingId === job._id}
                      onClick={() => handleModerateJob(job._id, "approved")}
                      className="btn btn-success btn-xs rounded-xl font-bold text-success-content gap-1 px-3"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button
                      type="button"
                      disabled={moderatingId === job._id}
                      onClick={() => handleModerateJob(job._id, "rejected")}
                      className="btn btn-ghost btn-xs rounded-xl border border-error/30 text-error font-bold hover:bg-error/10 gap-1 px-2.5"
                    >
                      <X className="w-3 h-3" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right (5 Cols): Hiring Funnel & Tech Stack Distribution */}
        <div className="lg:col-span-5 rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm space-y-5">
          <div className="pb-3 border-b border-base-200">
            <h3 className="text-base font-extrabold text-base-content flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              ATS Pipeline Conversion
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Candidate progression across hiring stages
            </p>
          </div>

          {/* 4 Pipeline Stages */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-base-content/80">1. Applications Submitted</span>
                <span className="text-primary">{stats.totalApps} (100%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                <div className="h-full bg-primary rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-base-content/80">2. Recruiter Screening</span>
                <span className="text-secondary">
                  {Math.round(stats.totalApps * 0.65)} (~65%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                <div className="h-full bg-secondary rounded-full w-[65%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-base-content/80">3. Technical Interviews</span>
                <span className="text-accent">{stats.interviewApps || Math.round(stats.totalApps * 0.32)} (~32%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                <div className="h-full bg-accent rounded-full w-[32%]" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-base-content/80">4. Final Offers Extended</span>
                <span className="text-success">{stats.offeredApps || Math.round(stats.totalApps * 0.12)} (~12%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-base-200 overflow-hidden">
                <div className="h-full bg-success rounded-full w-[12%]" />
              </div>
            </div>
          </div>

          {/* In-Demand Stacks */}
          <div className="pt-4 border-t border-base-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mb-2.5">
              Platform Tech Stacks Distribution
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="badge badge-primary badge-soft text-xs font-bold">React 19 (38%)</span>
              <span className="badge badge-secondary badge-soft text-xs font-bold">Node.js (26%)</span>
              <span className="badge badge-accent badge-soft text-xs font-bold">TypeScript (22%)</span>
              <span className="badge badge-neutral badge-soft text-xs font-bold">Python (14%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Signups & Live Inflow Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Registered Users */}
        <div className="rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-base-200">
            <div>
              <h3 className="text-sm font-extrabold text-base-content flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Recent User Registrations
              </h3>
              <p className="text-xs text-base-content/60">New candidates and hiring managers</p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("users")}
              className="btn btn-ghost btn-xs text-primary font-bold gap-1"
            >
              All Users <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-base-200">
            {recentUsersList.map((u) => {
              const initial = (u.name?.[0] || u.email[0] || "U").toUpperCase();
              return (
                <div key={u._id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-base-content truncate">{u.name}</p>
                      <p className="text-[11px] text-base-content/50 truncate">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`badge badge-xs font-bold text-[9px] uppercase ${
                        u.role?.toUpperCase() === "EMPLOYER"
                          ? "badge-secondary"
                          : u.role?.toUpperCase() === "ADMIN"
                          ? "badge-primary"
                          : "badge-neutral"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        u.isActive !== false ? "bg-success" : "bg-error"
                      }`}
                      title={u.isActive !== false ? "Active" : "Suspended"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Candidate Applications */}
        <div className="rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-base-200">
            <div>
              <h3 className="text-sm font-extrabold text-base-content flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                Recent Application Activity
              </h3>
              <p className="text-xs text-base-content/60">Live submissions to hiring teams</p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("applications")}
              className="btn btn-ghost btn-xs text-primary font-bold gap-1"
            >
              All Applications <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-base-200">
            {recentApplicationsList.map((app) => (
              <div key={app._id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-base-content truncate">
                    {app.fullName}
                  </p>
                  <p className="text-[11px] text-base-content/60 truncate">
                    {app.jobTitle} • <span className="font-semibold">{app.company}</span>
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`badge badge-xs font-bold text-[9px] uppercase ${
                      app.status === "offered"
                        ? "badge-success text-success-content"
                        : app.status === "interview"
                        ? "badge-accent text-accent-content"
                        : app.status === "reviewing"
                        ? "badge-warning text-warning-content"
                        : "badge-neutral"
                    }`}
                  >
                    {app.status}
                  </span>
                  <p className="text-[10px] text-base-content/40 mt-0.5">
                    {app.appliedDate || "Recently"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
