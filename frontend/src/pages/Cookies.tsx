import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cookie,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Server,
  Settings2,
  ChevronRight,
  Info,
  Save,
  Mail,
  ArrowUpRight,
} from "lucide-react";

interface CookieCategory {
  id: string;
  name: string;
  required: boolean;
  description: string;
  examples: Array<{ name: string; purpose: string; duration: string; type: string }>;
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    name: "Strictly Necessary & Authentication",
    required: true,
    description:
      "Essential for platform security, user login authentication, account authorization, and CSRF protection. The platform cannot function properly without these items.",
    examples: [
      { name: "token", purpose: "Stores your encrypted JWT authentication token", duration: "7 days", type: "Local Storage" },
      { name: "user", purpose: "Caches basic user profile info (name, email, role)", duration: "Session", type: "Local Storage" },
      { name: "devhire_csrf", purpose: "Protects form submissions against Cross-Site Request Forgery", duration: "Session", type: "HTTP Cookie" },
    ],
  },
  {
    id: "functional",
    name: "Functional & User Experience",
    required: false,
    description:
      "Enables personalized features such as remembering your preferred UI color scheme (Dark / Light mode), search filter presets on the job board, and modal dismissal states.",
    examples: [
      { name: "theme", purpose: "Remembers your chosen DaisyUI / Tailwind theme", duration: "1 year", type: "Local Storage" },
      { name: "job_filters_cache", purpose: "Saves selected workplace (Remote/Hybrid) preferences", duration: "30 days", type: "Local Storage" },
      { name: "lenis_scroll_state", purpose: "Retains smooth scroll position across navigation", duration: "Session", type: "Memory / Storage" },
    ],
  },
  {
    id: "analytics",
    name: "Performance & Anonymous Telemetry",
    required: false,
    description:
      "Helps our engineering team identify slow API endpoints, diagnose UI render performance bottlenecks, and aggregate platform health metrics. All collected data is completely anonymized.",
    examples: [
      { name: "perf_api_latency", purpose: "Measures API roundtrip duration for frontend optimization", duration: "24 hours", type: "Local Storage" },
      { name: "client_error_log", purpose: "Captures uncaught React render exceptions for debugging", duration: "Session", type: "Session Storage" },
    ],
  },
  {
    id: "marketing",
    name: "Third-Party Advertising & Cross-Site Trackers",
    required: false,
    description:
      "DevHire does NOT use advertising cookies, third-party pixel trackers, or retargeting networks. We respect your privacy and never sell developer browsing habits.",
    examples: [
      { name: "None", purpose: "No third-party ad networks or marketing trackers are loaded", duration: "N/A", type: "Disabled by Default" },
    ],
  },
];

export default function Cookies() {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
    marketing: false,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("devhire_cookie_preferences");
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch {
      // Use defaults if parse fails
    }
  }, []);

  const handleToggle = (categoryId: string) => {
    if (categoryId === "essential" || categoryId === "marketing") return;
    setPreferences((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId as keyof typeof prev],
    }));
  };

  const savePreferences = () => {
    try {
      localStorage.setItem("devhire_cookie_preferences", JSON.stringify(preferences));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch {
      // Handle storage errors
    }
  };

  const acceptAll = () => {
    const updated = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: false,
    };
    setPreferences(updated);
    localStorage.setItem("devhire_cookie_preferences", JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const rejectNonEssential = () => {
    const updated = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(updated);
    localStorage.setItem("devhire_cookie_preferences", JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-base-200 bg-base-200/30 py-14 sm:py-20">
        <div className="absolute inset-0 bg-radial-[at_top_right] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="mx-auto container px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-base-content/60 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-base-content font-semibold">Cookie Policy</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary mb-4">
              <Cookie className="w-4 h-4" />
              <span>STORAGE & TRACKING TRANSPARENCY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              DevHire <span className="text-primary">Cookie Policy</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-base-content/70 leading-relaxed">
              We believe in total transparency. Learn how DevHire uses browser cookies, session tokens, and HTML5 local storage to secure your sessions, remember your preferences, and maintain our developer-first platform.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-base-content/60">
              <span className="font-semibold text-base-content/90">
                Effective Date: January 1, 2026
              </span>
              <span>•</span>
              <span>Last Updated: October 2026</span>
              <span>•</span>
              <span className="badge badge-success badge-soft font-bold text-[11px]">
                ePrivacy & GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Controls & Policy */}
      <section className="mx-auto container px-4 sm:px-6 lg:px-8 mt-10">
        {/* Save confirmation toast */}
        {savedSuccess && (
          <div className="mb-6 alert alert-success rounded-2xl shadow-lg border border-success/30 flex items-center justify-between text-xs sm:text-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-content" />
              <span className="font-bold text-success-content">
                Your cookie and storage preferences have been saved successfully!
              </span>
            </div>
            <span className="badge badge-outline text-[11px] font-bold">Updated</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Preferences Manager */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-primary/30 bg-base-100 p-6 shadow-md shadow-primary/5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base text-base-content">
                      Preference Manager
                    </h2>
                    <p className="text-[11px] text-base-content/60">
                      Customize how DevHire stores data in your browser
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-base-200">
                {COOKIE_CATEGORIES.map((cat) => {
                  const isChecked =
                    cat.id === "essential"
                      ? true
                      : cat.id === "marketing"
                      ? false
                      : preferences[cat.id as keyof typeof preferences];

                  return (
                    <div key={cat.id} className="pt-4 first:pt-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-bold text-base-content">
                              {cat.name}
                            </h3>
                            {cat.required && (
                              <span className="badge badge-neutral badge-xs font-bold text-[9px]">
                                Mandatory
                              </span>
                            )}
                            {cat.id === "marketing" && (
                              <span className="badge badge-error badge-soft badge-xs font-bold text-[9px]">
                                Never Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-base-content/70 mt-1 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={cat.required || cat.id === "marketing"}
                            onChange={() => handleToggle(cat.id)}
                            className={`toggle toggle-sm ${
                              cat.id === "marketing"
                                ? "toggle-error opacity-40 cursor-not-allowed"
                                : "toggle-primary"
                            }`}
                            aria-label={`Toggle ${cat.name}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-base-200 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={savePreferences}
                  className="btn btn-primary btn-sm rounded-xl font-bold flex-1 gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="btn btn-outline btn-sm rounded-xl font-bold gap-1 text-xs"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="btn btn-ghost btn-sm rounded-xl font-bold text-xs text-base-content/60 hover:text-base-content"
                >
                  Essential Only
                </button>
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="rounded-3xl border border-base-200 bg-base-200/40 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-success" />
                DevHire Privacy Guarantee
              </h3>
              <ul className="text-xs text-base-content/70 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>No Facebook Meta Pixel, Google Ads, or TikTok trackers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>No fingerprinting or cross-website browsing tracking.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  <span>You can purge local storage anytime through browser settings.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Full Policy Text & Detailed Table */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. What Are Cookies */}
            <article className="rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Info className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-base-content">
                  1. What Are Cookies and Web Storage?
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  Cookies are small text files placed on your computer or mobile device when you visit a web application. Modern web applications also use <strong>HTML5 Local Storage</strong> and <strong>Session Storage</strong>, which are secure browser databases that allow applications to remember state without constantly passing redundant headers over the network.
                </p>
                <p>
                  At DevHire, we primarily rely on standard Local Storage for keeping you logged in (`localStorage.getItem("token")`) and rendering the correct UI theme without screen flicker.
                </p>
              </div>
            </article>

            {/* 2. Detailed Storage Inventory Table */}
            <article className="rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Server className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-base-content">
                  2. Inventory of Items Stored in Your Browser
                </h2>
              </div>
              <p className="text-xs text-base-content/70 mb-4">
                Below is a comprehensive list of specific keys, purposes, and lifetimes used across the DevHire platform:
              </p>

              <div className="overflow-x-auto">
                <table className="table table-xs w-full">
                  <thead>
                    <tr className="border-b border-base-300 text-base-content/70">
                      <th>Key / Name</th>
                      <th>Type</th>
                      <th>Purpose</th>
                      <th>Lifespan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200 text-xs">
                    <tr>
                      <td className="font-mono font-bold text-primary">token</td>
                      <td><span className="badge badge-neutral badge-xs">Local Storage</span></td>
                      <td className="text-base-content/80">Encrypted JWT user authentication token</td>
                      <td>7 Days</td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold text-primary">user</td>
                      <td><span className="badge badge-neutral badge-xs">Local Storage</span></td>
                      <td className="text-base-content/80">Cached user payload (Name, Email, Role)</td>
                      <td>Session</td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold text-secondary">theme</td>
                      <td><span className="badge badge-ghost badge-xs">Local Storage</span></td>
                      <td className="text-base-content/80">Stores Dark or Light theme choice</td>
                      <td>Persistent</td>
                    </tr>
                    <tr>
                      <td className="font-mono font-bold text-accent">devhire_cookie_preferences</td>
                      <td><span className="badge badge-ghost badge-xs">Local Storage</span></td>
                      <td className="text-base-content/80">Stores your customized cookie consent choices</td>
                      <td>1 Year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            {/* 3. Browser-level Control Guide */}
            <article className="rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Settings2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-base-content">
                  3. Managing Storage via Your Browser
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  You can configure or block cookies and local storage through your browser settings. Keep in mind that disabling essential storage keys will log you out of your DevHire account and prevent applying to jobs.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-base-200/50 border border-base-200 text-center">
                    <span className="font-bold text-xs block">Google Chrome</span>
                    <span className="text-[10px] text-base-content/60">Settings ➔ Privacy</span>
                  </div>
                  <div className="p-3 rounded-xl bg-base-200/50 border border-base-200 text-center">
                    <span className="font-bold text-xs block">Mozilla Firefox</span>
                    <span className="text-[10px] text-base-content/60">Options ➔ Privacy</span>
                  </div>
                  <div className="p-3 rounded-xl bg-base-200/50 border border-base-200 text-center">
                    <span className="font-bold text-xs block">Apple Safari</span>
                    <span className="text-[10px] text-base-content/60">Preferences ➔ Privacy</span>
                  </div>
                  <div className="p-3 rounded-xl bg-base-200/50 border border-base-200 text-center">
                    <span className="font-bold text-xs block">Microsoft Edge</span>
                    <span className="text-[10px] text-base-content/60">Settings ➔ Cookies</span>
                  </div>
                </div>
              </div>
            </article>

            {/* 4. Questions & Contact */}
            <article className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-primary text-primary-content">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-base-content">
                  4. Questions Regarding Storage & Tracking
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                If you have inquiries about our cookie usage or wish to request data deletion, contact us at{" "}
                <a href="mailto:privacy@devhire.io" className="text-primary font-bold hover:underline">
                  privacy@devhire.io
                </a>{" "}
                or read our full{" "}
                <Link to="/privacy" className="text-primary font-bold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto container px-4 sm:px-6 lg:px-8 mt-16">
        <div className="rounded-3xl border border-base-300 bg-base-200/50 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold">Ready to explore developer opportunities?</h3>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Browse vetted jobs with salary transparency and zero invasive tracking.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/jobs" className="btn btn-primary btn-sm rounded-full px-5 font-bold">
              Explore Jobs <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-sm rounded-full px-4 font-bold">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
