import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  FileText,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { api } from "../../../services/api";

export interface ApplicationItem {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  appliedDate: string;
  status: "applied" | "reviewing" | "interview" | "offered" | "rejected";
  notes?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  experience?: string;
  stageTimeline?: { stage: string; date: string; completed: boolean }[];
}

const DEFAULT_APPLICATIONS: ApplicationItem[] = [
  {
    id: "app-1",
    jobTitle: "Senior Frontend Engineer",
    company: "Nexora Technologies",
    location: "Remote (US/EU)",
    salary: "$140k–$180k/yr",
    type: "Full-time",
    appliedDate: "Oct 18, 2026",
    status: "interview",
    notes: "Applied with customized resume highlighting React 19, TypeScript, and microfrontends. Recruiter reached out for 1st round interview on Oct 24.",
    stageTimeline: [
      { stage: "Application Submitted", date: "Oct 18, 2026", completed: true },
      { stage: "Profile Review", date: "Oct 20, 2026", completed: true },
      { stage: "Technical Interview", date: "Oct 24, 2026", completed: false },
      { stage: "Final Offer", date: "Pending", completed: false },
    ],
  },
  {
    id: "app-2",
    jobTitle: "Full Stack Developer (Node.js & React)",
    company: "FintechCo Solutions",
    location: "San Francisco, CA (Hybrid)",
    salary: "$120k–$155k/yr",
    type: "Full-time",
    appliedDate: "Oct 15, 2026",
    status: "reviewing",
    notes: "Application undergoing hiring team portfolio and code review.",
    stageTimeline: [
      { stage: "Application Submitted", date: "Oct 15, 2026", completed: true },
      { stage: "Under Hiring Team Review", date: "Oct 17, 2026", completed: true },
      { stage: "Interview Scheduling", date: "Pending", completed: false },
      { stage: "Final Decision", date: "Pending", completed: false },
    ],
  },
  {
    id: "app-3",
    jobTitle: "Backend Software Engineer",
    company: "Cloudly Systems",
    location: "Remote",
    salary: "$110k–$140k/yr",
    type: "Full-time",
    appliedDate: "Oct 10, 2026",
    status: "applied",
    notes: "Submitted application via DevHire instant apply. Awaiting hiring manager response.",
    stageTimeline: [
      { stage: "Application Submitted", date: "Oct 10, 2026", completed: true },
      { stage: "Resume Screening", date: "In Progress", completed: false },
      { stage: "Interview", date: "Pending", completed: false },
      { stage: "Decision", date: "Pending", completed: false },
    ],
  },
  {
    id: "app-4",
    jobTitle: "DevOps & Cloud Architect",
    company: "DataStream Corp",
    location: "Austin, TX (Remote)",
    salary: "$150k–$190k/yr",
    type: "Contract",
    appliedDate: "Sep 28, 2026",
    status: "offered",
    notes: "Offer letter received! Reviewing equity grant and compensation details.",
    stageTimeline: [
      { stage: "Application Submitted", date: "Sep 28, 2026", completed: true },
      { stage: "System Design Interview", date: "Oct 05, 2026", completed: true },
      { stage: "Executive Interview", date: "Oct 12, 2026", completed: true },
      { stage: "Offer Received", date: "Oct 19, 2026", completed: true },
    ],
  },
  {
    id: "app-5",
    jobTitle: "UI/UX & Frontend Lead",
    company: "Veloce Mobility",
    location: "Berlin, Germany (Remote)",
    salary: "€85k–€105k/yr",
    type: "Full-time",
    appliedDate: "Sep 20, 2026",
    status: "rejected",
    notes: "Role was filled by an internal candidate. Recommended to keep in touch for future openings.",
    stageTimeline: [
      { stage: "Application Submitted", date: "Sep 20, 2026", completed: true },
      { stage: "Application Reviewed", date: "Sep 25, 2026", completed: true },
      { stage: "Position Closed", date: "Oct 02, 2026", completed: true },
    ],
  },
];

const MyApplications = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_applications");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_APPLICATIONS;
  });

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api<{ success: boolean; data: any[] }>(
        "/applications/my-applications"
      );
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: ApplicationItem[] = res.data.map((item) => ({
          id: item._id || item.id,
          jobId: item.jobId,
          jobTitle: item.jobTitle,
          company: item.company,
          location: item.location,
          salary: item.salary || "Negotiable",
          type: item.type || "Full-time",
          appliedDate:
            item.appliedDate ||
            (item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently"),
          status: item.status || "applied",
          notes: item.coverNote || item.notes || "",
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          resumeUrl: item.resumeUrl,
          portfolioUrl: item.portfolioUrl,
          githubUrl: item.githubUrl,
          experience: item.experience,
          stageTimeline: item.stageTimeline || [
            {
              stage: "Application Submitted",
              date: item.appliedDate || "Recently",
              completed: true,
            },
            { stage: "Profile Review", date: "Pending", completed: false },
            { stage: "Technical Interview", date: "Pending", completed: false },
            { stage: "Final Offer", date: "Pending", completed: false },
          ],
        }));
        setApplications(mapped);
        localStorage.setItem(
          "devhire_candidate_applications",
          JSON.stringify(mapped)
        );
      }
    } catch (err) {
      console.warn("Could not fetch applications from MongoDB, using cached list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(
      "devhire_candidate_applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleWithdraw = async (id: string, title: string) => {
    if (
      window.confirm(
        `Are you sure you want to withdraw your application for "${title}"?`
      )
    ) {
      try {
        if (id && !id.startsWith("app-")) {
          await api(`/applications/${id}`, { method: "DELETE" });
        }
      } catch (err) {
        console.warn("Could not delete from backend:", err);
      }
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
      }
      showToast(`Application for "${title}" has been withdrawn.`);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    interview: applications.filter((a) => a.status === "interview").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    offered: applications.filter((a) => a.status === "offered").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const getStatusBadge = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "interview":
        return (
          <span className="badge badge-accent badge-soft font-bold text-xs gap-1.5 py-2.5 px-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interviewing
          </span>
        );
      case "reviewing":
        return (
          <span className="badge badge-warning badge-soft font-bold text-xs gap-1.5 py-2.5 px-3">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      case "offered":
        return (
          <span className="badge badge-success badge-soft font-bold text-xs gap-1.5 py-2.5 px-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Offer Received
          </span>
        );
      case "rejected":
        return (
          <span className="badge badge-error badge-soft font-bold text-xs gap-1.5 py-2.5 px-3">
            <XCircle className="w-3.5 h-3.5" />
            Not Selected
          </span>
        );
      default:
        return (
          <span className="badge badge-ghost font-bold text-xs gap-1.5 py-2.5 px-3">
            <Clock className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="alert alert-success shadow-lg fixed bottom-6 right-6 z-50 max-w-md animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Track and manage your submitted developer job applications in real time.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="btn btn-ghost btn-sm border border-base-300 rounded-xl font-bold gap-1.5"
            title="Refresh from MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            to="/jobs"
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2"
          >
            <Briefcase className="w-4 h-4" />
            Explore More Jobs
          </Link>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setSelectedStatus("all")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatus === "all"
              ? "border-primary bg-primary/10 shadow-sm"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <p className="text-xs font-semibold text-base-content/60 uppercase">Total</p>
          <p className="text-2xl font-black mt-1 text-base-content">{stats.total}</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("interview")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatus === "interview"
              ? "border-accent bg-accent/15 shadow-sm"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <p className="text-xs font-semibold text-accent uppercase">Interviews</p>
          <p className="text-2xl font-black mt-1 text-accent">{stats.interview}</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("reviewing")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatus === "reviewing"
              ? "border-warning bg-warning/15 shadow-sm"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <p className="text-xs font-semibold text-warning uppercase">In Review</p>
          <p className="text-2xl font-black mt-1 text-warning">{stats.reviewing}</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("offered")}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatus === "offered"
              ? "border-success bg-success/15 shadow-sm"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <p className="text-xs font-semibold text-success uppercase">Offered</p>
          <p className="text-2xl font-black mt-1 text-success">{stats.offered}</p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedStatus("rejected")}
          className={`p-3.5 rounded-2xl border text-left transition-all col-span-2 sm:col-span-1 ${
            selectedStatus === "rejected"
              ? "border-error bg-error/15 shadow-sm"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <p className="text-xs font-semibold text-error uppercase">Closed</p>
          <p className="text-2xl font-black mt-1 text-error">{stats.rejected}</p>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-300">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm w-full pl-9 rounded-xl bg-base-100 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select select-sm rounded-xl bg-base-100 border-base-300 text-xs font-bold"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Submitted</option>
            <option value="reviewing">Under Review</option>
            <option value="interview">Interviewing</option>
            <option value="offered">Offer Received</option>
            <option value="rejected">Not Selected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-base-content">
            No applications found
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
            {searchTerm || selectedStatus !== "all"
              ? "Try adjusting your search filters or status selection."
              : "You haven't applied to any developer roles yet. Find your next opportunity!"}
          </p>
          <div className="mt-4">
            <Link to="/jobs" className="btn btn-primary btn-sm rounded-xl font-bold">
              Browse Open Jobs
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="group p-4 sm:p-5 rounded-2xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Column: Job & Company info */}
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-lg shrink-0 border border-primary/20">
                  {app.company.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      onClick={() => setSelectedApplication(app)}
                      className="font-extrabold text-base text-base-content hover:text-primary cursor-pointer transition-colors"
                    >
                      {app.jobTitle}
                    </h3>
                    <span className="badge badge-sm badge-ghost font-semibold">
                      {app.type}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-base-content/65 mt-1.5">
                    <span className="flex items-center gap-1 font-bold text-base-content/85">
                      <Building2 className="w-3.5 h-3.5 text-base-content/40" />
                      {app.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-base-content/40" />
                      {app.location}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-success">
                      {app.salary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-base-content/50 mt-2">
                    <Calendar className="w-3 h-3" />
                    <span>Applied on {app.appliedDate}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-base-200">
                <div>{getStatusBadge(app.status)}</div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedApplication(app)}
                    className="btn btn-sm btn-ghost border border-base-300 rounded-xl gap-1 text-xs font-bold hover:bg-base-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWithdraw(app.id, app.jobTitle)}
                    title="Withdraw application"
                    className="btn btn-sm btn-ghost text-error/80 hover:text-error hover:bg-error/10 rounded-xl p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details & Status Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Application Details
                </span>
                <h2 className="text-xl font-black mt-0.5">
                  {selectedApplication.jobTitle}
                </h2>
                <p className="text-xs font-semibold text-base-content/60 mt-0.5">
                  {selectedApplication.company} • {selectedApplication.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 flex items-center justify-between">
              <div>
                <p className="text-xs text-base-content/60 font-semibold">Current Status</p>
                <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
              </div>
              <div className="text-right">
                <p className="text-xs text-base-content/60 font-semibold">Compensation</p>
                <p className="text-sm font-bold text-success mt-1">
                  {selectedApplication.salary}
                </p>
              </div>
            </div>

            {/* Application Progress Timeline */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-base-content/70 mb-3">
                Application Timeline
              </h4>
              <div className="space-y-3">
                {selectedApplication.stageTimeline?.map((stage, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        stage.completed
                          ? "bg-success text-success-content"
                          : "bg-base-300 text-base-content/40"
                      }`}
                    >
                      {stage.completed ? "✓" : idx + 1}
                    </div>
                    <div className="flex-1 flex items-center justify-between text-xs">
                      <span className={`font-bold ${stage.completed ? "text-base-content" : "text-base-content/50"}`}>
                        {stage.stage}
                      </span>
                      <span className="text-base-content/50 font-medium">
                        {stage.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Submitted Details (if available) */}
            {(selectedApplication.fullName ||
              selectedApplication.email ||
              selectedApplication.resumeUrl ||
              selectedApplication.portfolioUrl) && (
              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Your Submitted Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedApplication.fullName && (
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-base-content/50" />
                      <span className="font-semibold">{selectedApplication.fullName}</span>
                    </div>
                  )}
                  {selectedApplication.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-base-content/50" />
                      <span className="font-semibold">{selectedApplication.email}</span>
                    </div>
                  )}
                  {selectedApplication.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-base-content/50" />
                      <span className="font-semibold">{selectedApplication.phone}</span>
                    </div>
                  )}
                  {selectedApplication.experience && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-base-content/50" />
                      <span className="font-semibold">{selectedApplication.experience}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1 border-t border-base-300/60">
                  {selectedApplication.resumeUrl && (
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-outline rounded-lg gap-1 text-[11px] font-bold"
                    >
                      <FileText className="w-3 h-3 text-primary" />
                      Resume Link
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {selectedApplication.portfolioUrl && (
                    <a
                      href={selectedApplication.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-ghost border border-base-300 rounded-lg gap-1 text-[11px] font-bold"
                    >
                      Portfolio
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                  {selectedApplication.githubUrl && (
                    <a
                      href={selectedApplication.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-xs btn-ghost border border-base-300 rounded-lg gap-1 text-[11px] font-bold"
                    >
                      GitHub
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {selectedApplication.notes && (
              <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-base-content/80">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Notes & Follow-up</span>
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  {selectedApplication.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() =>
                  handleWithdraw(
                    selectedApplication.id,
                    selectedApplication.jobTitle
                  )
                }
                className="btn btn-sm btn-ghost text-error font-bold gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Withdraw Application
              </button>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="btn btn-sm btn-primary rounded-xl font-bold px-5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
