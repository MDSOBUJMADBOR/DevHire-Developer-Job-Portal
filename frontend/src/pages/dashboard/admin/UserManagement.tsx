import { useEffect, useState, useMemo } from "react";
import { api } from "../../../services/api";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Phone,
  Calendar,
  Lock,
  Unlock,
  Briefcase,
} from "lucide-react";

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYER" | "CANDIDATE" | string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api<ApiResponse<UserItem[]>>("/users");
      setUsers(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Quick role change directly from dropdown
  const handleQuickRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingRoleId(userId);
      setError(null);

      const targetUser = users.find((u) => u._id === userId);
      const res = await api<ApiResponse<UserItem>>(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });

      const updated = res.data;

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: updated?.role || newRole } : u
        )
      );

      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => (prev ? { ...prev, role: updated?.role || newRole } : null));
      }

      // Sync with localStorage if current logged-in user changed their own role
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.id === userId || parsed._id === userId)) {
            parsed.role = updated?.role || newRole;
            localStorage.setItem("user", JSON.stringify(parsed));
          }
        }
      } catch {
        // ignore
      }

      const roleDisplayName =
        newRole === "EMPLOYER"
          ? "Recruiter"
          : newRole === "ADMIN"
          ? "Admin"
          : "Candidate";

      setActionSuccess(
        `Role for "${targetUser?.name || "User"}" was changed to ${roleDisplayName}.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change user role");
    } finally {
      setUpdatingRoleId(null);
    }
  };

  // Toggle user active / suspended status
  const handleToggleStatus = async (user: UserItem) => {
    try {
      setTogglingId(user._id);
      setError(null);

      const nextStatus = !user.isActive;

      const res = await api<ApiResponse<UserItem>>(`/users/${user._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: nextStatus }),
      });

      const updated = res.data;

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, isActive: updated?.isActive !== undefined ? updated.isActive : nextStatus }
            : u
        )
      );

      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser((prev) =>
          prev ? { ...prev, isActive: nextStatus } : null
        );
      }

      setActionSuccess(
        `User "${user.name}" has been ${nextStatus ? "activated" : "suspended"}.`
      );
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      await api(`/users/${userToDelete._id}`, {
        method: "DELETE",
      });

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setActionSuccess(`User "${userToDelete.name}" was permanently deleted.`);

      if (selectedUser && selectedUser._id === userToDelete._id) {
        setSelectedUser(null);
      }
      setUserToDelete(null);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = users.length;
    const candidates = users.filter(
      (u) => (u.role || "").toUpperCase() === "CANDIDATE"
    ).length;
    const recruiters = users.filter(
      (u) =>
        (u.role || "").toUpperCase() === "EMPLOYER" ||
        (u.role || "").toUpperCase() === "RECRUITER"
    ).length;
    const admins = users.filter(
      (u) => (u.role || "").toUpperCase() === "ADMIN"
    ).length;
    const inactive = users.filter((u) => !u.isActive).length;

    return { total, candidates, recruiters, admins, inactive };
  }, [users]);

  // Filtering & search
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        q === "" ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        (user.phone && user.phone.toLowerCase().includes(q));

      const userRole = (user.role || "").toUpperCase();
      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "CANDIDATE" && userRole === "CANDIDATE") ||
        (roleFilter === "EMPLOYER" &&
          (userRole === "EMPLOYER" || userRole === "RECRUITER")) ||
        (roleFilter === "ADMIN" && userRole === "ADMIN");

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

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
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const renderRoleBadge = (role: string) => {
    const r = (role || "").toUpperCase();
    if (r === "ADMIN") {
      return (
        <span className="badge badge-secondary badge-soft font-bold text-xs gap-1 py-2.5 px-3">
          <Shield className="w-3 h-3" />
          Admin
        </span>
      );
    }
    if (r === "EMPLOYER" || r === "RECRUITER") {
      return (
        <span className="badge badge-accent badge-soft font-bold text-xs gap-1 py-2.5 px-3">
          <Briefcase className="w-3 h-3" />
          Recruiter
        </span>
      );
    }
    return (
      <span className="badge badge-primary badge-soft font-bold text-xs gap-1 py-2.5 px-3">
        <Users className="w-3 h-3" />
        Candidate
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              User Management
            </h1>
            <span className="badge badge-primary badge-sm font-semibold">
              Admin Portal
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/65">
            Manage all registered platform accounts, candidates, access roles, and permissions.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="btn btn-outline btn-sm rounded-xl gap-2 font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Alert Notifications */}
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
              Total Users
            </p>
            <h3 className="text-2xl font-black mt-1">{stats.total}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-info/30 bg-info/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-info uppercase tracking-wider">
              Candidates
            </p>
            <h3 className="text-2xl font-black text-info mt-1">
              {stats.candidates}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-info/20 text-info flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider">
              Recruiters
            </p>
            <h3 className="text-2xl font-black text-accent mt-1">
              {stats.recruiters}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-error/30 bg-error/5 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-error uppercase tracking-wider">
              Suspended
            </p>
            <h3 className="text-2xl font-black text-error mt-1">
              {stats.inactive}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-error/20 text-error flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter Tabs */}
          <div className="join">
            <button
              onClick={() => setRoleFilter("all")}
              className={`join-item btn btn-sm ${
                roleFilter === "all" ? "btn-primary font-bold" : "btn-ghost"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter("CANDIDATE")}
              className={`join-item btn btn-sm ${
                roleFilter === "CANDIDATE" ? "btn-info text-info-content font-bold" : "btn-ghost"
              }`}
            >
              Candidates
            </button>
            <button
              onClick={() => setRoleFilter("EMPLOYER")}
              className={`join-item btn btn-sm ${
                roleFilter === "EMPLOYER" ? "btn-accent text-accent-content font-bold" : "btn-ghost"
              }`}
            >
              Recruiters
            </button>
            <button
              onClick={() => setRoleFilter("ADMIN")}
              className={`join-item btn btn-sm ${
                roleFilter === "ADMIN" ? "btn-secondary text-secondary-content font-bold" : "btn-ghost"
              }`}
            >
              Admins
            </button>
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered select-sm rounded-xl text-xs font-semibold pr-8"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full text-left">
            <thead className="bg-base-200/60 text-xs uppercase font-bold text-base-content/70">
              <tr>
                <th className="py-4 px-4">User</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Registered Date</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                      <p className="text-sm font-medium text-base-content/60">
                        Loading users from database...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                      <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center mb-3 text-base-content/40">
                        <Users className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold">No users found</h4>
                      <p className="text-xs text-base-content/60 mt-1">
                        {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                          ? "No user accounts match your current filter or search criteria."
                          : "There are currently no registered users."}
                      </p>
                      {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setRoleFilter("all");
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
                filteredUsers.map((user) => {
                  const isToggling = togglingId === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-base-200/40 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-4 px-4 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent text-primary-content font-extrabold text-xs flex items-center justify-center shadow-sm">
                              {getInitials(user.name)}
                            </div>
                          )}
                          <div>
                            <div
                              onClick={() => setSelectedUser(user)}
                              className="font-bold text-sm text-base-content hover:text-primary transition-colors cursor-pointer"
                            >
                              {user.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-base-content/60 mt-0.5">
                              <Mail className="w-3 h-3 text-base-content/40" />
                              <span className="truncate max-w-[180px]">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Selector */}
                      <td className="py-4 px-4 min-w-[170px]">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={(user.role || "CANDIDATE").toUpperCase()}
                            disabled={updatingRoleId === user._id}
                            onChange={(e) =>
                              handleQuickRoleChange(user._id, e.target.value)
                            }
                            className={`select select-xs rounded-xl font-bold border transition-all cursor-pointer ${
                              (user.role || "").toUpperCase() === "ADMIN"
                                ? "select-secondary text-secondary border-secondary/40 bg-secondary/10 hover:bg-secondary/20"
                                : (user.role || "").toUpperCase() === "EMPLOYER" ||
                                  (user.role || "").toUpperCase() === "RECRUITER"
                                ? "select-accent text-accent border-accent/40 bg-accent/10 hover:bg-accent/20"
                                : "select-primary text-primary border-primary/40 bg-primary/10 hover:bg-primary/20"
                            }`}
                          >
                            <option value="CANDIDATE" className="text-base-content bg-base-100">
                              🎓 Candidate
                            </option>
                            <option value="EMPLOYER" className="text-base-content bg-base-100">
                              💼 Recruiter
                            </option>
                            <option value="ADMIN" className="text-base-content bg-base-100">
                              👑 Admin
                            </option>
                          </select>
                          {updatingRoleId === user._id && (
                            <span className="loading loading-spinner loading-xs text-primary shrink-0"></span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 min-w-[120px]">
                        {user.isActive ? (
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

                      {/* Contact */}
                      <td className="py-4 px-4 min-w-[140px] text-xs text-base-content/75">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                          <span>{user.phone || "Not provided"}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 min-w-[120px] text-xs text-base-content/65">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-base-content/40" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 min-w-[210px] text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Toggle Active / Suspend */}
                          <button
                            title={user.isActive ? "Suspend Account" : "Activate Account"}
                            disabled={isToggling}
                            onClick={() => handleToggleStatus(user)}
                            className={`btn btn-xs rounded-lg font-bold gap-1 transition-all ${
                              user.isActive
                                ? "btn-warning btn-outline hover:!btn-warning"
                                : "btn-success btn-outline hover:!btn-success"
                            }`}
                          >
                            {user.isActive ? (
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
                            title="View Profile Details"
                            onClick={() => setSelectedUser(user)}
                            className="btn btn-ghost btn-xs btn-circle text-base-content/70 hover:text-primary"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Action */}
                          <button
                            title="Delete User"
                            onClick={() => setUserToDelete(user)}
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
        {!loading && filteredUsers.length > 0 && (
          <div className="border-t border-base-200 px-4 py-3 bg-base-100 flex flex-col sm:flex-row items-center justify-between text-xs text-base-content/60 gap-2">
            <div>
              Showing <span className="font-bold text-base-content">{filteredUsers.length}</span> of{" "}
              <span className="font-bold text-base-content">{users.length}</span> total users
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-info inline-block" />
                Candidates: {stats.candidates}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                Recruiters: {stats.recruiters}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error inline-block" />
                Suspended: {stats.inactive}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-base-200 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-14 h-14 rounded-full object-cover ring-4 ring-primary/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-accent text-primary-content font-black text-lg flex items-center justify-center shadow-md">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-extrabold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {renderRoleBadge(selectedUser.role)}
                    {selectedUser.isActive ? (
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
                onClick={() => setSelectedUser(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-4 text-sm">
              <div className="space-y-3 bg-base-200/50 p-4 rounded-2xl border border-base-200">
                <div className="flex justify-between items-center py-1 border-b border-base-300/40">
                  <span className="text-xs text-base-content/60 font-semibold uppercase">
                    User ID
                  </span>
                  <span className="font-mono text-xs text-base-content/80 select-all">
                    {selectedUser._id}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-base-300/40">
                  <span className="text-xs text-base-content/60 font-semibold uppercase">
                    Email Address
                  </span>
                  <span className="font-semibold text-xs text-primary">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-base-300/40">
                  <span className="text-xs text-base-content/60 font-semibold uppercase">
                    Phone Number
                  </span>
                  <span className="font-medium text-xs">
                    {selectedUser.phone || "Not provided"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-base-300/40">
                  <span className="text-xs text-base-content/60 font-semibold uppercase">
                    System Role
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={(selectedUser.role || "CANDIDATE").toUpperCase()}
                      disabled={updatingRoleId === selectedUser._id}
                      onChange={(e) =>
                        handleQuickRoleChange(selectedUser._id, e.target.value)
                      }
                      className="select select-bordered select-xs rounded-xl font-bold cursor-pointer"
                    >
                      <option value="CANDIDATE">🎓 Candidate</option>
                      <option value="EMPLOYER">💼 Recruiter</option>
                      <option value="ADMIN">👑 Admin</option>
                    </select>
                    {updatingRoleId === selectedUser._id && (
                      <span className="loading loading-spinner loading-xs text-primary"></span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-xs text-base-content/60 font-semibold uppercase">
                    Account Created
                  </span>
                  <span className="font-medium text-xs">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setUserToDelete(selectedUser)}
                className="btn btn-ghost btn-sm text-error hover:bg-error/10 font-bold gap-1 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>

              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`btn btn-sm rounded-xl font-bold gap-1 ${
                  selectedUser.isActive ? "btn-warning" : "btn-success"
                }`}
              >
                {selectedUser.isActive ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Suspend User
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    Activate User
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold">Delete User Account?</h3>
            <p className="text-sm text-base-content/70 mt-2">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-base-content">
                "{userToDelete.name}"
              </span>{" "}
              ({userToDelete.email})? All associated applications, listings, and data will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                disabled={isDeleting}
                onClick={() => setUserToDelete(null)}
                className="btn btn-ghost btn-sm rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteUser}
                className="btn btn-error btn-sm rounded-xl font-bold gap-2"
              >
                {isDeleting && (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
