import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
  User,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
} from "lucide-react";

const CandidateSettings = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");

  // Profile Form state
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Candidate Preferences
  const [emailJobAlerts, setEmailJobAlerts] = useState(true);
  const [profileVisibleToRecruiters, setProfileVisibleToRecruiters] = useState(true);

  // Status feedback
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  // Save profile changes
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      await api(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          phone,
          avatar,
        }),
      });

      // Sync localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = name;
        parsed.phone = phone;
        parsed.avatar = avatar;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      setSuccessMsg("Profile details updated successfully.");
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
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
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

      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("Password changed successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-base-content/65">
          Manage your candidate profile information, security password, and notifications.
        </p>
      </div>

      {/* Notifications */}
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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-base-200 pb-3">
        {[
          { id: "profile", label: "My Profile", icon: User },
          { id: "security", label: "Password & Security", icon: Shield },
          { id: "preferences", label: "Job Preferences", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as "profile" | "security" | "preferences");
                setErrorMsg(null);
              }}
              className={`btn btn-sm rounded-xl font-bold gap-2 transition-all ${
                isActive
                  ? "btn-primary shadow-sm"
                  : "btn-ghost text-base-content/70 hover:text-base-content"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Candidate Personal Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full rounded-2xl text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="input input-bordered w-full rounded-2xl text-sm bg-base-200/60 opacity-80 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Profile Avatar URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="input input-bordered w-full rounded-2xl text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary rounded-xl font-bold gap-2 px-6"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: SECURITY */}
      {activeTab === "security" && (
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4 max-w-lg">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Change Password
            </h3>

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
                placeholder="Repeat password"
                className="input input-bordered w-full rounded-2xl text-sm"
                required
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <input
                type="checkbox"
                id="showCandPass"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="checkbox checkbox-xs checkbox-primary"
              />
              <label htmlFor="showCandPass" className="cursor-pointer">
                Show passwords
              </label>
            </div>

            <button
              type="submit"
              disabled={saving || !newPassword || !confirmPassword}
              className="btn btn-primary rounded-xl font-bold gap-2 px-6 mt-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: PREFERENCES */}
      {activeTab === "preferences" && (
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Alerts & Privacy Preferences
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
              <div>
                <div className="font-bold text-sm">Job Opportunity Alerts</div>
                <p className="text-xs text-base-content/65 mt-0.5">
                  Receive recommendations when new developer jobs match your skills.
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailJobAlerts}
                onChange={(e) => setEmailJobAlerts(e.target.checked)}
                className="toggle toggle-primary"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-base-200/40 border border-base-200">
              <div>
                <div className="font-bold text-sm">Visible to Recruiters</div>
                <p className="text-xs text-base-content/65 mt-0.5">
                  Allow verified recruiters to view your profile and contact you with opportunities.
                </p>
              </div>
              <input
                type="checkbox"
                checked={profileVisibleToRecruiters}
                onChange={(e) => setProfileVisibleToRecruiters(e.target.checked)}
                className="toggle toggle-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateSettings;
