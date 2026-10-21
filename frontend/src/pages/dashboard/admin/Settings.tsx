import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
  Shield,
  Bell,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Globe,
  Briefcase,
  KeyRound,
  User as UserIcon,
} from "lucide-react";

interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  allowSignups: boolean;
  autoApproveJobs: boolean;
  maxJobsPerRecruiter: number;
  jobDurationDays: number;
  requireRecruiterVerification: boolean;
  notifyOnNewJob: boolean;
  notifyOnNewUser: boolean;
  weeklyReportDigest: boolean;
  sessionTimeoutHours: number;
  require2FA: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  siteName: "DevHire — Developer Job Portal",
  supportEmail: "support@devhire.com",
  defaultCurrency: "USD",
  maintenanceMode: false,
  allowSignups: true,
  autoApproveJobs: false,
  maxJobsPerRecruiter: 25,
  jobDurationDays: 45,
  requireRecruiterVerification: true,
  notifyOnNewJob: true,
  notifyOnNewUser: true,
  weeklyReportDigest: true,
  sessionTimeoutHours: 24,
  require2FA: false,
};

const Settings = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "general" | "moderation" | "security" | "notifications" | "profile"
  >("general");

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
      const saved = localStorage.getItem("devhire_admin_settings");
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Admin Profile Form state
  const [adminName, setAdminName] = useState(user?.name || "");
  const [adminPhone, setAdminPhone] = useState(user?.phone || "");
  const [adminAvatar, setAdminAvatar] = useState(user?.avatar || "");
  const [adminEmail, setAdminEmail] = useState(user?.email || "");

  // Password update form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & Feedback states
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setAdminName(user.name || "");
      setAdminPhone(user.phone || "");
      setAdminAvatar(user.avatar || "");
      setAdminEmail(user.email || "");
    }
  }, [user]);

  // Save platform settings to localStorage
  const handleSavePlatformSettings = (e?: FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      localStorage.setItem("devhire_admin_settings", JSON.stringify(settings));
      setSuccessMsg("Platform settings saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      setErrorMsg("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Save Admin personal profile to backend
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setErrorMsg("User account not found");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      const updateData: Record<string, string> = {
        name: adminName,
        phone: adminPhone,
        avatar: adminAvatar,
      };

      await api<{ success: boolean; data: Record<string, unknown> }>(
        `/users/${user.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData),
        }
      );

      // Sync localStorage user
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = adminName;
        parsed.phone = adminPhone;
        parsed.avatar = adminAvatar;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      setSuccessMsg("Admin profile updated successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);

      if (!user?.id) throw new Error("User ID missing");

      await api(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("Password changed successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Settings
            </h1>
            <span className="badge badge-primary badge-sm font-semibold">
              Admin Control Center
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/65">
            Configure system parameters, job moderation policies, security, and notifications.
          </p>
        </div>

        {activeTab !== "profile" && activeTab !== "security" && (
          <button
            onClick={() => handleSavePlatformSettings()}
            disabled={saving}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {/* Alert Notifications */}
      {successMsg && (
        <div className="alert alert-success shadow-sm rounded-2xl flex items-center gap-3 py-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            className="btn btn-ghost btn-xs btn-circle ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-error shadow-sm rounded-2xl flex items-center gap-3 py-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="btn btn-ghost btn-xs btn-circle ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-base-200 pb-3">
        {[
          { id: "general", label: "General", icon: Sliders },
          { id: "moderation", label: "Job Moderation", icon: Briefcase },
          { id: "security", label: "Security & Passwords", icon: Shield },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "profile", label: "My Admin Profile", icon: UserIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(
                  tab.id as
                    | "general"
                    | "moderation"
                    | "security"
                    | "notifications"
                    | "profile"
                );
                setErrorMsg(null);
              }}
              className={`btn btn-sm rounded-xl font-bold gap-2 transition-all ${
                isActive
                  ? "btn-primary shadow-sm"
                  : "btn-ghost text-base-content/70 hover:text-base-content hover:bg-base-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GENERAL SETTINGS */}
      {activeTab === "general" && (
        <form onSubmit={handleSavePlatformSettings} className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Platform Identity & Public Defaults
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Portal Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="input input-bordered w-full rounded-2xl text-sm"
                  placeholder="e.g. DevHire — Developer Job Portal"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Support & Contact Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, supportEmail: e.target.value })
                  }
                  className="input input-bordered w-full rounded-2xl text-sm"
                  placeholder="support@devhire.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Default Salary Currency
                </label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultCurrency: e.target.value })
                  }
                  className="select select-bordered w-full rounded-2xl text-sm font-semibold"
                >
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Platform Session Timeout (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={settings.sessionTimeoutHours}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sessionTimeoutHours: Number(e.target.value),
                    })
                  }
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
              </div>
            </div>

            <div className="divider my-2"></div>

            {/* Toggle Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm">Allow Public Registration</div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    Allow new candidates and recruiters to register an account on DevHire.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowSignups}
                  onChange={(e) =>
                    setSettings({ ...settings, allowSignups: e.target.checked })
                  }
                  className="toggle toggle-primary"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    Maintenance Mode
                    {settings.maintenanceMode && (
                      <span className="badge badge-warning badge-xs font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    When enabled, only administrators can access the system. Visitors will see a maintenance notice.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="toggle toggle-warning"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary rounded-xl font-bold gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                Save General Settings
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: MODERATION SETTINGS */}
      {activeTab === "moderation" && (
        <form onSubmit={handleSavePlatformSettings} className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" />
              Job Moderation & Recruiter Policies
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm">
                    Auto-Approve Job Postings
                  </div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    If disabled, all recruiter postings will enter "Pending" review and require manual approval in Job Management.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoApproveJobs}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      autoApproveJobs: e.target.checked,
                    })
                  }
                  className="toggle toggle-accent"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm">
                    Require Recruiter Verification
                  </div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    Recruiter accounts must be reviewed and approved by an administrator before their jobs are publicly searchable.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireRecruiterVerification}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      requireRecruiterVerification: e.target.checked,
                    })
                  }
                  className="toggle toggle-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Job Expiration Duration (Days)
                </label>
                <input
                  type="number"
                  min={7}
                  max={180}
                  value={settings.jobDurationDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      jobDurationDays: Number(e.target.value),
                    })
                  }
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
                <span className="text-[11px] text-base-content/50 block mt-1">
                  Active jobs will automatically archive or show as expired after this period.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Max Active Jobs Per Recruiter
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={settings.maxJobsPerRecruiter}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxJobsPerRecruiter: Number(e.target.value),
                    })
                  }
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
                <span className="text-[11px] text-base-content/50 block mt-1">
                  Prevents spam by limiting simultaneous active listings per employer.
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-accent rounded-xl font-bold gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                Save Moderation Policies
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: SECURITY & PASSWORDS */}
      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Admin Password */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-secondary" />
              Update Administrator Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Current Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="input input-bordered w-full rounded-2xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input input-bordered w-full rounded-2xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="input input-bordered w-full rounded-2xl text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-base-content/70">
                <input
                  type="checkbox"
                  id="showPass"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="checkbox checkbox-xs checkbox-primary"
                />
                <label htmlFor="showPass" className="cursor-pointer">
                  Show passwords
                </label>
              </div>

              <button
                type="submit"
                disabled={saving || !newPassword || !confirmPassword}
                className="btn btn-secondary rounded-xl font-bold gap-2 px-6 mt-2"
              >
                <Lock className="w-4 h-4" />
                {saving ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* System Security Flags */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Advanced Authentication Policies
            </h3>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
              <div>
                <div className="font-bold text-sm">
                  Require Two-Factor Authentication (2FA) for Admins
                </div>
                <p className="text-xs text-base-content/65 mt-0.5">
                  Enforces secondary verification codes on login for privileged admin accounts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.require2FA}
                onChange={(e) =>
                  setSettings({ ...settings, require2FA: e.target.checked })
                }
                className="toggle toggle-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSavePlatformSettings} className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Email & System Alert Preferences
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm">New Job Posting Alerts</div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    Receive an immediate email notification when a recruiter submits a new job.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnNewJob}
                  onChange={(e) =>
                    setSettings({ ...settings, notifyOnNewJob: e.target.checked })
                  }
                  className="toggle toggle-warning"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm">
                    New User Registration Alerts
                  </div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    Receive email notifications when new candidates or recruiters register.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnNewUser}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifyOnNewUser: e.target.checked,
                    })
                  }
                  className="toggle toggle-warning"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
                <div>
                  <div className="font-bold text-sm">Weekly Platform Analytics Digest</div>
                  <p className="text-xs text-base-content/65 mt-0.5">
                    Receive a weekly summary of active jobs, applicant counts, and recruitment metrics.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyReportDigest}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      weeklyReportDigest: e.target.checked,
                    })
                  }
                  className="toggle toggle-warning"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-warning rounded-xl font-bold gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                Save Notification Preferences
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 5: MY ADMIN PROFILE */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Administrator Personal Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="input input-bordered w-full rounded-2xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Account Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  disabled
                  className="input input-bordered w-full rounded-2xl text-sm bg-base-200/60 cursor-not-allowed opacity-80"
                />
                <span className="text-[11px] text-base-content/50 block mt-1">
                  Primary login email cannot be edited directly.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="input input-bordered w-full rounded-2xl text-sm"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={adminAvatar}
                  onChange={(e) => setAdminAvatar(e.target.value)}
                  className="input input-bordered w-full rounded-2xl text-sm"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary rounded-xl font-bold gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Profile Details"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
