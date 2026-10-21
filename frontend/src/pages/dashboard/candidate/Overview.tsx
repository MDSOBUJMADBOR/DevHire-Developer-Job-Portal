import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  Clock,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
  Calendar,
} from "lucide-react";

interface ApplicationItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: "applied" | "reviewing" | "interview" | "offered" | "rejected";
}

const DEFAULT_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    jobTitle: "Senior Frontend Engineer",
    company: "Nexora",
    location: "Remote",
    salary: "$140k–180k",
    appliedDate: "Oct 18, 2026",
    status: "interview",
  },
  {
    id: "app-2",
    jobTitle: "Full Stack Developer",
    company: "FintechCo",
    location: "Hybrid",
    salary: "$100k–145k",
    appliedDate: "Oct 15, 2026",
    status: "reviewing",
  },
  {
    id: "app-3",
    jobTitle: "Backend Developer",
    company: "Cloudly",
    location: "Remote",
    salary: "$90k–130k",
    appliedDate: "Oct 10, 2026",
    status: "applied",
  },
];

const Overview = () => {
  const { user } = useAuth();

  const [applications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_applications");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_APPLICATIONS;
  });

  const [savedJobsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("devhire_saved_jobs");
      if (saved) return JSON.parse(saved).length;
    } catch {}
    return 4;
  });

  const [profileCompletion] = useState(85);

  const interviewCount = applications.filter((a) => a.status === "interview").length;
  const reviewingCount = applications.filter((a) => a.status === "reviewing").length;

  const getStatusBadge = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "interview":
        return (
          <span className="badge badge-accent badge-soft font-bold text-xs gap-1 py-2 px-2.5">
            <Sparkles className="w-3 h-3" />
            Interviewing
          </span>
        );
      case "reviewing":
        return (
          <span className="badge badge-warning badge-soft font-bold text-xs gap-1 py-2 px-2.5">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case "offered":
        return (
          <span className="badge badge-success badge-soft font-bold text-xs gap-1 py-2 px-2.5">
            <CheckCircle2 className="w-3 h-3" />
            Offer Received
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-error badge-soft font-bold text-xs gap-1 py-2 px-2.5">
            Closed
          </span>
        );
      default:
        return (
          <span className="badge badge-ghost font-bold text-xs gap-1 py-2 px-2.5">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Candidate Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
            Welcome back, {user?.name || "Developer"}! 👋
          </h1>
          <p className="mt-2 text-sm text-base-content/70 leading-relaxed">
            Track your job applications, interview schedules, saved developer opportunities, and improve your profile visibility to top engineering teams.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/jobs"
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 px-5"
          >
            <Briefcase className="w-4 h-4" />
            Browse New Jobs
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Applications */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              Total Applied
            </p>
            <h3 className="text-2xl font-black mt-1">{applications.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Interviews */}
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider">
              Interviews
            </p>
            <h3 className="text-2xl font-black text-accent mt-1">
              {interviewCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* In Review */}
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-warning uppercase tracking-wider">
              In Review
            </p>
            <h3 className="text-2xl font-black text-warning mt-1">
              {reviewingCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="rounded-2xl border border-secondary/30 bg-secondary/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-secondary uppercase tracking-wider">
              Saved Jobs
            </p>
            <h3 className="text-2xl font-black text-secondary mt-1">
              {savedJobsCount}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">
                Recent Applications
              </h2>
              <span className="badge badge-sm badge-ghost font-bold">
                {applications.length}
              </span>
            </div>
            <Link
              to="/dashboard/applications"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200 hover:border-primary/40 transition-colors gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm text-base-content hover:text-primary transition-colors cursor-pointer">
                    {app.jobTitle}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-base-content/80">
                      <Building2 className="w-3 h-3" />
                      {app.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {app.location}
                    </span>
                    <span>•</span>
                    <span className="text-success font-semibold">
                      {app.salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-[11px] text-base-content/50">
                    <Calendar className="w-3 h-3" />
                    {app.appliedDate}
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Profile Strength & Quick Actions */}
        <div className="space-y-6">
          {/* Profile Strength Card */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-base-content/70">
                Profile Strength
              </h3>
              <span className="text-sm font-black text-primary">
                {profileCompletion}%
              </span>
            </div>

            <div className="w-full bg-base-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Contact & personal info added</span>
              </div>
              <div className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Resume uploaded (PDF)</span>
              </div>
              <div className="flex items-center gap-2 text-success font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Technical skills listed</span>
              </div>
              <div className="flex items-center gap-2 text-base-content/60">
                <div className="w-4 h-4 rounded-full border border-base-300 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-base-300"></div>
                </div>
                <span>Add work experience & education history</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-base-content/70">
              Quick Shortcuts
            </h3>

            <div className="space-y-2">
              <Link
                to="/dashboard/profile"
                className="flex items-center justify-between p-3 rounded-2xl bg-base-200/50 hover:bg-base-200 text-xs font-bold transition-colors"
              >
                <span>Edit Profile & Bio</span>
                <ArrowRight className="w-3.5 h-3.5 text-base-content/40" />
              </Link>
              <Link
                to="/dashboard/resume"
                className="flex items-center justify-between p-3 rounded-2xl bg-base-200/50 hover:bg-base-200 text-xs font-bold transition-colors"
              >
                <span>Manage Resume</span>
                <ArrowRight className="w-3.5 h-3.5 text-base-content/40" />
              </Link>
              <Link
                to="/dashboard/saved"
                className="flex items-center justify-between p-3 rounded-2xl bg-base-200/50 hover:bg-base-200 text-xs font-bold transition-colors"
              >
                <span>Bookmarked Jobs ({savedJobsCount})</span>
                <ArrowRight className="w-3.5 h-3.5 text-base-content/40" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
