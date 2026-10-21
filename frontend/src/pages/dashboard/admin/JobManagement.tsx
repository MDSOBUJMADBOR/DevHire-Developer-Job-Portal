import { useEffect, useState, useMemo } from "react";
import { api } from "../../../services/api";
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Search,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Check,
  DollarSign,
  Layers,
} from "lucide-react";

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

const JobManagement = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [workplaceFilter, setWorkplaceFilter] = useState<string>("all");

  // Modals & Action States
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [jobToDelete, setJobToDelete] = useState<JobItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      let res: ApiResponse<JobItem[]>;
      try {
        res = await api<ApiResponse<JobItem[]>>("/jobs/admin/all");
      } catch {
        // Fallback to standard jobs endpoint if admin route has permission or network issue
        res = await api<ApiResponse<JobItem[]>>("/jobs");
      }
      setJobs(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Update Status: Approve or Reject
  const handleUpdateStatus = async (
    jobId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(jobId);
      setError(null);

      const res = await api<ApiResponse<JobItem>>(`/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedJob = res.data;

      // Update in state
      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: updatedJob?.status || newStatus } : job
        )
      );

      // If viewing the modal for this job, sync its state too
      if (selectedJob && selectedJob._id === jobId) {
        setSelectedJob((prev) =>
          prev ? { ...prev, status: updatedJob?.status || newStatus } : null
        );
      }

      const statusLabel = newStatus === "approved" ? "approved" : "rejected";
      setActionSuccess(`Job has been successfully ${statusLabel}.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update job status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Job
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      await api(`/jobs/${jobToDelete._id}`, {
        method: "DELETE",
      });

      setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
      setActionSuccess(`"${jobToDelete.title}" was successfully deleted.`);

      if (selectedJob && selectedJob._id === jobToDelete._id) {
        setSelectedJob(null);
      }
      setJobToDelete(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job");
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats Counters
  const stats = useMemo(() => {
    const total = jobs.length;
    const pending = jobs.filter((j) => j.status === "pending").length;
    const approved = jobs.filter((j) => j.status === "approved").length;
    const rejected = jobs.filter((j) => j.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [jobs]);

  // Filtered & Searched Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
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
    if (!salary || (!salary.min && !salary.max)) return "Negotiable";
    const curr = salary.currency || "USD";
    if (salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()} ${curr}`;
    }
    if (salary.min) return `From $${salary.min.toLocaleString()} ${curr}`;
    if (salary.max) return `Up to $${salary.max.toLocaleString()} ${curr}`;
    return "Negotiable";
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Job Management
            </h1>
            <span className="badge badge-primary badge-sm font-semibold">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/65">
            Review, moderate, approve, reject, and manage all job postings across DevHire.
          </p>
        </div>

        <button
          onClick={fetchJobs}
          disabled={loading}
          className="btn btn-outline btn-sm rounded-xl gap-2 font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="alert alert-success shadow-sm rounded-2xl flex items-center gap-3 py-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{actionSuccess}</span>
          <button
            onClick={() => setActionSuccess(null)}
            className="btn btn-ghost btn-xs btn-circle ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error shadow-sm rounded-2xl flex items-center gap-3 py-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
          <button
            onClick={() => setError(null)}
            className="btn btn-ghost btn-xs btn-circle ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              Total Jobs
            </p>
            <h3 className="text-2xl font-black mt-1">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-warning uppercase tracking-wider">
              Pending Review
            </p>
            <h3 className="text-2xl font-black text-warning mt-1">
              {stats.pending}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/20 text-warning flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-success/30 bg-success/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-success uppercase tracking-wider">
              Approved
            </p>
            <h3 className="text-2xl font-black text-success mt-1">
              {stats.approved}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/20 text-success flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-error/30 bg-error/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-error uppercase tracking-wider">
              Rejected
            </p>
            <h3 className="text-2xl font-black text-error mt-1">
              {stats.rejected}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, company, category, or location..."
            className="input input-bordered input-sm sm:input-md w-full pl-10 rounded-xl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status & Workplace Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tab / Select */}
          <div className="join">
            <button
              onClick={() => setStatusFilter("all")}
              className={`join-item btn btn-sm ${
                statusFilter === "all" ? "btn-primary font-bold" : "btn-ghost"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`join-item btn btn-sm ${
                statusFilter === "pending"
                  ? "btn-warning text-warning-content font-bold"
                  : "btn-ghost"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`join-item btn btn-sm ${
                statusFilter === "approved"
                  ? "btn-success text-success-content font-bold"
                  : "btn-ghost"
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`join-item btn btn-sm ${
                statusFilter === "rejected"
                  ? "btn-error text-error-content font-bold"
                  : "btn-ghost"
              }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>

          {/* Workplace Filter */}
          <div className="relative">
            <select
              value={workplaceFilter}
              onChange={(e) => setWorkplaceFilter(e.target.value)}
              className="select select-bordered select-sm rounded-xl text-xs font-semibold pr-8"
            >
              <option value="all">All Workplaces</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on-site">On-site</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Jobs Table */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-left">
            {/* Table Header */}
            <thead className="bg-base-200/60 text-xs uppercase font-bold text-base-content/70">
              <tr>
                <th className="py-4 px-4">Job Info</th>
                <th className="py-4 px-4">Company & Location</th>
                <th className="py-4 px-4">Salary</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Posted Date</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-base-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                      <p className="text-sm font-medium text-base-content/60">
                        Loading all job postings...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                      <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-3 text-base-content/40">
                        <Briefcase className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold">No jobs found</h4>
                      <p className="text-xs text-base-content/60 mt-1">
                        {searchTerm || statusFilter !== "all" || workplaceFilter !== "all"
                          ? "No jobs matched your current filter or search criteria."
                          : "There are currently no job postings in the database."}
                      </p>
                      {(searchTerm || statusFilter !== "all" || workplaceFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setWorkplaceFilter("all");
                          }}
                          className="btn btn-outline btn-xs rounded-lg mt-3"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const isUpdating = updatingId === job._id;

                  return (
                    <tr
                      key={job._id}
                      className="hover:bg-base-200/40 transition-colors"
                    >
                      {/* Job Info */}
                      <td className="py-4 px-4 min-w-[220px]">
                        <div>
                          <div className="font-bold text-sm text-base-content hover:text-primary transition-colors cursor-pointer"
                            onClick={() => setSelectedJob(job)}
                          >
                            {job.title}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="badge badge-sm badge-ghost text-[10px] font-semibold">
                              {job.category}
                            </span>
                            <span className="badge badge-sm badge-outline text-[10px] font-semibold">
                              {job.type}
                            </span>
                            <span className="badge badge-sm badge-neutral text-[10px] font-semibold">
                              {job.level}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company & Location */}
                      <td className="py-4 px-4 min-w-[180px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-base-content">
                            <Building2 className="w-3.5 h-3.5 text-base-content/50" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
                            <MapPin className="w-3.5 h-3.5 text-base-content/50" />
                            {job.location} ({job.workplace})
                          </div>
                        </div>
                      </td>

                      {/* Salary */}
                      <td className="py-4 px-4 min-w-[140px] text-xs font-medium text-base-content/80">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-success shrink-0" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 min-w-[120px]">
                        {job.status === "approved" ? (
                          <span className="badge badge-success badge-soft font-bold text-xs gap-1 py-2.5 px-3">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        ) : job.status === "rejected" ? (
                          <span className="badge badge-error badge-soft font-bold text-xs gap-1 py-2.5 px-3">
                            <XCircle className="w-3.5 h-3.5" />
                            Rejected
                          </span>
                        ) : (
                          <span className="badge badge-warning badge-soft font-bold text-xs gap-1 py-2.5 px-3 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Posted Date */}
                      <td className="py-4 px-4 min-w-[120px] text-xs text-base-content/65">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                          {formatDate(job.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 min-w-[210px] text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Approve Action */}
                          <button
                            title="Approve Job"
                            disabled={isUpdating || job.status === "approved"}
                            onClick={() => handleUpdateStatus(job._id, "approved")}
                            className={`btn btn-xs rounded-lg font-bold gap-1 transition-all ${
                              job.status === "approved"
                                ? "btn-disabled opacity-40"
                                : "btn-success btn-outline hover:!btn-success"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>

                          {/* Reject Action */}
                          <button
                            title="Reject Job"
                            disabled={isUpdating || job.status === "rejected"}
                            onClick={() => handleUpdateStatus(job._id, "rejected")}
                            className={`btn btn-xs rounded-lg font-bold gap-1 transition-all ${
                              job.status === "rejected"
                                ? "btn-disabled opacity-40"
                                : "btn-warning btn-outline hover:!btn-warning"
                            }`}
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>

                          {/* View Detail Modal */}
                          <button
                            title="View Job Details"
                            onClick={() => setSelectedJob(job)}
                            className="btn btn-ghost btn-xs btn-circle text-base-content/70 hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Action */}
                          <button
                            title="Delete Job"
                            onClick={() => setJobToDelete(job)}
                            className="btn btn-ghost btn-xs btn-circle text-error/80 hover:bg-error/10 hover:text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        {!loading && filteredJobs.length > 0 && (
          <div className="border-t border-base-200 px-4 py-3 bg-base-100 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-2">
            <div>
              Showing <span className="font-bold text-base-content">{filteredJobs.length}</span> of{" "}
              <span className="font-bold text-base-content">{jobs.length}</span> total postings
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning inline-block" />
                Pending: {stats.pending}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                Approved: {stats.approved}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error inline-block" />
                Rejected: {stats.rejected}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-base-200 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-sm font-bold uppercase ${
                      selectedJob.status === "approved"
                        ? "badge-success text-success-content"
                        : selectedJob.status === "rejected"
                        ? "badge-error text-error-content"
                        : "badge-warning text-warning-content"
                    }`}
                  >
                    {selectedJob.status}
                  </span>
                  <span className="badge badge-sm badge-outline">
                    {selectedJob.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-2">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-base-content/70">
                  <span className="flex items-center gap-1 font-semibold text-base-content">
                    <Building2 className="w-3.5 h-3.5" />
                    {selectedJob.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedJob.location} ({selectedJob.workplace})
                  </span>
                  <span>•</span>
                  <span>{selectedJob.type}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost btn-sm btn-circle shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Key Attributes Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Compensation
                  </span>
                  <span className="font-bold text-xs mt-0.5 block">
                    {formatSalary(selectedJob.salary)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Experience Level
                  </span>
                  <span className="font-bold text-xs mt-0.5 block">
                    {selectedJob.level}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Contact Email
                  </span>
                  <span className="font-bold text-xs mt-0.5 block truncate text-primary">
                    {selectedJob.contactEmail}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Posted Date
                  </span>
                  <span className="font-medium text-xs mt-0.5 block">
                    {formatDate(selectedJob.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Application Deadline
                  </span>
                  <span className="font-medium text-xs mt-0.5 block">
                    {formatDate(selectedJob.deadline)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Visibility
                  </span>
                  <span className="font-medium text-xs mt-0.5 block">
                    {selectedJob.isActive ? "Active / Listed" : "Hidden / Inactive"}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Required Skills & Technologies
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="badge badge-primary badge-soft text-xs font-semibold py-2 px-3"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                  Job Description
                </h4>
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-base-content/80 bg-base-200/30 p-4 rounded-2xl border border-base-200">
                  {selectedJob.description}
                </div>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Requirements & Qualifications
                  </h4>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-base-content/80 bg-base-200/30 p-4 rounded-2xl border border-base-200">
                    {selectedJob.requirements}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setJobToDelete(selectedJob)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10 font-bold gap-1 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Delete Posting
              </button>

              <div className="flex items-center gap-2">
                <button
                  disabled={
                    updatingId === selectedJob._id ||
                    selectedJob.status === "rejected"
                  }
                  onClick={() =>
                    handleUpdateStatus(selectedJob._id, "rejected")
                  }
                  className="btn btn-warning btn-sm rounded-xl font-bold gap-1"
                >
                  <X className="w-4 h-4" />
                  Reject Job
                </button>

                <button
                  disabled={
                    updatingId === selectedJob._id ||
                    selectedJob.status === "approved"
                  }
                  onClick={() =>
                    handleUpdateStatus(selectedJob._id, "approved")
                  }
                  className="btn btn-success btn-sm rounded-xl font-bold gap-1"
                >
                  <Check className="w-4 h-4" />
                  Approve Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold">Delete Job Posting?</h3>
            <p className="text-sm text-base-content/70 mt-2">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-base-content">
                "{jobToDelete.title}"
              </span>{" "}
              posted for{" "}
              <span className="font-semibold text-base-content">
                {jobToDelete.company}
              </span>
              ? This action cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                disabled={isDeleting}
                onClick={() => setJobToDelete(null)}
                className="btn btn-ghost btn-sm rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteJob}
                className="btn btn-error btn-sm rounded-xl font-bold gap-2"
              >
                {isDeleting && (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
                Delete Posting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
