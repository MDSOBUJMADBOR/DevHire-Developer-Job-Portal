import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Code2,
  Check,
  Briefcase,
  Terminal,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<"CANDIDATE" | "EMPLOYER">("CANDIDATE");
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password, role);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-base-200/50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl rounded-3xl border border-base-300/80 bg-base-100 shadow-2xl shadow-base-content/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Brand Storytelling & Value Props (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-primary/10 via-base-200/70 to-base-100 p-8 sm:p-10 flex-col justify-between border-r border-base-300/70 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25 transition-transform group-hover:scale-105">
                <Code2 className="w-5 h-5" />
              </span>
              <span className="text-2xl font-black tracking-tight text-base-content">
                Dev<span className="text-primary">Hire</span>
              </span>
            </Link>

            <div className="mt-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                <Zap className="w-3.5 h-3.5" />
                DEVELOPER-FIRST ECOSYSTEM
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content leading-snug">
                Accelerate your software engineering career.
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Connect with modern engineering teams at fast-growing startups and industry-leading tech enterprises.
              </p>
            </div>
          </div>

          {/* Value Propositions */}
          <div className="relative z-10 my-6 space-y-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-100/70 border border-base-300/70 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content">Explicit Salary Bands</p>
                <p className="text-[11px] text-base-content/60 leading-tight mt-0.5">
                  100% compensation transparency on every listed opportunity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-100/70 border border-base-300/70 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content">Filtered by Exact Stacks</p>
                <p className="text-[11px] text-base-content/60 leading-tight mt-0.5">
                  Discover roles by React, Go, Node, Next.js, and Python.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-100/70 border border-base-300/70 shadow-xs">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-base-content">Direct Team Connections</p>
                <p className="text-[11px] text-base-content/60 leading-tight mt-0.5">
                  Communicate directly with engineering leaders with zero spam.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Metrics */}
          <div className="relative z-10 border-t border-base-300/70 pt-5">
            <div className="flex items-center justify-between text-xs text-base-content/70">
              <span className="flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                Zero-Ghosting ATS
              </span>
              <span>•</span>
              <span className="font-semibold text-primary">12-Day Avg Placement</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="lg:hidden mb-4">
                <Link to="/" className="inline-flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25">
                    <Code2 className="w-4 h-4" />
                  </span>
                  <span className="text-xl font-black">
                    Dev<span className="text-primary">Hire</span>
                  </span>
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
                Create Your Account
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-base-content/60">
                Join thousands of software engineers and top tech teams.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 alert alert-error alert-soft rounded-2xl text-xs py-3 px-4 flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-error" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Role Selection Tabs */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-base-content mb-2 uppercase tracking-wider">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Candidate Button */}
                <button
                  type="button"
                  onClick={() => setRole("CANDIDATE")}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    role === "CANDIDATE"
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40"
                      : "border-base-300 hover:border-base-content/30 bg-base-100"
                  }`}
                >
                  {role === "CANDIDATE" && (
                    <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                  <Code2
                    className={`w-5 h-5 mb-2 ${
                      role === "CANDIDATE" ? "text-primary" : "text-base-content/60"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-base-content">Candidate</p>
                    <p className="text-[10px] text-base-content/60 leading-tight mt-0.5">
                      I'm seeking developer jobs
                    </p>
                  </div>
                </button>

                {/* Employer Button */}
                <button
                  type="button"
                  onClick={() => setRole("EMPLOYER")}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    role === "EMPLOYER"
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/40"
                      : "border-base-300 hover:border-base-content/30 bg-base-100"
                  }`}
                >
                  {role === "EMPLOYER" && (
                    <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                  <Building2
                    className={`w-5 h-5 mb-2 ${
                      role === "EMPLOYER" ? "text-primary" : "text-base-content/60"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-base-content">Employer</p>
                    <p className="text-[10px] text-base-content/60 leading-tight mt-0.5">
                      I'm hiring software engineers
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-base-content mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    required
                    autoComplete="name"
                    className="input input-bordered w-full rounded-xl pl-10 pr-4 text-xs sm:text-sm h-11 bg-base-100 focus:input-primary"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-base-content mb-1.5 uppercase tracking-wider">
                  Work / Personal Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    autoComplete="email"
                    className="input input-bordered w-full rounded-xl pl-10 pr-4 text-xs sm:text-sm h-11 bg-base-100 focus:input-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-base-content mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="input input-bordered w-full rounded-xl pl-10 pr-11 text-xs sm:text-sm h-11 bg-base-100 focus:input-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-base-content mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    autoComplete="new-password"
                    className={`input input-bordered w-full rounded-xl pl-10 pr-11 text-xs sm:text-sm h-11 bg-base-100 ${
                      isPasswordMismatch
                        ? "input-error"
                        : isPasswordMatch
                        ? "input-success"
                        : "focus:input-primary"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {isPasswordMismatch && (
                  <p className="text-[11px] text-error mt-1">Passwords do not match.</p>
                )}
                {isPasswordMatch && (
                  <p className="text-[11px] text-success mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Passwords match!
                  </p>
                )}
              </div>

              {/* Terms & Privacy Agreement */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="checkbox checkbox-primary checkbox-xs rounded-md mt-0.5"
                  />
                  <span className="text-xs text-base-content/70 leading-relaxed">
                    I agree to DevHire's{" "}
                    <Link to="/privacy" className="text-primary font-semibold hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link to="/cookies" className="text-primary font-semibold hover:underline">
                      Cookie Terms
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full rounded-xl h-11 text-sm font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {role === "CANDIDATE" ? "Create Candidate Account" : "Create Employer Account"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Login Redirect */}
            <p className="mt-6 text-center text-xs text-base-content/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:underline inline-flex items-center gap-0.5"
              >
                Sign in <ArrowRight className="w-3 h-3" />
              </Link>
            </p>

            {/* Security Guarantee Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-base-content/50">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Bank-grade AES-256 encryption • Zero spam guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}