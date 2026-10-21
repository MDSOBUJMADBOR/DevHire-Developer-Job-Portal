import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
  User,
  MapPin,
  Globe,
  Briefcase,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface CandidateProfileData {
  headline: string;
  bio: string;
  location: string;
  experienceLevel: string;
  desiredSalary: string;
  workplacePreference: string;
  portfolio: string;
  github: string;
  linkedin: string;
  jobSearchStatus: string;
}

const DEFAULT_PROFILE: CandidateProfileData = {
  headline: "Full Stack Engineer | React, Node.js, TypeScript",
  bio: "Passionate software engineer with 4+ years of experience designing and building high-performance web applications, scalable REST APIs, and modern developer tools.",
  location: "Dhaka, Bangladesh",
  experienceLevel: "Mid-Level",
  desiredSalary: "$80,000 - $120,000 USD",
  workplacePreference: "Remote",
  portfolio: "https://myportfolio.dev",
  github: "https://github.com/developer",
  linkedin: "https://linkedin.com/in/developer",
  jobSearchStatus: "Actively Looking",
};

const MyProfile = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  const [profile, setProfile] = useState<CandidateProfileData>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_profile_extra");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_PROFILE;
  });

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      // Save user core details to backend API
      await api(`/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          phone,
          avatar,
        }),
      });

      // Sync local storage user
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.name = name;
        parsed.phone = phone;
        parsed.avatar = avatar;
        localStorage.setItem("user", JSON.stringify(parsed));
      }

      // Save candidate extended profile to localStorage
      localStorage.setItem("devhire_candidate_profile_extra", JSON.stringify(profile));

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Profile
            </h1>
            <span className="badge badge-primary badge-sm font-semibold">
              Candidate
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/65">
            Manage your personal profile, headline, biography, and professional links visible to hiring teams.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Profile"}
        </button>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="relative group shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary/20 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-accent text-primary-content font-black text-3xl flex items-center justify-center shadow-md">
                {name ? name.slice(0, 2).toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-xl sm:text-2xl font-black">{name || "Your Name"}</h2>
            <p className="text-sm font-medium text-primary">
              {profile.headline}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-base-content/65">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </span>
              <span>•</span>
              <span className="badge badge-accent badge-soft font-bold text-[10px]">
                {profile.jobSearchStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Personal Info */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Personal & Contact Information
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
                Email Address (Read-only)
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
                Location (City, Country)
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="e.g. San Francisco, CA or Remote"
                className="input input-bordered w-full rounded-2xl text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                Profile Avatar URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full rounded-2xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Professional Details & Bio */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Professional Headline & Biography
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                Headline / Title
              </label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                placeholder="e.g. Senior Frontend Engineer | React, Next.js"
                className="input input-bordered w-full rounded-2xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                Professional Bio / Summary
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell recruiters about your background, key strengths, and goals..."
                className="textarea textarea-bordered w-full rounded-2xl text-sm leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Experience Level
                </label>
                <select
                  value={profile.experienceLevel}
                  onChange={(e) => setProfile({ ...profile, experienceLevel: e.target.value })}
                  className="select select-bordered w-full rounded-2xl text-sm font-semibold"
                >
                  <option value="Entry-Level">Entry-Level (0-2 years)</option>
                  <option value="Mid-Level">Mid-Level (3-5 years)</option>
                  <option value="Senior">Senior (5-8 years)</option>
                  <option value="Lead / Staff">Lead / Staff (8+ years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Workplace Preference
                </label>
                <select
                  value={profile.workplacePreference}
                  onChange={(e) => setProfile({ ...profile, workplacePreference: e.target.value })}
                  className="select select-bordered w-full rounded-2xl text-sm font-semibold"
                >
                  <option value="Remote">Remote Only</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Flexible">Open to All</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                  Job Search Status
                </label>
                <select
                  value={profile.jobSearchStatus}
                  onChange={(e) => setProfile({ ...profile, jobSearchStatus: e.target.value })}
                  className="select select-bordered w-full rounded-2xl text-sm font-semibold"
                >
                  <option value="Actively Looking">Actively Looking</option>
                  <option value="Open to Offers">Open to Offers</option>
                  <option value="Not Looking">Not Looking</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Portfolio Links */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Social & Portfolio Links
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                Portfolio Website
              </label>
              <input
                type="url"
                value={profile.portfolio}
                onChange={(e) => setProfile({ ...profile, portfolio: e.target.value })}
                placeholder="https://myportfolio.com"
                className="input input-bordered w-full rounded-2xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                GitHub Profile
              </label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                placeholder="https://github.com/username"
                className="input input-bordered w-full rounded-2xl text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-base-content/70 block mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="input input-bordered w-full rounded-2xl text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary rounded-xl font-bold gap-2 px-8"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save My Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
