import { useState, type FormEvent } from "react";
import { api } from "../../../services/api";
import {
  Briefcase,
  Building2,
  DollarSign,
  FileText,
  MapPin,
  Calendar,
  Mail,
  Sparkles,
  RotateCcw,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Tag,
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

interface PostJobProps {
  onNavigateToManage?: () => void;
}

const PostJob = ({ onNavigateToManage }: PostJobProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [workplace, setWorkplace] = useState("Remote");
  const [type, setType] = useState("Full-time");
  const [level, setLevel] = useState("Mid");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [posting, setPosting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory(CATEGORIES[0]);
    setCompany("");
    setLocation("");
    setWorkplace("Remote");
    setType("Full-time");
    setLevel("Mid");
    setSalaryMin("");
    setSalaryMax("");
    setSkills("");
    setDescription("");
    setRequirements("");
    setDeadline("");
    setContactEmail("");
  };

  const parsedSkills = skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      setError("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    const jobData = {
      title: title.trim(),
      category,
      company: company.trim(),
      location: location.trim(),
      workplace,
      type,
      level,
      salary:
        salaryMin || salaryMax
          ? {
              min: salaryMin ? Number(salaryMin) : null,
              max: salaryMax ? Number(salaryMax) : null,
              currency: "USD",
            }
          : null,
      skills: parsedSkills,
      description: description.trim(),
      requirements: requirements.trim(),
      deadline: deadline || null,
      contactEmail: contactEmail.trim(),
    };

    setPosting(true);

    try {
      await api("/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      });

      setSuccess(`"${jobData.title}" posted successfully! It has been added to your jobs list.`);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post job"
      );
    } finally {
      setPosting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-base-300 dark:border-base-content/15 bg-base-100 dark:bg-base-300/40 px-4 py-2.5 text-sm text-base-content outline-none transition-all placeholder:text-base-content/40 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:focus:ring-primary/25 dark:[color-scheme:dark]";
  const labelClass =
    "mb-1.5 block text-xs font-bold uppercase tracking-wider text-base-content/70 dark:text-base-content/80";

  return (
    <div className="space-y-6">
      {/* Header banner with sleek dark gradient */}
      <div className="relative overflow-hidden rounded-2xl border border-base-300 dark:border-base-content/10 bg-gradient-to-br from-base-100 via-base-100 to-base-200 dark:from-base-200/90 dark:via-base-200/60 dark:to-primary/10 p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 dark:bg-primary/20 px-3 py-1 text-xs font-bold text-primary mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Recruiter Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
              Post a New Job
            </h1>
            <p className="mt-1 max-w-xl text-sm text-base-content/60 dark:text-base-content/70">
              Create and publish high-visibility openings to attract top-tier engineering talent.
            </p>
          </div>

          {onNavigateToManage && (
            <button
              type="button"
              onClick={onNavigateToManage}
              className="btn btn-ghost btn-sm border border-base-300 dark:border-base-content/15 rounded-xl font-semibold self-start sm:self-auto gap-2 hover:bg-base-200 dark:hover:bg-base-300"
            >
              <Eye className="h-4 w-4" />
              Manage Existing Jobs
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-error/30 bg-error/10 dark:bg-error/15 px-4 py-3.5 text-sm font-medium text-error shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex flex-col gap-3 rounded-2xl border border-success/30 bg-success/10 dark:bg-success/15 px-5 py-4 text-sm font-medium text-success shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
          {onNavigateToManage && (
            <button
              type="button"
              onClick={onNavigateToManage}
              className="btn btn-sm btn-success text-success-content font-bold self-start sm:self-auto rounded-xl shadow-sm"
            >
              View in Manage Jobs →
            </button>
          )}
        </div>
      )}

      {/* Main Grid: Form + Live Preview */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Job Details & Classification */}
          <div className="rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200/50 p-5 sm:p-6 shadow-sm dark:shadow-xl dark:shadow-black/20">
            <div className="flex items-center gap-2.5 border-b border-base-300 dark:border-base-content/10 pb-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Briefcase className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-base-content">
                  Job Role & Classification
                </h2>
                <p className="text-xs text-base-content/60">
                  Define the role title, specialization, and seniority level
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Job Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Experience Level *</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className={inputClass}
                >
                  <option value="Junior">Junior Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                  <option value="Lead">Lead / Staff Level</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Employment Type *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={inputClass}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Application Deadline</label>
                <div className="relative">
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Company & Location */}
          <div className="rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200/50 p-5 sm:p-6 shadow-sm dark:shadow-xl dark:shadow-black/20">
            <div className="flex items-center gap-2.5 border-b border-base-300 dark:border-base-content/10 pb-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-base-content">
                  Company & Location
                </h2>
                <p className="text-xs text-base-content/60">
                  Workplace arrangements and organization contact
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Nexora Cloud"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Workplace Mode *</label>
                <select
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  className={inputClass}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Location / HQ *</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA (or Remote)"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact / Application Email *</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="careers@company.com"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Card 3: Compensation */}
          <div className="rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200/50 p-5 sm:p-6 shadow-sm dark:shadow-xl dark:shadow-black/20">
            <div className="flex items-center gap-2.5 border-b border-base-300 dark:border-base-content/10 pb-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-base-content">
                  Compensation Package
                </h2>
                <p className="text-xs text-base-content/60">
                  Annual salary range in USD (leave blank for negotiable)
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Minimum Salary (USD / year)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-base-content/40">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    placeholder="e.g. 110000"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Maximum Salary (USD / year)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-base-content/40">
                    $
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    placeholder="e.g. 150000"
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Description & Requirements */}
          <div className="rounded-2xl border border-base-300 dark:border-base-content/10 bg-base-100 dark:bg-base-200/50 p-5 sm:p-6 shadow-sm dark:shadow-xl dark:shadow-black/20">
            <div className="flex items-center gap-2.5 border-b border-base-300 dark:border-base-content/10 pb-3 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-base-content">
                  Job Description & Qualifications
                </h2>
                <p className="text-xs text-base-content/60">
                  Skills, responsibilities, and key requirements
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Technical Skills (comma-separated)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                  <input
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, TypeScript, Node.js, GraphQL, PostgreSQL"
                    className={`${inputClass} pl-10`}
                  />
                </div>

                {parsedSkills.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {parsedSkills.map((s) => (
                      <span
                        key={s}
                        className="badge badge-primary badge-soft text-xs font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Job Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the day-to-day role, engineering culture, team mission, and impact…"
                  required
                  rows={5}
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </div>

              <div>
                <label className={labelClass}>Qualifications & Requirements</label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="• 3+ years of professional full-stack development experience&#10;• Strong familiarity with distributed architectures&#10;• Experience with modern cloud deployment (AWS/GCP)"
                  rows={4}
                  className={`${inputClass} resize-y leading-relaxed`}
                />
              </div>
            </div>
          </div>

          {/* Form Submit & Reset Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end pt-2">
            <button
              type="button"
              onClick={resetForm}
              disabled={posting}
              className="btn btn-ghost rounded-xl border border-base-300 dark:border-base-content/15 px-6 font-semibold gap-2 hover:bg-base-200 dark:hover:bg-base-300/60"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Form
            </button>

            <button
              type="submit"
              disabled={posting}
              className="btn btn-primary rounded-xl px-9 font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all disabled:opacity-60"
            >
              {posting ? (
                <>
                  <span className="loading loading-spinner loading-xs" />
                  Publishing…
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Preview Sidebar (Sticky on Desktop) */}
        <div className="hidden xl:block">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/50">
                Live Card Preview
              </span>
              <span className="badge badge-xs badge-primary font-bold">
                Instant
              </span>
            </div>

            {/* Simulated Candidate Job Card */}
            <div className="rounded-2xl border border-base-300/80 dark:border-base-content/15 bg-base-100 dark:bg-base-200/90 p-5 shadow-md dark:shadow-2xl dark:shadow-black/40 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-base text-base-content truncate">
                    {title.trim() || "Senior Developer (Preview)"}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-base-content/60 dark:text-base-content/70">
                    <span className="font-semibold text-base-content/90">
                      {company.trim() || "Your Company"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {location.trim() || "Remote / Anywhere"}
                    </span>
                  </div>
                </div>

                <span className="badge badge-sm badge-success badge-soft font-bold whitespace-nowrap">
                  {salaryMin || salaryMax
                    ? `$${salaryMin || "0"} - $${salaryMax || "—"}k`
                    : "Competitive"}
                </span>
              </div>

              {/* Badges row */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="badge badge-sm badge-ghost font-semibold">
                  {workplace}
                </span>
                <span className="badge badge-sm badge-ghost font-semibold">
                  {type}
                </span>
                <span className="badge badge-sm badge-ghost font-semibold">
                  {level}
                </span>
              </div>

              {/* Skills tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {parsedSkills.length > 0 ? (
                  parsedSkills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="badge badge-xs badge-neutral font-medium"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-base-content/40 italic">
                    Add skills to see badges here
                  </span>
                )}
                {parsedSkills.length > 4 && (
                  <span className="badge badge-xs badge-ghost">
                    +{parsedSkills.length - 4} more
                  </span>
                )}
              </div>

              {/* Description preview snippet */}
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-base-content/70">
                {description.trim() ||
                  "Your detailed job description will appear here to candidates browsing the job marketplace."}
              </p>

              {/* Footer info in preview */}
              <div className="mt-4 pt-3 border-t border-base-300 dark:border-base-content/10 flex items-center justify-between text-[11px] text-base-content/50">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {deadline ? `Deadline: ${deadline}` : "No deadline"}
                </span>
                <span className="flex items-center gap-1 truncate max-w-[140px]">
                  <Mail className="h-3 w-3" />
                  {contactEmail || "contact@email"}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-base-200/50 dark:bg-base-300/30 p-3 text-[11px] text-base-content/60 leading-normal border border-base-300/40 dark:border-base-content/10">
              💡 <strong>Dark theme tip:</strong> All inputs, dates, and preview cards automatically adapt to your theme preferences with optimal contrast.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
