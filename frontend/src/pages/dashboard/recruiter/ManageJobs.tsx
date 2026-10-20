import { useEffect, useState, useMemo, type FormEvent } from "react";
import { api } from "../../../services/api";
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Search,
  Plus,
  Trash2,
  Eye,
  Edit3,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "MERN Stack Developer",
  "Junior Software Developer",
  "Software Developer",
  "Senior Frontend Developer",
  "Senior Software Developer",
  "Junior Frontend Developer",
];

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string;
}

export interface JobItem {
  _id: string;
  title: string;
  category: string;
  company: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site" | string;
  type: string;
  level: string;
  salary?: JobSalary | null;
  skills: string[];
  description: string;
  requirements?: string;
  deadline?: string | null;
  contactEmail: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ManageJobsProps {
  onNavigateToPost?: () => void;
}

const ManageJobs = ({ onNavigateToPost }: ManageJobsProps) => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [workplaceFilter, setWorkplaceFilter] = useState<string>("all");

  // Modal states
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api<ApiResponse<JobItem[]>>("/jobs/my-jobs");
      setJobs(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    if (!jobToDelete) return;

    try {
      setDeleting(true);
      await api(`/jobs/${jobToDelete._id}`, {
        method: "DELETE",
      });

      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      setActionSuccess(`"${jobToDelete.title}" was successfully deleted.`);
      setJobToDelete(null);

      // Auto-clear success message after 4s
      setTimeout(() => {
        setActionSuccess(null);
      }, 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  // Edit modal states
  const [jobToEdit, setJobToEdit] = useState<JobItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editCompany, setEditCompany] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editWorkplace, setEditWorkplace] = useState("Remote");
  const [editType, setEditType] = useState("Full-time");
  const [editLevel, setEditLevel] = useState("Mid");
  const [editSalaryMin, setEditSalaryMin] = useState("");
  const [editSalaryMax, setEditSalaryMax] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRequirements, setEditRequirements] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const openEditModal = (job: JobItem) => {
    setJobToEdit(job);
    setEditTitle(job.title || "");
    setEditCategory(job.category || CATEGORIES[0]);
    setEditCompany(job.company || "");
    setEditLocation(job.location || "");
    setEditWorkplace(job.workplace || "Remote");
    setEditType(job.type || "Full-time");
    setEditLevel(job.level || "Mid");
    setEditSalaryMin(job.salary?.min != null ? String(job.salary.min) : "");
    setEditSalaryMax(job.salary?.max != null ? String(job.salary.max) : "");
    setEditSkills(job.skills && job.skills.length > 0 ? job.skills.join(", ") : "");
    setEditDescription(job.description || "");
    setEditRequirements(job.requirements || "");
    setEditDeadline(
      job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : ""
    );
    setEditContactEmail(job.contactEmail || "");
    setEditError("");
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!jobToEdit) return;
    setEditError("");

    if (
      editSalaryMin &&
      editSalaryMax &&
      Number(editSalaryMin) > Number(editSalaryMax)
    ) {
      setEditError("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    const payload = {
      title: editTitle.trim(),
      category: editCategory,
      company: editCompany.trim(),
      location: editLocation.trim(),
      workplace: editWorkplace,
      type: editType,
      level: editLevel,
      salary:
        editSalaryMin || editSalaryMax
          ? {
              min: editSalaryMin ? Number(editSalaryMin) : null,
              max: editSalaryMax ? Number(editSalaryMax) : null,
              currency: jobToEdit.salary?.currency || "USD",
            }
          : null,
      skills: editSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: editDescription.trim(),
      requirements: editRequirements.trim(),
      deadline: editDeadline || null,
      contactEmail: editContactEmail.trim(),
    };

    setSavingEdit(true);

    try {
      const res = await api<ApiResponse<JobItem>>(`/jobs/${jobToEdit._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updated = res.data;
      setJobs((prev) =>
        prev.map((j) => (j._id === jobToEdit._id ? updated : j))
      );
      setActionSuccess(`"${payload.title}" was updated successfully.`);
      setJobToEdit(null);

      setTimeout(() => {
        setActionSuccess(null);
      }, 4000);
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Failed to update job details"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // Metrics calculation
  const totalJobs = jobs.length;
  const approvedJobs = jobs.filter((j) => j.status === "approved").length;
  const pendingJobs = jobs.filter((j) => j.status === "pending").length;
  const rejectedJobs = jobs.filter((j) => j.status === "rejected").length;

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      const matchesWorkplace =
        workplaceFilter === "all" ||
        job.workplace.toLowerCase() === workplaceFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesWorkplace;
    });
  }, [jobs, searchTerm, statusFilter, workplaceFilter]);

  const formatSalary = (salary?: JobSalary | null) => {
    if (!salary || (salary.min == null && salary.max == null)) {
      return "Negotiable";
    }
    const currency = salary.currency || "USD";
    if (salary.min != null && salary.max != null) {
      return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    }
    if (salary.min != null) {
      return `From ${currency} ${salary.min.toLocaleString()}`;
    }
    return `Up to ${currency} ${salary.max?.toLocaleString()}`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning">
            <Clock className="h-3.5 w-3.5" />
            Pending Review
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-error/15 px-2.5 py-1 text-xs font-semibold text-error">
            <XCircle className="h-3.5 w-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="badge badge-ghost text-xs capitalize">{status}</span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="mt-1 text-sm text-base-content/60">
            View, track status, and manage all your posted job listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchJobs}
            disabled={loading}
            className="btn btn-ghost btn-sm border border-base-300 gap-1.5 rounded-xl font-medium"
            title="Refresh jobs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {onNavigateToPost && (
            <button
              type="button"
              onClick={onNavigateToPost}
              className="btn btn-primary btn-sm gap-1.5 rounded-xl font-bold"
            >
              <Plus className="h-4 w-4" />
              Post New Job
            </button>
          )}
        </div>
      </div>

      {/* Action alerts */}
      {actionSuccess && (
        <div className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccess(null)}
            className="btn btn-ghost btn-xs btn-circle"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchJobs}
            className="btn btn-ghost btn-xs underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
          <p className="text-xs font-semibold text-base-content/60 uppercase">
            Total Posted
          </p>
          <p className="mt-1 text-2xl font-extrabold text-base-content">
            {totalJobs}
          </p>
        </div>

        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 shadow-sm">
          <p className="text-xs font-semibold text-warning uppercase">
            Pending Review
          </p>
          <p className="mt-1 text-2xl font-extrabold text-warning">
            {pendingJobs}
          </p>
        </div>

        <div className="rounded-2xl border border-success/30 bg-success/5 p-4 shadow-sm">
          <p className="text-xs font-semibold text-success uppercase">
            Approved & Live
          </p>
          <p className="mt-1 text-2xl font-extrabold text-success">
            {approvedJobs}
          </p>
        </div>

        <div className="rounded-2xl border border-error/30 bg-error/5 p-4 shadow-sm">
          <p className="text-xs font-semibold text-error uppercase">Rejected</p>
          <p className="mt-1 text-2xl font-extrabold text-error">
            {rejectedJobs}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, category, company, or location…"
            className="w-full rounded-xl border border-base-300 bg-base-100 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm outline-none focus:border-primary/60"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Workplace Filter */}
          <select
            value={workplaceFilter}
            onChange={(e) => setWorkplaceFilter(e.target.value)}
            className="rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-sm outline-none focus:border-primary/60"
          >
            <option value="all">All Workplaces</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {(searchTerm || statusFilter !== "all" || workplaceFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setWorkplaceFilter("all");
              }}
              className="btn btn-ghost btn-sm text-xs font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {loading ? (
          <div className="p-8 text-center space-y-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-base-content/60">
              Loading your jobs list…
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-base-200">
              <Briefcase className="h-7 w-7 text-base-content/40" />
            </div>
            {totalJobs === 0 ? (
              <>
                <h3 className="mt-4 text-base font-bold">No jobs posted yet</h3>
                <p className="mt-1 text-sm text-base-content/60">
                  Get started by posting your first job opening to reach developers.
                </p>
                {onNavigateToPost && (
                  <button
                    type="button"
                    onClick={onNavigateToPost}
                    className="btn btn-primary btn-sm mt-5 rounded-xl font-bold"
                  >
                    <Plus className="h-4 w-4" /> Post a Job
                  </button>
                )}
              </>
            ) : (
              <>
                <h3 className="mt-4 text-base font-bold">No matches found</h3>
                <p className="mt-1 text-sm text-base-content/60">
                  No jobs matched your search or filter settings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setWorkplaceFilter("all");
                  }}
                  className="btn btn-ghost btn-sm mt-4 border border-base-300 rounded-xl font-medium"
                >
                  Clear Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-base-300 bg-base-200/50 text-xs font-bold uppercase tracking-wider text-base-content/60">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 sm:pl-6">Job Details</th>
                  <th className="px-3 py-3.5">Company & Location</th>
                  <th className="px-3 py-3.5">Type & Level</th>
                  <th className="px-3 py-3.5">Salary</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="px-3 py-3.5">Posted On</th>
                  <th className="py-3.5 pl-3 pr-4 text-right sm:pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-300/60">
                {filteredJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="transition-colors hover:bg-base-200/40"
                  >
                    {/* Job Details */}
                    <td className="py-4 pl-4 pr-3 sm:pl-6">
                      <div className="font-bold text-base-content">
                        {job.title}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-base-content/60">
                          {job.category}
                        </span>
                        <span className="text-xs text-base-content/30">•</span>
                        <span className="badge badge-sm badge-ghost text-[10px] font-semibold">
                          {job.workplace}
                        </span>
                      </div>
                    </td>

                    {/* Company & Location */}
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-base-content">
                        <Building2 className="h-3.5 w-3.5 text-base-content/50 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {job.company}
                        </span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-base-content/60">
                        <MapPin className="h-3 w-3 text-base-content/40 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {job.location}
                        </span>
                      </div>
                    </td>

                    {/* Type & Level */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="font-medium text-base-content">
                        {job.type}
                      </div>
                      <div className="text-xs text-base-content/60">
                        {job.level} Level
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="font-semibold text-primary text-xs">
                        {formatSalary(job.salary)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      {renderStatusBadge(job.status)}
                    </td>

                    {/* Date */}
                    <td className="px-3 py-4 whitespace-nowrap text-xs text-base-content/60">
                      {formatDate(job.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-3 pr-4 text-right sm:pr-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:bg-base-200 hover:text-base-content"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(job)}
                          className="btn btn-ghost btn-sm btn-circle text-primary hover:bg-primary/10 hover:text-primary"
                          title="Edit Job"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setJobToDelete(job)}
                          className="btn btn-ghost btn-sm btn-circle text-error/80 hover:bg-error/10 hover:text-error"
                          title="Delete Job"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-base-content">
                    {selectedJob.title}
                  </h3>
                  {renderStatusBadge(selectedJob.status)}
                </div>
                <p className="mt-1 text-sm text-base-content/60">
                  {selectedJob.company} • {selectedJob.location} •{" "}
                  {selectedJob.workplace}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-base-200/50 p-4 sm:grid-cols-4">
                <div>
                  <span className="text-xs font-semibold text-base-content/50 uppercase">
                    Category
                  </span>
                  <p className="font-semibold">{selectedJob.category}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-base-content/50 uppercase">
                    Type
                  </span>
                  <p className="font-semibold">{selectedJob.type}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-base-content/50 uppercase">
                    Level
                  </span>
                  <p className="font-semibold">{selectedJob.level}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-base-content/50 uppercase">
                    Salary
                  </span>
                  <p className="font-semibold text-primary">
                    {formatSalary(selectedJob.salary)}
                  </p>
                </div>
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h4 className="font-bold text-xs uppercase text-base-content/60 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge badge-primary badge-soft text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-xs uppercase text-base-content/60 mb-1.5">
                  Job Description
                </h4>
                <div className="whitespace-pre-line rounded-xl border border-base-300/70 bg-base-200/30 p-4 text-sm leading-relaxed text-base-content/80">
                  {selectedJob.description}
                </div>
              </div>

              {selectedJob.requirements && (
                <div>
                  <h4 className="font-bold text-xs uppercase text-base-content/60 mb-1.5">
                    Requirements
                  </h4>
                  <div className="whitespace-pre-line rounded-xl border border-base-300/70 bg-base-200/30 p-4 text-sm leading-relaxed text-base-content/80">
                    {selectedJob.requirements}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-base-300">
                <div>
                  <span className="text-xs font-semibold text-base-content/50 uppercase">
                    Contact Email
                  </span>
                  <p className="font-medium text-base-content">
                    {selectedJob.contactEmail}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-base-content/50 uppercase">
                    Application Deadline
                  </span>
                  <p className="font-medium text-base-content flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-base-content/50" />
                    {selectedJob.deadline
                      ? formatDate(selectedJob.deadline)
                      : "No deadline specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost rounded-xl border border-base-300 px-6 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
              <Trash2 className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-lg font-bold">Delete this job opening?</h3>
            <p className="mt-2 text-sm text-base-content/70">
              Are you sure you want to delete{" "}
              <strong className="text-base-content font-semibold">
                "{jobToDelete.title}"
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setJobToDelete(null)}
                className="btn btn-ghost rounded-xl border border-base-300 px-5 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="btn btn-error rounded-xl px-5 font-bold text-white"
              >
                {deleting ? "Deleting…" : "Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {jobToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
              <div>
                <h3 className="text-xl font-bold text-base-content">
                  Edit Job Opening
                </h3>
                <p className="mt-1 text-sm text-base-content/60">
                  Update details for "{jobToEdit.title}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => setJobToEdit(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editError && (
              <div className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    required
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    required
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Workplace *
                  </label>
                  <select
                    value={editWorkplace}
                    onChange={(e) => setEditWorkplace(e.target.value)}
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Employment Type *
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Experience Level *
                  </label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value)}
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Min Salary (USD / year)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editSalaryMin}
                    onChange={(e) => setEditSalaryMin(e.target.value)}
                    placeholder="e.g. 100000"
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Max Salary (USD / year)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editSalaryMax}
                    onChange={(e) => setEditSalaryMax(e.target.value)}
                    placeholder="e.g. 140000"
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  placeholder="React, Node.js, TypeScript"
                  className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Job Description *
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60 resize-y"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Requirements
                </label>
                <textarea
                  value={editRequirements}
                  onChange={(e) => setEditRequirements(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60 resize-y"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={editContactEmail}
                  onChange={(e) => setEditContactEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-base-300">
                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={() => setJobToEdit(null)}
                  className="btn btn-ghost rounded-xl border border-base-300 px-6 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="btn btn-primary rounded-xl px-8 font-bold"
                >
                  {savingEdit ? "Saving Changes…" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
