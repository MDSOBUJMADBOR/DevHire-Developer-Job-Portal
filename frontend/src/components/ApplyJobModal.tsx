import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Code2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import type { JobItem } from "../pages/Jobs";

interface ApplyJobModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (application: any) => void;
}

const ApplyJobModal = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}: ApplyJobModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [coverNote, setCoverNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill from user profile when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
    if (isOpen) {
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen || !job) return null;

  const salaryDisplay =
    typeof job.salary === "string"
      ? job.salary
      : job.salary
        ? `$${job.salary.min || ""}${job.salary.max ? `–$${job.salary.max}` : ""}`
        : "Negotiable";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your contact phone number.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        jobId: job._id || (typeof job.id === "string" ? job.id : String(job.id || "")),
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salary: salaryDisplay,
        type: job.type || "Full-time",
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        experience: experience.trim(),
        resumeUrl: resumeUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        githubUrl: githubUrl.trim(),
        coverNote: coverNote.trim(),
      };

      const response = await api<{
        success: boolean;
        message: string;
        data: any;
      }>("/applications", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const newApplication = response.data;
      setIsSuccess(true);

      // Also update local storage candidate applications cache so dashboard displays it instantly
      try {
        const stored = localStorage.getItem("devhire_candidate_applications");
        const list = stored ? JSON.parse(stored) : [];
        const mappedApp = {
          id: newApplication._id || `app-${Date.now()}`,
          jobId: payload.jobId,
          jobTitle: payload.jobTitle,
          company: payload.company,
          location: payload.location,
          salary: payload.salary,
          type: payload.type,
          appliedDate: newApplication.appliedDate || "Today",
          status: "applied",
          notes: payload.coverNote,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          resumeUrl: payload.resumeUrl,
          portfolioUrl: payload.portfolioUrl,
          githubUrl: payload.githubUrl,
          experience: payload.experience,
          stageTimeline: newApplication.stageTimeline || [
            { stage: "Application Submitted", date: "Today", completed: true },
            { stage: "Profile Review", date: "Pending", completed: false },
            { stage: "Technical Interview", date: "Pending", completed: false },
            { stage: "Final Offer", date: "Pending", completed: false },
          ],
        };
        localStorage.setItem(
          "devhire_candidate_applications",
          JSON.stringify([mappedApp, ...list.filter((a: any) => a.jobId !== payload.jobId)])
        );
      } catch (err) {
        console.warn("Could not cache to local storage:", err);
      }

      if (onSuccess) {
        onSuccess(newApplication);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-base-200 flex items-start justify-between gap-3 bg-base-100/90">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-primary badge-sm font-bold">
                Application Form
              </span>
              <span className="badge badge-ghost badge-sm font-semibold">
                {job.type}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-base-content break-words">
              Apply for {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-xs text-base-content/70">
              <span className="flex items-center gap-1 font-semibold text-base-content">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                {job.company}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-base-content/50" />
                {job.location} {job.workplace && `(${job.workplace})`}
              </span>
              <span>•</span>
              <span className="font-bold text-success">{salaryDisplay}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Success State */}
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-base-content">
                  Application Submitted! 🎉
                </h3>
                <p className="mt-1 text-sm text-base-content/70 max-w-md mx-auto">
                  Your application for <span className="font-bold text-base-content">{job.title}</span> at{" "}
                  <span className="font-bold text-base-content">{job.company}</span> has been saved in MongoDB and is now tracked in your candidate dashboard.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-semibold">Applicant:</span>
                  <span className="font-bold">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-semibold">Email:</span>
                  <span className="font-bold">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60 font-semibold">Status:</span>
                  <span className="badge badge-success badge-sm font-bold">Submitted</span>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate("/dashboard/candidate/applications");
                  }}
                  className="btn btn-primary btn-sm sm:btn-md rounded-xl font-bold w-full sm:w-auto px-6 gap-2"
                >
                  <Briefcase className="w-4 h-4" />
                  View in My Applications
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost btn-sm sm:btn-md rounded-xl font-bold w-full sm:w-auto"
                >
                  Continue Browsing Jobs
                </button>
              </div>
            </div>
          ) : !isAuthenticated ? (
            /* Not logged in state */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black">
                  Sign In Required to Apply
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-base-content/70 max-w-md mx-auto">
                  Please log in or create a candidate account so your application is securely stored in MongoDB and tracked inside your <span className="font-bold">My Applications</span> dashboard.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/login"
                  className="btn btn-primary btn-sm rounded-xl font-bold px-6 w-full sm:w-auto"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline btn-sm rounded-xl font-bold px-6 w-full sm:w-auto"
                >
                  Create Account
                </Link>
              </div>
            </div>
          ) : (
            /* Application Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="alert alert-error text-xs font-semibold rounded-2xl flex items-center gap-2 p-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-1">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-1">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-1">
                    Phone Number <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-1">
                    Years of Experience / Current Role
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="e.g. 4 years • Full Stack Engineer"
                      className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Links & Resume */}
              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-1">
                    Resume / CV Link (Google Drive, Dropbox, PDF URL)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                    <input
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      placeholder="https://drive.google.com/your-resume or direct link"
                      className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-base-content/70 mb-1">
                      Portfolio / Website
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        placeholder="https://myportfolio.dev"
                        className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-base-content/70 mb-1">
                      GitHub Profile
                    </label>
                    <div className="relative">
                      <Code2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username"
                        className="input input-sm w-full pl-9 rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Note */}
              <div>
                <label className="block text-xs font-bold text-base-content/70 mb-1">
                  Cover Note / Pitch (Optional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Share a short note explaining why you're a great fit for this position..."
                  className="textarea textarea-sm w-full rounded-2xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="btn btn-ghost btn-sm rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-sm rounded-xl font-bold px-6 gap-2"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
