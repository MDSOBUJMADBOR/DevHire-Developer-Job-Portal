import { useEffect, useState, useMemo } from "react";
import { api } from "../../../services/api";
import {
  Building2,
  Briefcase,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Calendar,
  Lock,
  Unlock,
  ShieldCheck,
  Layers,
  MapPin,
} from "lucide-react";

export interface RecruiterUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruiterJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  postedBy: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const RecruiterManagement = () => {
  const [recruiters, setRecruiters] = useState<RecruiterUser[]>([]);
  const [allJobs, setAllJobs] = useState<RecruiterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals & Action States
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterUser | null>(null);
  const [recruiterToDelete, setRecruiterToDelete] = useState<RecruiterUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users and jobs in parallel
      const [usersRes, jobsRes] = await Promise.allSettled([
        api<ApiResponse<RecruiterUser[]>>("/users"),
        api<ApiResponse<RecruiterJob[]>>("/jobs/admin/all").catch(() =>
          api<ApiResponse<RecruiterJob[]>>("/jobs")
        ),
      ]);

      if (usersRes.status === "fulfilled" && usersRes.value.data) {
        // Filter only users with recruiter / employer role
        const employerUsers = usersRes.value.data.filter((u) => {
          const r = (u.role || "").toUpperCase();
          return r === "EMPLOYER" || r === "RECRUITER";
        });
        setRecruiters(employerUsers);
      } else {
        throw new Error("Failed to load recruiters");
      }

      if (jobsRes.status === "fulfilled" && jobsRes.value.data) {
        setAllJobs(jobsRes.value.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load recruiter data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Map jobs to recruiter IDs
  const jobsByRecruiter = useMemo(() => {
    const map = new Map<string, RecruiterJob[]>();
    for (const job of allJobs) {
      const pid = job.postedBy;
      if (!map.has(pid)) {
        map.set(pid, []);
      }
      map.get(pid)!.push(job);
    }
    return map;
  }, [allJobs]);

  // Derive associated company names for a recruiter
  const getCompanyNames = (recruiterId: string): string[] => {
    const recruiterJobs = jobsByRecruiter.get(recruiterId) || [];
    const companies = new Set<string>();
    recruiterJobs.forEach((j) => {
      if (j.company) companies.add(j.company);
    });
    return Array.from(companies);
  };

  // Toggle active / suspend status
  const handleToggleStatus = async (recruiter: RecruiterUser) => {
    try {
      setTogglingId(recruiter._id);
      setError(null);

      const nextStatus = !recruiter.isActive;

      const res = await api<ApiResponse<RecruiterUser>>(`/users/${recruiter._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: nextStatus }),
      });

      const updated = res.data;

      setRecruiters((prev) =>
        prev.map((r) =>
          r._id === recruiter._id
            ? { ...r, isActive: updated?.isActive !== undefined ? updated.isActive : nextStatus }
            : r
        )
      );

      if (selectedRecruiter && selectedRecruiter._id === recruiter._id) {
        setSelectedRecruiter((prev) =>
          prev ? { ...prev, isActive: nextStatus } : null
        );
      }

      setActionSuccess(
        `Recruiter "${recruiter.name}" has been ${nextStatus ? "activated" : "suspended"}.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update recruiter status");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete recruiter
  const handleDeleteRecruiter = async () => {
    if (!recruiterToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      await api(`/users/${recruiterToDelete._id}`, {
        method: "DELETE",
      });

      setRecruiters((prev) => prev.filter((r) => r._id !== recruiterToDelete._id));
      setActionSuccess(`Recruiter "${recruiterToDelete.name}" was permanently removed.`);

      if (selectedRecruiter && selectedRecruiter._id === recruiterToDelete._id) {
        setSelectedRecruiter(null);
      }
      setRecruiterToDelete(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete recruiter");
    } finally {
      setIsDeleting(false);
    }
  };

  // Summary stats
  const stats = useMemo(() => {
    const total = recruiters.length;
    const active = recruiters.filter((r) => r.isActive).length;
    const suspended = recruiters.filter((r) => !r.isActive).length;
    const totalJobsPosted = allJobs.length;
    return { total, active, suspended, totalJobsPosted };
  }, [recruiters, allJobs]);

  // Filtering
  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((recruiter) => {
      const q = searchTerm.toLowerCase();
      const companies = getCompanyNames(recruiter._id).map((c) => c.toLowerCase());
      const matchesSearch =
        q === "" ||
        recruiter.name.toLowerCase().includes(q) ||
        recruiter.email.toLowerCase().includes(q) ||
        companies.some((c) => c.includes(q)) ||
        (recruiter.phone && recruiter.phone.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && recruiter.isActive) ||
        (statusFilter === "suspended" && !recruiter.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [recruiters, searchTerm, statusFilter, jobsByRecruiter]);

  const formatDate = (dateString?: string) => {
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

  const getInitials = (name: string) => {
    if (!name) return "R";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Recruiter Management
            </h1>
            <span className="badge badge-accent badge-sm font-semibold">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/65">
            Manage company recruiters, review posted jobs, verify employer accounts, and control access.
          </p>
        </div>

        <button
          onClick={fetchData}
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
              Total Recruiters
            </p>
            <h3 className="text-2xl font-black mt-1">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-success/30 bg-success/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-success uppercase tracking-wider">
              Active Accounts
            </p>
            <h3 className="text-2xl font-black text-success mt-1">
              {stats.active}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/20 text-success flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              Total Jobs Posted
            </p>
            <h3 className="text-2xl font-black text-primary mt-1">
              {stats.totalJobsPosted}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-error/30 bg-error/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-error uppercase tracking-wider">
              Suspended
            </p>
            <h3 className="text-2xl font-black text-error mt-1">
              {stats.suspended}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by recruiter name, email, or company name..."
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

        {/* Status Tabs */}
        <div className="join">
          <button
            onClick={() => setStatusFilter("all")}
            className={`join-item btn btn-sm ${
              statusFilter === "all" ? "btn-accent font-bold" : "btn-ghost"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`join-item btn btn-sm ${
              statusFilter === "active" ? "btn-success text-success-content font-bold" : "btn-ghost"
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setStatusFilter("suspended")}
            className={`join-item btn btn-sm ${
              statusFilter === "suspended" ? "btn-error text-error-content font-bold" : "btn-ghost"
            }`}
          >
            Suspended ({stats.suspended})
          </button>
        </div>
      </div>

      {/* Recruiters Table */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200/60 text-xs uppercase font-bold text-base-content/70">
              <tr>
                <th className="py-4 px-4">Recruiter</th>
                <th className="py-4 px-4">Company</th>
                <th className="py-4 px-4">Jobs Posted</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-spinner loading-lg text-accent"></span>
                      <p className="text-sm font-medium text-base-content/60">
                        Loading recruiter data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredRecruiters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                      <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-3 text-base-content/40">
                        <Building2 className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold">No recruiters found</h4>
                      <p className="text-xs text-base-content/60 mt-1">
                        {searchTerm || statusFilter !== "all"
                          ? "No recruiters match your current search or filter criteria."
                          : "There are currently no registered employers or recruiters."}
                      </p>
                      {(searchTerm || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
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
                filteredRecruiters.map((recruiter) => {
                  const recruiterJobs = jobsByRecruiter.get(recruiter._id) || [];
                  const companies = getCompanyNames(recruiter._id);
                  const isToggling = togglingId === recruiter._id;

                  return (
                    <tr
                      key={recruiter._id}
                      className="hover:bg-base-200/40 transition-colors"
                    >
                      {/* Recruiter info */}
                      <td className="py-4 px-4 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          {recruiter.avatar ? (
                            <img
                              src={recruiter.avatar}
                              alt={recruiter.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-accent/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-primary text-accent-content font-extrabold text-xs flex items-center justify-center shadow-sm">
                              {getInitials(recruiter.name)}
                            </div>
                          )}
                          <div>
                            <div
                              onClick={() => setSelectedRecruiter(recruiter)}
                              className="font-bold text-sm text-base-content hover:text-accent transition-colors cursor-pointer"
                            >
                              {recruiter.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-base-content/60 mt-0.5">
                              <Mail className="w-3 h-3 text-base-content/40" />
                              <span className="truncate max-w-[180px]">{recruiter.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-4 min-w-[170px]">
                        {companies.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1">
                            {companies.slice(0, 2).map((c, i) => (
                              <span
                                key={i}
                                className="badge badge-sm badge-outline font-semibold text-xs"
                              >
                                <Building2 className="w-3 h-3 mr-1 text-base-content/60" />
                                {c}
                              </span>
                            ))}
                            {companies.length > 2 && (
                              <span className="badge badge-sm badge-ghost text-[10px]">
                                +{companies.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-base-content/40 italic">
                            No company listed
                          </span>
                        )}
                      </td>

                      {/* Jobs Posted */}
                      <td className="py-4 px-4 min-w-[120px]">
                        <span className="badge badge-primary badge-soft font-bold text-xs gap-1 py-2 px-3">
                          <Briefcase className="w-3 h-3" />
                          {recruiterJobs.length} {recruiterJobs.length === 1 ? "Job" : "Jobs"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 min-w-[120px]">
                        {recruiter.isActive ? (
                          <span className="badge badge-success badge-soft font-bold text-xs gap-1 py-2.5 px-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                            Active
                          </span>
                        ) : (
                          <span className="badge badge-error badge-soft font-bold text-xs gap-1 py-2.5 px-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Suspended
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-4 min-w-[120px] text-xs text-base-content/65">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                          {formatDate(recruiter.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 min-w-[190px] text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle Active / Suspend */}
                          <button
                            title={recruiter.isActive ? "Suspend Recruiter" : "Activate Recruiter"}
                            disabled={isToggling}
                            onClick={() => handleToggleStatus(recruiter)}
                            className={`btn btn-xs rounded-lg font-bold gap-1 transition-all ${
                              recruiter.isActive
                                ? "btn-warning btn-outline hover:!btn-warning"
                                : "btn-success btn-outline hover:!btn-success"
                            }`}
                          >
                            {recruiter.isActive ? (
                              <>
                                <Lock className="w-3 h-3" />
                                Suspend
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3 h-3" />
                                Activate
                              </>
                            )}
                          </button>

                          {/* View Detail Modal */}
                          <button
                            title="View Recruiter Profile & Jobs"
                            onClick={() => setSelectedRecruiter(recruiter)}
                            className="btn btn-ghost btn-xs btn-circle text-base-content/70 hover:text-accent"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Action */}
                          <button
                            title="Delete Recruiter"
                            onClick={() => setRecruiterToDelete(recruiter)}
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
        {!loading && filteredRecruiters.length > 0 && (
          <div className="border-t border-base-200 px-4 py-3 bg-base-100 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-2">
            <div>
              Showing <span className="font-bold text-base-content">{filteredRecruiters.length}</span> of{" "}
              <span className="font-bold text-base-content">{recruiters.length}</span> recruiters
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                Active: {stats.active}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error inline-block" />
                Suspended: {stats.suspended}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                Total Jobs: {stats.totalJobsPosted}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RECRUITER DETAILS & JOBS MODAL */}
      {selectedRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-base-200 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedRecruiter.avatar ? (
                  <img
                    src={selectedRecruiter.avatar}
                    alt={selectedRecruiter.name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-accent/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-primary text-accent-content font-black text-lg flex items-center justify-center shadow-md">
                    {getInitials(selectedRecruiter.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-extrabold">{selectedRecruiter.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-accent badge-soft font-bold text-xs">
                      Recruiter
                    </span>
                    {selectedRecruiter.isActive ? (
                      <span className="badge badge-success badge-soft font-bold text-[10px]">
                        Active
                      </span>
                    ) : (
                      <span className="badge badge-error badge-soft font-bold text-[10px]">
                        Suspended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecruiter(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              {/* Recruiter Contact info box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Email Address
                  </span>
                  <span className="font-semibold text-xs text-primary truncate block mt-0.5">
                    {selectedRecruiter.email}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Phone Number
                  </span>
                  <span className="font-medium text-xs block mt-0.5">
                    {selectedRecruiter.phone || "Not provided"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Member Since
                  </span>
                  <span className="font-medium text-xs block mt-0.5">
                    {formatDate(selectedRecruiter.createdAt)}
                  </span>
                </div>
              </div>

              {/* Jobs posted by this recruiter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Job Postings by this Recruiter ({(jobsByRecruiter.get(selectedRecruiter._id) || []).length})
                  </h4>
                </div>

                {(jobsByRecruiter.get(selectedRecruiter._id) || []).length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-base-200/30 border border-base-200 text-xs text-base-content/60">
                    This recruiter has not posted any jobs yet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {(jobsByRecruiter.get(selectedRecruiter._id) || []).map((job) => (
                      <div
                        key={job._id}
                        className="flex items-center justify-between p-3 rounded-xl bg-base-200/40 border border-base-300/60 text-xs hover:border-primary/40 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-sm text-base-content">
                            {job.title}
                          </div>
                          <div className="flex items-center gap-2 text-base-content/60 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {job.company}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`badge badge-sm font-bold uppercase text-[10px] ${
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
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setRecruiterToDelete(selectedRecruiter)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10 font-bold gap-1 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Delete Recruiter
              </button>

              <button
                onClick={() => handleToggleStatus(selectedRecruiter)}
                className={`btn btn-sm rounded-xl font-bold gap-1 ${
                  selectedRecruiter.isActive ? "btn-warning" : "btn-success"
                }`}
              >
                {selectedRecruiter.isActive ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Suspend Recruiter
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Activate Recruiter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {recruiterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold">Delete Recruiter Account?</h3>
            <p className="text-sm text-base-content/70 mt-2">
              Are you sure you want to permanently delete recruiter{" "}
              <span className="font-bold text-base-content">
                "{recruiterToDelete.name}"
              </span>{" "}
              ({recruiterToDelete.email})? This action cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                disabled={isDeleting}
                onClick={() => setRecruiterToDelete(null)}
                className="btn btn-ghost btn-sm rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteRecruiter}
                className="btn btn-error btn-sm rounded-xl font-bold gap-2"
              >
                {isDeleting && (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
                Delete Recruiter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterManagement;
