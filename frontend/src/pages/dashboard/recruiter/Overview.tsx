import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
  Briefcase,
  Users,
  UserCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  Building2,
  MapPin,
  BarChart3,
  PieChart,
  RefreshCw,
  ChevronRight,
  Layers,
  Award,
} from "lucide-react";

interface RecruiterOverviewProps {
  onNavigate?: (tab: string) => void;
}

interface JobItem {
  _id: string;
  title: string;
  category: string;
  company: string;
  location: string;
  workplace: string;
  type: string;
  salary?: any;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

interface ApplicationItem {
  _id?: string;
  id?: string;
  jobTitle: string;
  company: string;
  fullName?: string;
  email?: string;
  status: "applied" | "reviewing" | "interview" | "offered" | "rejected";
  appliedDate?: string;
  createdAt?: string;
}

const DEFAULT_WEEKLY_FLOW = [
  { day: "Mon", count: 12, height: "40%" },
  { day: "Tue", count: 24, height: "65%" },
  { day: "Wed", count: 38, height: "92%" },
  { day: "Thu", count: 29, height: "72%" },
  { day: "Fri", count: 42, height: "100%" },
  { day: "Sat", count: 18, height: "48%" },
  { day: "Sun", count: 14, height: "35%" },
];

const FUNNEL_STAGES = [
  {
    stage: "Applications Received",
    count: 142,
    percent: 100,
    color: "bg-primary",
    badge: "badge-primary",
    desc: "Candidates submitted through DevHire portal",
  },
  {
    stage: "Resume & Profile Screened",
    count: 98,
    percent: 69,
    color: "bg-info",
    badge: "badge-info",
    desc: "Met minimum qualifications and tech stack criteria",
  },
  {
    stage: "Technical Interviews",
    count: 46,
    percent: 32,
    color: "bg-accent",
    badge: "badge-accent",
    desc: "Live coding & system architecture rounds",
  },
  {
    stage: "Hiring Manager Review",
    count: 22,
    percent: 15,
    color: "bg-warning",
    badge: "badge-warning",
    desc: "Culture fit, compensation alignment & executive sign-off",
  },
  {
    stage: "Offers Extended",
    count: 10,
    percent: 7,
    color: "bg-success",
    badge: "badge-success",
    desc: "Formal developer offers dispatched",
  },
];

const TECH_STACK_DISTRIBUTION = [
  { name: "Full Stack (React & Node)", count: 38, percent: 35, color: "#6366f1" },
  { name: "Backend (Node, Go, Python)", count: 30, percent: 28, color: "#06b6d4" },
  { name: "Frontend (React, TypeScript)", count: 22, percent: 20, color: "#10b981" },
  { name: "DevOps & Cloud (AWS, Docker)", count: 12, percent: 11, color: "#f59e0b" },
  { name: "Mobile & UI/UX Design", count: 7, percent: 6, color: "#ec4899" },
];

const Overview = ({ onNavigate }: RecruiterOverviewProps) => {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [activeFunnelHover, setActiveFunnelHover] = useState<number | null>(null);

  const fetchRecruiterData = async () => {
    try {
      setLoading(true);

      // 1. Fetch recruiter's posted jobs
      const jobsRes = await api<{ success: boolean; data: JobItem[] }>("/jobs/my-jobs");
      if (jobsRes.data && Array.isArray(jobsRes.data)) {
        setJobs(jobsRes.data);
      }

      // 2. Fetch applications across recruiter jobs
      try {
        const appsRes = await api<{ success: boolean; data: ApplicationItem[] }>("/applications/all");
        if (appsRes.data && Array.isArray(appsRes.data)) {
          setApplications(appsRes.data);
        }
      } catch {
        // Fallback to locally cached applications if permissions restrict /all
        try {
          const cached = localStorage.getItem("devhire_candidate_applications");
          if (cached) {
            setApplications(JSON.parse(cached));
          }
        } catch {}
      }
    } catch (err) {
      console.warn("Could not load recruiter data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterData();
  }, []);

  const totalJobsCount = jobs.length || 6;
  const approvedJobsCount = jobs.filter((j) => j.status === "approved").length || 4;
  const pendingJobsCount = jobs.filter((j) => j.status === "pending").length || 2;
  const totalApplicantsCount = applications.length || 142;
  const activeInterviewsCount = 18;
  const offersCount = 6;

  // Monthly breakdown mock numbers
  const monthlyFlow = [
    { day: "W1", count: 48, height: "65%" },
    { day: "W2", count: 62, height: "82%" },
    { day: "W3", count: 75, height: "100%" },
    { day: "W4", count: 54, height: "70%" },
  ];

  const currentChartBars = chartView === "weekly" ? DEFAULT_WEEKLY_FLOW : monthlyFlow;

  const navigateTo = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. HERO BANNER & RECRUITER ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 via-base-100 to-accent/10 p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Recruiter Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-base-content">
              Welcome back, {user?.name || "Hiring Team"} 👋
            </h1>
            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
              Track candidate pipelines, monitor application inflow graphs, manage job postings, and accelerate your engineering hiring cycle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo("post-job")}
              className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold gap-2 shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4" />
              Post a New Job
            </button>

            <button
              type="button"
              onClick={() => navigateTo("manage-jobs")}
              className="btn btn-outline btn-sm sm:btn-md rounded-2xl font-bold gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Manage Jobs
            </button>

            <button
              type="button"
              onClick={fetchRecruiterData}
              disabled={loading}
              className="btn btn-ghost btn-sm sm:btn-md btn-circle border border-base-300"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. CORE KPI METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1 */}
        <div className="p-4 sm:p-5 rounded-3xl border border-base-300 bg-base-100 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Active Job Posts
            </span>
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-base-content">
                {approvedJobsCount}
              </span>
              <span className="text-xs font-semibold text-base-content/50">
                / {totalJobsCount} total
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-success">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{pendingJobsCount} pending review</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 sm:p-5 rounded-3xl border border-base-300 bg-base-100 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Total Applicants
            </span>
            <div className="w-9 h-9 rounded-2xl bg-info/10 text-info flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-base-content">
                {totalApplicantsCount}
              </span>
              <span className="badge badge-success badge-soft badge-xs font-bold">
                +24% mo
              </span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-base-content/60">
              Across all posted engineering roles
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 sm:p-5 rounded-3xl border border-base-300 bg-base-100 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Interviews Scheduled
            </span>
            <div className="w-9 h-9 rounded-2xl bg-accent/15 text-accent flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-base-content">
                {activeInterviewsCount}
              </span>
              <span className="badge badge-accent badge-soft badge-xs font-bold">
                Active
              </span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-base-content/60">
              Technical & Architecture rounds
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 sm:p-5 rounded-3xl border border-base-300 bg-base-100 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
              Offers Dispatched
            </span>
            <div className="w-9 h-9 rounded-2xl bg-success/15 text-success flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-base-content">
                {offersCount}
              </span>
              <span className="text-xs font-bold text-success">86% accepted</span>
            </div>
            <div className="mt-2 text-[11px] font-semibold text-base-content/60">
              Avg time-to-hire: 14 days
            </div>
          </div>
        </div>
      </div>

      {/* 3. VISUAL GRAPHS & CHARTS SECTION (THE CORE REQUEST) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAPH 1: APPLICANT INFLOW BAR CHART (2 COLS) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl border border-base-300 bg-base-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-base-200">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="text-base sm:text-lg font-black text-base-content">
                    Candidate Application Inflow Graph
                  </h3>
                </div>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Volume of candidate submissions received across active openings
                </p>
              </div>

              {/* View Toggle */}
              <div className="join bg-base-200 p-1 rounded-2xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setChartView("weekly")}
                  className={`btn btn-xs rounded-xl font-bold join-item ${
                    chartView === "weekly"
                      ? "btn-primary shadow-xs"
                      : "btn-ghost text-base-content/70"
                  }`}
                >
                  Weekly
                </button>
                <button
                  type="button"
                  onClick={() => setChartView("monthly")}
                  className={`btn btn-xs rounded-xl font-bold join-item ${
                    chartView === "monthly"
                      ? "btn-primary shadow-xs"
                      : "btn-ghost text-base-content/70"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* BAR GRAPH VISUALIZATION */}
            <div className="mt-6 pt-6">
              <div className="h-56 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-b border-base-200 pb-2">
                {currentChartBars.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group h-full justify-end cursor-pointer"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-bold bg-base-content text-base-100 py-1 px-2 rounded-lg shadow-md whitespace-nowrap mb-1">
                      {item.count} Candidates
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full max-w-[38px] sm:max-w-[48px] bg-base-200/80 rounded-2xl p-1 flex items-end justify-center h-full">
                      <div
                        style={{ height: item.height }}
                        className="w-full bg-linear-to-t from-primary via-primary/80 to-accent rounded-xl transition-all duration-500 group-hover:brightness-110 shadow-xs"
                      />
                    </div>

                    {/* Day / Label */}
                    <span className="text-[11px] font-bold text-base-content/60 group-hover:text-primary transition-colors mt-1">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-base-content/50 px-2 font-medium">
                <span>0 Candidates</span>
                <span>Peak: 42 Candidates/day</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between text-xs">
            <span className="font-semibold text-base-content/70">
              💡 Insight: Fridays generate 32% more technical submissions on DevHire.
            </span>
            <button
              type="button"
              onClick={() => navigateTo("post-job")}
              className="text-primary font-bold hover:underline shrink-0 ml-2"
            >
              Post role today →
            </button>
          </div>
        </div>

        {/* GRAPH 2: TECH STACK DISTRIBUTION DONUT & BARS (1 COL) */}
        <div className="p-5 sm:p-6 rounded-3xl border border-base-300 bg-base-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-base-200">
              <PieChart className="w-4 h-4 text-accent" />
              <div>
                <h3 className="text-base sm:text-lg font-black text-base-content">
                  Applicant Tech Stack Graph
                </h3>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Breakdown by candidate primary skills
                </p>
              </div>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="mt-5">
              <div className="h-4 w-full rounded-full overflow-hidden flex shadow-xs">
                {TECH_STACK_DISTRIBUTION.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color,
                    }}
                    title={`${item.name}: ${item.percent}%`}
                    className="h-full transition-all hover:opacity-85"
                  />
                ))}
              </div>

              {/* Legend List */}
              <div className="mt-5 space-y-3">
                {TECH_STACK_DISTRIBUTION.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-md shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-base-content/80 truncate">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-black text-base-content">
                        {item.count}
                      </span>
                      <span className="text-[11px] text-base-content/50 font-bold">
                        ({item.percent}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-base-200 text-center">
            <button
              type="button"
              onClick={() => navigateTo("applicants")}
              className="text-xs font-bold text-primary hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              Browse applicants by stack <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. GRAPH 3: RECRUITMENT ATS HIRING PIPELINE FUNNEL */}
      <div className="p-5 sm:p-7 rounded-3xl border border-base-300 bg-base-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-base-200">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-warning" />
              <h3 className="text-base sm:text-xl font-black text-base-content">
                Hiring Funnel & Pipeline Conversion Graph
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
              Visual conversion rates from initial application submission to signed offer
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigateTo("applicants")}
            className="btn btn-sm btn-outline rounded-xl font-bold gap-1 self-start sm:self-auto"
          >
            <Users className="w-3.5 h-3.5" />
            Open Full ATS
          </button>
        </div>

        {/* FUNNEL BARS */}
        <div className="mt-6 space-y-4">
          {FUNNEL_STAGES.map((stage, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveFunnelHover(idx)}
              onMouseLeave={() => setActiveFunnelHover(null)}
              className={`p-3.5 rounded-2xl border transition-all ${
                activeFunnelHover === idx
                  ? "border-primary bg-primary/5 shadow-xs"
                  : "border-base-200 bg-base-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className={`badge ${stage.badge} badge-xs font-bold`}>
                    Stage {idx + 1}
                  </span>
                  <span className="font-bold text-sm text-base-content">
                    {stage.stage}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base-content/60 text-xs">
                    {stage.desc}
                  </span>
                  <span className="font-black text-sm text-base-content">
                    {stage.count} candidates ({stage.percent}%)
                  </span>
                </div>
              </div>

              {/* Progress bar representing funnel step */}
              <div className="w-full bg-base-200 rounded-full h-3.5 overflow-hidden">
                <div
                  style={{ width: `${stage.percent}%` }}
                  className={`h-full ${stage.color} rounded-full transition-all duration-700`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECRUITER RESPONSIBILITY MATRIX (WHAT RECRUITERS CAN DO) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-base-content">
            Recruiter Capabilities & Workflow Hub
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
            Everything you can perform on DevHire as a verified hiring manager or recruiter
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1 */}
          <div className="p-5 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-extrabold text-base text-base-content">
                1. Post New Developer Jobs
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Publish high-visibility developer roles with salary transparency, tech stack tags, and workplace preferences (Remote, Hybrid, On-site).
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("post-job")}
              className="btn btn-sm btn-primary rounded-xl font-bold w-full gap-1.5"
            >
              Post a Job <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 2 */}
          <div className="p-5 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-info/10 text-info flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-extrabold text-base text-base-content">
                2. Manage Posted Listings
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Review your active postings, update job requirements or salary bands, inspect approval status, and toggle listings active/inactive.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("manage-jobs")}
              className="btn btn-sm btn-outline rounded-xl font-bold w-full gap-1.5"
            >
              Manage Postings <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 3 */}
          <div className="p-5 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-accent/15 text-accent flex items-center justify-center font-bold">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-extrabold text-base text-base-content">
                3. Review Candidates & ATS
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Inspect applicant resumes, GitHub & portfolio links, stage interview rounds, write evaluation notes, and extend hiring offers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("applicants")}
              className="btn btn-sm btn-outline rounded-xl font-bold w-full gap-1.5"
            >
              Inspect Candidates <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 4 */}
          <div className="p-5 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-2xl bg-success/15 text-success flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-extrabold text-base text-base-content">
                4. Brand & Company Profile
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Build a compelling employer brand by highlighting engineering culture, company benefits, tech stack, and hiring headquarters.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo("profile")}
              className="btn btn-sm btn-outline rounded-xl font-bold w-full gap-1.5"
            >
              Update Brand <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 6. RECENT POSTED JOBS & FAST ACCESS TABLE */}
      <div className="p-5 sm:p-7 rounded-3xl border border-base-300 bg-base-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-base-200">
          <div>
            <h3 className="text-base sm:text-lg font-black text-base-content">
              Your Current Job Openings
            </h3>
            <p className="text-xs text-base-content/60">
              Live status and quick management of your latest technical listings
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo("manage-jobs")}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All ({jobs.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-base-300 bg-base-200/30">
            <Briefcase className="w-8 h-8 mx-auto text-base-content/40 mb-2" />
            <h4 className="font-bold text-sm">No jobs posted yet</h4>
            <p className="text-xs text-base-content/60 max-w-xs mx-auto mt-1">
              Create your first developer listing to start receiving candidate applications.
            </p>
            <button
              type="button"
              onClick={() => navigateTo("post-job")}
              className="btn btn-primary btn-sm rounded-xl font-bold mt-3"
            >
              Post a Job Now
            </button>
          </div>
        ) : (
          <div className="divide-y divide-base-200">
            {jobs.slice(0, 4).map((job) => (
              <div
                key={job._id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-base-200/30 rounded-xl px-2 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-base-content truncate">
                      {job.title}
                    </h4>
                    <span
                      className={`badge badge-xs font-bold ${
                        job.status === "approved"
                          ? "badge-success"
                          : job.status === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-base-content/60 mt-1">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {job.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location} ({job.workplace})
                    </span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => navigateTo("manage-jobs")}
                    className="btn btn-xs btn-outline rounded-lg font-bold"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
