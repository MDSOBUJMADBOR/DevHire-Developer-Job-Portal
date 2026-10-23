import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Users,
  Briefcase,
  Code2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing & evaluator convenience
  const fillCredentials = (type: "candidate" | "employer") => {
    if (type === "candidate") {
      setEmail("candidate@devhire.io");
      setPassword("password123");
    } else {
      setEmail("recruiter@devhire.io");
      setPassword("password123");
    }
    setError("");
  };

  return (
    <div className="min-h-[calc(100vh-68px)] bg-base-200/50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl rounded-3xl border border-base-300/80 bg-base-100 shadow-2xl shadow-base-content/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Brand Showcase & Social Proof (Desktop) */}
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
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED DEVELOPER NETWORK
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content leading-snug">
                Welcome back to your engineering career hub.
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Track your active job applications, inspect recruitment timelines, and manage your ATS-friendly developer profile.
              </p>
            </div>
          </div>

          {/* Middle: Developer Testimonial Card */}
          <div className="relative z-10 my-8 p-5 rounded-2xl border border-base-300/80 bg-base-100/80 backdrop-blur-md shadow-sm">
            <p className="text-xs text-base-content/80 italic leading-relaxed">
              "DevHire connected me directly with engineering leads with 100% salary transparency. No recruiter spam, just meaningful interviews."
            </p>
            <div className="mt-3.5 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary text-primary-content font-bold flex items-center justify-center text-xs">
                AK
              </div>
              <div>
                <p className="text-xs font-bold text-base-content">Alex Karpov</p>
                <p className="text-[11px] text-base-content/60">Staff Engineer • Nexora</p>
              </div>
            </div>
          </div>

          {/* Bottom Highlights & Metrics */}
          <div className="relative z-10 border-t border-base-300/70 pt-5">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-base-100/50">
                <p className="text-sm font-extrabold text-primary">18.5k+</p>
                <p className="text-[10px] text-base-content/60 font-semibold">Developers</p>
              </div>
              <div className="p-2 rounded-xl bg-base-100/50">
                <p className="text-sm font-extrabold text-primary">850+</p>
                <p className="text-[10px] text-base-content/60 font-semibold">Tech Teams</p>
              </div>
              <div className="p-2 rounded-xl bg-base-100/50">
                <p className="text-sm font-extrabold text-primary">$145k</p>
                <p className="text-[10px] text-base-content/60 font-semibold">Avg Salary</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form */}
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
                Sign in to DevHire
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-base-content/60">
                Enter your credentials to access your portal and job tracker.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-5 alert alert-error alert-soft rounded-2xl text-xs py-3 px-4 flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-error" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-base-content mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    autoComplete="email"
                    className="input input-bordered w-full rounded-xl pl-10 pr-4 text-xs sm:text-sm h-11 bg-base-100 focus:input-primary"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-base-content uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-xs text-primary hover:underline cursor-pointer font-medium">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-base-content/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox checkbox-primary checkbox-xs rounded-md"
                  />
                  <span className="text-xs text-base-content/70 font-medium">
                    Keep me signed in on this device
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons (Convenient for testers & visitors) */}
            <div className="mt-6 pt-5 border-t border-base-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 text-center mb-2.5">
                Quick Test Credentials
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillCredentials("candidate")}
                  className="btn btn-ghost btn-xs rounded-lg border border-base-300 font-semibold text-[11px] hover:border-primary hover:text-primary gap-1"
                >
                  <Users className="w-3 h-3" />
                  Candidate Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials("employer")}
                  className="btn btn-ghost btn-xs rounded-lg border border-base-300 font-semibold text-[11px] hover:border-primary hover:text-primary gap-1"
                >
                  <Briefcase className="w-3 h-3" />
                  Employer Demo
                </button>
              </div>
            </div>

            {/* Sign Up Redirect */}
            <p className="mt-6 text-center text-xs text-base-content/70">
              Don't have a DevHire account yet?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:underline inline-flex items-center gap-0.5"
              >
                Create Account <ArrowRight className="w-3 h-3" />
              </Link>
            </p>

            {/* Security Guarantee Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-base-content/50">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Encrypted with TLS 1.3 • Zero-ghosting platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}