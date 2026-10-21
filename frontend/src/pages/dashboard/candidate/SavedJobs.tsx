import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Building2,
  MapPin,
  Trash2,
  Send,
  Search,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { ApplicationItem } from "./MyApplications";

export interface SavedJobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  category: string;
  tags: string[];
  savedDate: string;
  applied?: boolean;
}

const DEFAULT_SAVED_JOBS: SavedJobItem[] = [
  {
    id: "job-101",
    title: "Staff Frontend Architect (React & WebGL)",
    company: "Stripe",
    location: "Remote (Global)",
    salary: "$165,000 - $210,000",
    type: "Full-time",
    category: "Frontend",
    tags: ["React 19", "TypeScript", "Tailwind CSS", "Architecture"],
    savedDate: "Saved 2 days ago",
  },
  {
    id: "job-102",
    title: "Senior Node.js / Go Backend Engineer",
    company: "Supabase",
    location: "Remote",
    salary: "$140,000 - $185,000",
    type: "Full-time",
    category: "Backend",
    tags: ["Node.js", "PostgreSQL", "Go", "Docker", "Redis"],
    savedDate: "Saved 3 days ago",
  },
  {
    id: "job-103",
    title: "Full Stack Engineer (Next.js & AI Integrations)",
    company: "Vercel",
    location: "San Francisco, CA (Hybrid)",
    salary: "$150,000 - $190,000",
    type: "Full-time",
    category: "Full Stack",
    tags: ["Next.js", "AI / LLM", "Serverless", "Prisma"],
    savedDate: "Saved 5 days ago",
  },
  {
    id: "job-104",
    title: "Cloud Infrastructure & DevOps Engineer",
    company: "Datadog",
    location: "Remote (US/EU)",
    salary: "$135,000 - $175,000",
    type: "Full-time",
    category: "DevOps",
    tags: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    savedDate: "Saved 1 week ago",
  },
];

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>(() => {
    try {
      const stored = localStorage.getItem("devhire_saved_jobs");
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SAVED_JOBS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [applyingJob, setApplyingJob] = useState<SavedJobItem | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("devhire_saved_jobs", JSON.stringify(savedJobs));
  }, [savedJobs]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemove = (id: string, title: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
    showToast(`Removed "${title}" from saved jobs.`);
  };

  const handleQuickApplyConfirm = () => {
    if (!applyingJob) return;

    // Add to candidate applications in localStorage
    try {
      const existingAppsStr = localStorage.getItem("devhire_candidate_applications");
      const existingApps: ApplicationItem[] = existingAppsStr
        ? JSON.parse(existingAppsStr)
        : [];

      const newApp: ApplicationItem = {
        id: `app-${Date.now()}`,
        jobId: applyingJob.id,
        jobTitle: applyingJob.title,
        company: applyingJob.company,
        location: applyingJob.location,
        salary: applyingJob.salary,
        type: applyingJob.type,
        appliedDate: "Today",
        status: "applied",
        notes: coverNote || "Applied via DevHire 1-Click candidate apply.",
        stageTimeline: [
          { stage: "Application Submitted", date: "Today", completed: true },
          { stage: "Hiring Manager Review", date: "Pending", completed: false },
          { stage: "Interview", date: "Pending", completed: false },
        ],
      };

      const updatedApps = [newApp, ...existingApps];
      localStorage.setItem("devhire_candidate_applications", JSON.stringify(updatedApps));

      // Mark as applied in saved list
      setSavedJobs((prev) =>
        prev.map((j) => (j.id === applyingJob.id ? { ...j, applied: true } : j))
      );

      showToast(`Application submitted successfully for ${applyingJob.title}! 🎉`);
    } catch (e) {
      console.error(e);
    }

    setApplyingJob(null);
    setCoverNote("");
  };

  const filteredJobs = savedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      job.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="alert alert-success shadow-lg fixed bottom-6 right-6 z-50 max-w-md animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
              Saved Jobs
            </h1>
            <span className="badge badge-primary badge-soft font-bold text-xs px-2.5 py-1">
              {savedJobs.length} Bookmarked
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/60">
            Keep track of open positions you are interested in and apply with a single click.
          </p>
        </div>
        <Link
          to="/jobs"
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto"
        >
          <Search className="w-4 h-4" />
          Browse More Jobs
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-300">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            placeholder="Search saved jobs by title, company, or tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm w-full pl-9 rounded-xl bg-base-100 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {["all", "Frontend", "Backend", "Full Stack", "DevOps"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-xs rounded-xl font-bold capitalize transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "btn-primary"
                  : "btn-ghost bg-base-100 border border-base-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
            <Bookmark className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-base-content">
            No saved jobs found
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
            {searchTerm || selectedCategory !== "all"
              ? "No saved jobs match your current filter."
              : "You haven't bookmarked any jobs yet. Save interesting jobs while browsing to apply later."}
          </p>
          <div className="mt-4">
            <Link to="/jobs" className="btn btn-primary btn-sm rounded-xl font-bold">
              Find Jobs to Save
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-5 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary font-black flex items-center justify-center text-lg shrink-0 border border-secondary/20">
                  {job.company.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-base text-base-content hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <span className="badge badge-sm badge-ghost font-semibold">
                      {job.type}
                    </span>
                    {job.applied && (
                      <span className="badge badge-sm badge-success badge-soft font-bold gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Applied
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-base-content/65">
                    <span className="flex items-center gap-1 font-bold text-base-content/85">
                      <Building2 className="w-3.5 h-3.5 text-base-content/40" />
                      {job.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-base-content/40" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-success">
                      {job.salary}
                    </span>
                  </div>

                  {/* Skills/Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {job.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-base-200 text-[11px] font-semibold text-base-content/75"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-[11px] text-base-content/45 ml-1">
                      {job.savedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between md:justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-base-200">
                {job.applied ? (
                  <span className="btn btn-sm btn-disabled rounded-xl font-bold text-xs">
                    Already Applied
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setApplyingJob(job)}
                    className="btn btn-sm btn-primary rounded-xl font-bold gap-1.5 px-4 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Quick Apply
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(job.id, job.title)}
                  title="Remove from saved"
                  className="btn btn-sm btn-ghost text-error/80 hover:text-error hover:bg-error/10 rounded-xl p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  1-Click Application
                </span>
                <h2 className="text-xl font-black mt-0.5">
                  {applyingJob.title}
                </h2>
                <p className="text-xs font-semibold text-base-content/60 mt-0.5">
                  {applyingJob.company} • {applyingJob.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/20 text-xs text-base-content/80 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <span>
                Your profile information, technical skills, and default resume will be sent directly to <strong>{applyingJob.company}</strong>.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-base-content/80">
                Short Note / Pitch to Hiring Manager (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly state why you're a great fit for this role or mention relevant projects..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="textarea textarea-bordered w-full rounded-2xl text-xs sm:text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="btn btn-sm btn-ghost rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickApplyConfirm}
                className="btn btn-sm btn-primary rounded-xl font-bold gap-2 px-5"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
