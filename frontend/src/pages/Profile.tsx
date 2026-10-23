import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
  MapPin,
  Globe,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Code2,
  ArrowUpRight,
  LogOut,
  Check,
  FileText,
  Bookmark,
  Layers,
} from "lucide-react";

interface ProfileExtra {
  headline: string;
  bio: string;
  location: string;
  workplace: string;
  experienceLevel: string;
  github: string;
  linkedin: string;
  portfolio: string;
}

const DEFAULT_EXTRA: ProfileExtra = {
  headline: "Senior Software Engineer | Full-Stack Developer",
  bio: "Passionate developer dedicated to building responsive, scalable, and modern developer-first web applications using React, TypeScript, and cloud technologies.",
  location: "Remote / Global",
  workplace: "Remote",
  experienceLevel: "Senior Level (5+ yrs)",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  portfolio: "https://myportfolio.dev",
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Basic Account Data
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "CANDIDATE");

  // Extended Profile Data (Persisted locally for rich developer representation)
  const [extra, setExtra] = useState<ProfileExtra>(() => {
    try {
      const saved = localStorage.getItem(`devhire_profile_${user?.email || "guest"}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EXTRA;
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setRole(user.role || "CANDIDATE");
    }
  }, [user]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const userId = user?.id || (user as any)?._id;

    try {
      // 1. Update core user in MongoDB via backend PATCH /api/users/:id if userId exists
      if (userId) {
        await api(`/users/${userId}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
          }),
        });

        // Update local session user in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.name = name.trim();
          parsed.phone = phone.trim();
          localStorage.setItem("user", JSON.stringify(parsed));
        }
      }

      // 2. Persist extended profile preferences locally
      localStorage.setItem(
        `devhire_profile_${user?.email || "guest"}`,
        JSON.stringify(extra)
      );

      setSuccessMsg("Profile information updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const initial = (name.trim()?.[0] || email[0] || "U").toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-200/40 pb-20">
      {/* Top Profile Hero Banner */}
      <div className="relative overflow-hidden border-b border-base-300/70 bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/10 pt-10 pb-16">
        <div className="absolute inset-0 bg-radial-[at_top_right] from-primary/20 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto container px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED DEVELOPER PROFILE
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-base-content">
                My Profile
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-base-content/60">
                Manage your developer credentials, contact information, and platform visibility.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
              <Link
                to="/dashboard"
                className="btn btn-outline btn-sm rounded-xl font-bold gap-1.5 text-xs"
              >
                Go to Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className={`btn btn-sm rounded-xl font-bold gap-1.5 text-xs ${
                  isEditing ? "btn-neutral" : "btn-primary"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto container px-4 sm:px-6 lg:px-8 -mt-10">
        {/* Toast alerts */}
        {successMsg && (
          <div className="mb-6 alert alert-success rounded-2xl shadow-lg border border-success/30 flex items-center justify-between text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center gap-2 text-success-content font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              className="btn btn-ghost btn-xs btn-circle"
            >
              ✕
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 alert alert-error rounded-2xl shadow-lg border border-error/30 flex items-center justify-between text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center gap-2 text-error-content font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="btn btn-ghost btn-xs btn-circle"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Identity Card & Quick Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-primary-content font-black text-3xl flex items-center justify-center shadow-lg shadow-primary/25 ring-4 ring-base-100">
                    {initial}
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-content ring-2 ring-base-100">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-extrabold text-base-content break-words">
                  {name || "Developer"}
                </h2>
                <p className="text-xs text-base-content/60 font-medium">
                  {extra.headline}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                  <span className="badge badge-primary badge-soft text-xs font-bold py-1 px-3">
                    {role.toUpperCase()}
                  </span>
                  <span className="badge badge-success badge-soft text-xs font-bold py-1 px-3">
                    Active Status
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-base-200 space-y-3 text-xs">
                <div className="flex items-center justify-between text-base-content/70">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-base-content/40" />
                    Email
                  </span>
                  <span className="font-semibold text-base-content truncate max-w-[170px]">
                    {email}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base-content/70">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-base-content/40" />
                    Phone
                  </span>
                  <span className="font-semibold text-base-content">
                    {phone || "Not provided"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base-content/70">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-base-content/40" />
                    Location
                  </span>
                  <span className="font-semibold text-base-content">
                    {extra.location}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base-content/70">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-base-content/40" />
                    Workplace
                  </span>
                  <span className="badge badge-neutral badge-xs font-bold">
                    {extra.workplace}
                  </span>
                </div>
              </div>

              {/* Social / Portfolio Links */}
              <div className="mt-6 pt-5 border-t border-base-200">
                <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mb-3">
                  Connected Platforms
                </p>
                <div className="flex items-center justify-center gap-2">
                  <a
                    href={extra.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-base-300 hover:border-primary text-xs font-bold hover:text-primary transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.29 9.29 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.28 10.28 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href={extra.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-base-300 hover:border-primary text-xs font-bold hover:text-primary transition-all"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href={extra.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-base-300 hover:border-primary text-xs font-bold hover:text-primary transition-all"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Portal Navigation Links */}
            <div className="rounded-3xl border border-base-300/80 bg-base-100 p-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/50 px-2 mb-2">
                Quick Portal Shortcuts
              </h3>
              {role === "CANDIDATE" ? (
                <>
                  <Link
                    to="/dashboard/candidate/applications"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/70 text-xs font-semibold text-base-content transition"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      My Applications
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  <Link
                    to="/dashboard/candidate/saved-jobs"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/70 text-xs font-semibold text-base-content transition"
                  >
                    <span className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-primary" />
                      Saved Jobs
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  <Link
                    to="/dashboard/candidate/resume"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/70 text-xs font-semibold text-base-content transition"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      ATS Resume Analyzer
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard/recruiter/manage-jobs"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/70 text-xs font-semibold text-base-content transition"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Manage Job Listings
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  <Link
                    to="/dashboard/recruiter/post-job"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-base-200/70 text-xs font-semibold text-base-content transition"
                  >
                    <span className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-primary" />
                      Post a New Job
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                </>
              )}
            </div>

            {/* Logout Action Card */}
            <div className="rounded-3xl border border-error/20 bg-error/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-error">Session Security</p>
                <p className="text-[11px] text-base-content/60">Log out of your account on this device</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-error btn-xs rounded-xl font-bold gap-1 text-error-content"
              >
                <LogOut className="w-3 h-3" /> Log out
              </button>
            </div>
          </div>

          {/* Right Column: Editable Profile Information */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-base-300/80 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-base-200 mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-base-content">
                    Developer & Account Details
                  </h2>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    {isEditing
                      ? "Make changes below and click Save to update your profile."
                      : "Click 'Edit Profile' above to update your professional information."}
                  </p>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-xs rounded-xl font-bold gap-1"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {/* 1. Basic Account Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3.5 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5" />
                    Account Credentials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        required
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50 disabled:border-base-300 disabled:text-base-content/80"
                      />
                    </div>

                    {/* Email (Read-only for security) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-base-content">
                          Email Address
                        </label>
                        <span className="badge badge-success badge-xs font-bold text-[9px]">
                          Verified
                        </span>
                      </div>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-200/50 border-base-300 text-base-content/70 cursor-not-allowed"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50 disabled:border-base-300 disabled:text-base-content/80"
                      />
                    </div>

                    {/* Role (Read-only) */}
                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        Account Role
                      </label>
                      <input
                        type="text"
                        value={role}
                        disabled
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-200/50 border-base-300 font-bold uppercase text-primary cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Professional & Developer Details */}
                <div className="pt-4 border-t border-base-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3.5 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    Professional Headline & Bio
                  </h3>
                  <div className="space-y-4">
                    {/* Headline */}
                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        Professional Headline
                      </label>
                      <input
                        type="text"
                        value={extra.headline}
                        onChange={(e) =>
                          setExtra({ ...extra, headline: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="e.g. Senior Frontend Engineer | React, Next.js, TypeScript"
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50 disabled:border-base-300 disabled:text-base-content/80"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        Professional Summary & Bio
                      </label>
                      <textarea
                        rows={3}
                        value={extra.bio}
                        onChange={(e) =>
                          setExtra({ ...extra, bio: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="Write a brief overview of your background, tech expertise, and achievements..."
                        className="textarea textarea-bordered w-full rounded-xl text-xs sm:text-sm bg-base-100 leading-relaxed disabled:bg-base-200/50 disabled:border-base-300 disabled:text-base-content/80"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Location */}
                      <div>
                        <label className="block text-xs font-bold text-base-content mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          value={extra.location}
                          onChange={(e) =>
                            setExtra({ ...extra, location: e.target.value })
                          }
                          disabled={!isEditing}
                          placeholder="e.g. San Francisco, CA"
                          className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50"
                        />
                      </div>

                      {/* Workplace Preference */}
                      <div>
                        <label className="block text-xs font-bold text-base-content mb-1.5">
                          Workplace
                        </label>
                        <select
                          value={extra.workplace}
                          onChange={(e) =>
                            setExtra({ ...extra, workplace: e.target.value })
                          }
                          disabled={!isEditing}
                          className="select select-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50"
                        >
                          <option value="Remote">Remote</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="On-site">On-site</option>
                        </select>
                      </div>

                      {/* Experience Level */}
                      <div>
                        <label className="block text-xs font-bold text-base-content mb-1.5">
                          Experience Level
                        </label>
                        <select
                          value={extra.experienceLevel}
                          onChange={(e) =>
                            setExtra({ ...extra, experienceLevel: e.target.value })
                          }
                          disabled={!isEditing}
                          className="select select-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50"
                        >
                          <option value="Entry Level (0-2 yrs)">Entry Level (0-2 yrs)</option>
                          <option value="Mid Level (2-5 yrs)">Mid Level (2-5 yrs)</option>
                          <option value="Senior Level (5+ yrs)">Senior Level (5+ yrs)</option>
                          <option value="Lead / Staff (8+ yrs)">Lead / Staff (8+ yrs)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Developer Portfolios & Socials */}
                <div className="pt-4 border-t border-base-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Portfolio & Social Links
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={extra.github}
                        onChange={(e) =>
                          setExtra({ ...extra, github: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="https://github.com/username"
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={extra.linkedin}
                        onChange={(e) =>
                          setExtra({ ...extra, linkedin: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/username"
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-base-content mb-1.5">
                        Portfolio / Website
                      </label>
                      <input
                        type="url"
                        value={extra.portfolio}
                        onChange={(e) =>
                          setExtra({ ...extra, portfolio: e.target.value })
                        }
                        disabled={!isEditing}
                        placeholder="https://mywebsite.com"
                        className="input input-bordered w-full rounded-xl text-xs sm:text-sm h-11 bg-base-100 disabled:bg-base-200/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Changes Floating Action Bar */}
                {isEditing && (
                  <div className="pt-5 border-t border-base-200 flex items-center justify-end gap-3 animate-fadeIn">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-ghost btn-sm rounded-xl font-bold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn btn-primary btn-sm rounded-xl font-bold px-6 text-xs gap-1.5 shadow-md shadow-primary/20"
                    >
                      {saving ? (
                        <>
                          <span className="loading loading-spinner loading-xs" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}