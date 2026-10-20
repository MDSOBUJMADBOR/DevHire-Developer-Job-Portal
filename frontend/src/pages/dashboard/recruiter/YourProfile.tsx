import { useState, type FormEvent } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  Briefcase,
  ShieldCheck,
  Edit3,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";

interface UserUpdateResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    avatar?: string;
    isActive: boolean;
  };
}

const YourProfile = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Profile state initialized with existing user info or local preferences
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 234-5678");
  const [companyName, setCompanyName] = useState(
    () => localStorage.getItem("recruiter_company_name") || "TechCorp Solutions"
  );
  const [website, setWebsite] = useState(
    () => localStorage.getItem("recruiter_website") || "https://techcorp.example.com"
  );
  const [location, setLocation] = useState(
    () => localStorage.getItem("recruiter_location") || "San Francisco, CA (Remote)"
  );
  const [industry, setIndustry] = useState(
    () => localStorage.getItem("recruiter_industry") || "Software & Technology"
  );
  const [companySize, setCompanySize] = useState(
    () => localStorage.getItem("recruiter_company_size") || "50-200 Employees"
  );
  const [bio, setBio] = useState(
    () =>
      localStorage.getItem("recruiter_bio") ||
      "We build innovative, scalable cloud platforms and developer tools. Constantly looking for ambitious engineers to join our high-impact teams."
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Update basic user info in backend if user ID is available
      if (user?.id) {
        await api<UserUpdateResponse>(`/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
          }),
        });

        // Update cached user in localStorage
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            parsed.name = name.trim();
            parsed.phone = phone.trim();
            localStorage.setItem("user", JSON.stringify(parsed));
          } catch {
            // Ignore parse errors
          }
        }
      }

      // 2. Persist company/recruiter branding details locally
      localStorage.setItem("recruiter_company_name", companyName.trim());
      localStorage.setItem("recruiter_website", website.trim());
      localStorage.setItem("recruiter_location", location.trim());
      localStorage.setItem("recruiter_industry", industry.trim());
      localStorage.setItem("recruiter_company_size", companySize.trim());
      localStorage.setItem("recruiter_bio", bio.trim());

      setSuccessMsg("Your profile and company information have been saved successfully!");
      setIsEditing(false);

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "RC";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <p className="mt-1 text-sm text-base-content/60">
            Manage your personal recruiter profile and company identity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          className={`btn btn-sm rounded-xl font-bold gap-2 ${
            isEditing
              ? "btn-ghost border border-base-300"
              : "btn-primary"
          }`}
        >
          {isEditing ? (
            "Cancel Editing"
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Cover banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-primary/30 via-primary/15 to-base-300/60 relative" />

        <div className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-2xl border-4 border-base-100 bg-primary font-black text-2xl sm:text-3xl text-primary-content shadow-lg ring-1 ring-base-300">
                {user?.name ? getInitials(user.name) : "RC"}
              </div>

              <div className="mb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                    {name || user?.name || "Recruiter"}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified Recruiter
                  </span>
                </div>
                <p className="text-sm text-base-content/60 font-medium">
                  {companyName} • {location}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-end">
              <span className="badge badge-success badge-soft font-semibold text-xs py-2 px-3">
                Active Hiring
              </span>
              <span className="badge badge-ghost font-semibold text-xs py-2 px-3">
                Role: {user?.role || "EMPLOYER"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form / View */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section 1: Personal Details */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-base-300 pb-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold">Personal Information</h3>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-sm font-semibold text-base-content py-1.5">
                    {name || user?.name || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Email Address
                </label>
                <div className="flex items-center gap-2 text-sm text-base-content py-1.5">
                  <Mail className="h-4 w-4 text-base-content/40 shrink-0" />
                  <span className="font-semibold">{user?.email || "N/A"}</span>
                  <span className="badge badge-ghost text-[10px] ml-auto">
                    Account Email
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-base-content py-1.5">
                    <Phone className="h-4 w-4 text-base-content/40 shrink-0" />
                    <span className="font-semibold">{phone || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Account Type
                </label>
                <div className="flex items-center gap-2 text-sm text-base-content py-1.5">
                  <Briefcase className="h-4 w-4 text-base-content/40 shrink-0" />
                  <span className="font-semibold">{user?.role || "EMPLOYER"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Company & Organization Details */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 border-b border-base-300 pb-3">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-base font-bold">Company & Branding</h3>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <p className="text-sm font-semibold text-base-content py-1.5">
                    {companyName || "Not provided"}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Website URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-sm py-1.5">
                    <Globe className="h-4 w-4 text-base-content/40 shrink-0" />
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-primary hover:underline truncate"
                      >
                        {website}
                      </a>
                    ) : (
                      <span className="text-base-content/60">Not provided</span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                    Location / HQ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. New York, NY"
                      className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-base-content py-1.5">
                      <MapPin className="h-4 w-4 text-base-content/40 shrink-0" />
                      <span className="font-semibold truncate">{location}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                    Company Size
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      placeholder="e.g. 50-200 Employees"
                      className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-sm text-base-content py-1.5">
                      <Users className="h-4 w-4 text-base-content/40 shrink-0" />
                      <span className="font-semibold truncate">{companySize}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/60">
                  Industry / Focus
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. FinTech, AI, SaaS"
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition focus:border-primary/60"
                  />
                ) : (
                  <p className="text-sm font-semibold text-base-content py-1.5">
                    {industry}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: About / Hiring Bio */}
        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-base-content/60">
            About Company & Hiring Philosophy
          </label>
          {isEditing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell candidates about your company culture, technology stack, and engineering team values…"
              className="w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-y"
            />
          ) : (
            <div className="rounded-xl border border-base-300/60 bg-base-200/30 p-4 text-sm leading-relaxed text-base-content/80">
              {bio || "No company overview provided yet."}
            </div>
          )}
        </div>

        {/* Action Buttons when editing */}
        {isEditing && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={loading}
              onClick={() => setIsEditing(false)}
              className="btn btn-ghost rounded-xl border border-base-300 px-6 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary rounded-xl px-8 font-bold gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving Profile…" : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default YourProfile;
