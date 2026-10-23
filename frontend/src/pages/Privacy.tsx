import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Database,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Download,
  Trash2,
  Share2,
  Server,
  ArrowUpRight,
  Mail,
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: Section[] = [
  { id: "overview", title: "1. Overview & Commitment", icon: ShieldCheck },
  { id: "data-collection", title: "2. Information We Collect", icon: Database },
  { id: "data-usage", title: "3. How We Use Your Data", icon: FileText },
  { id: "visibility", title: "4. Developer Visibility & Control", icon: Eye },
  { id: "third-party", title: "5. Information Sharing & Third Parties", icon: Share2 },
  { id: "security", title: "6. Security & Encryption Standards", icon: Lock },
  { id: "cookies", title: "7. Cookies & Session Storage", icon: Server },
  { id: "rights", title: "8. Your Legal Rights (GDPR & CCPA)", icon: KeyRound },
  { id: "contact", title: "9. Data Protection Officer Contact", icon: Mail },
];

const PRIVACY_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Zero Data Selling",
    description:
      "We never sell, broker, or monetize your resume, contact details, or profile data to third-party advertising companies. Ever.",
    badge: "100% Guaranteed",
  },
  {
    icon: Eye,
    title: "Explicit Application Consent",
    description:
      "Employers and recruiters can only inspect your full resume, phone number, and direct contact details when you actively apply to their position.",
    badge: "Candidate Controlled",
  },
  {
    icon: Lock,
    title: "Bank-Grade Encryption",
    description:
      "All credentials, session tokens, resumes, and candidate submissions are encrypted in transit via TLS 1.3 and at rest with AES-256.",
    badge: "Enterprise Security",
  },
  {
    icon: Trash2,
    title: "1-Click Data Erasure",
    description:
      "Complete ownership of your digital footprint. Request full data export in JSON format or permanent account deletion anytime with zero friction.",
    badge: "GDPR Compliant",
  },
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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
            <span className="text-base-content font-semibold">Privacy Policy</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary mb-4">
              <ShieldCheck className="w-4 h-4" />
              <span>LEGAL & DATA PROTECTION COMPLIANCE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              DevHire <span className="text-primary">Privacy Policy</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-base-content/70 leading-relaxed">
              We engineered DevHire to put software developers and engineering teams in complete control of their personal information. This Privacy Policy details our transparent data collection, encryption measures, and your privacy rights under international data regulations.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-base-content/60">
              <span className="font-semibold text-base-content/90">
                Effective Date: January 1, 2026
              </span>
              <span>•</span>
              <span>Last Updated: October 2026</span>
              <span>•</span>
              <span className="badge badge-success badge-soft font-bold text-[11px]">
                GDPR & CCPA Compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="mx-auto container px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRIVACY_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-base-300/80 bg-base-100 p-5 shadow-sm transition hover:shadow-md hover:border-primary/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge badge-ghost text-[10px] font-bold">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-base-content mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Content Area: Sidebar + Policy Sections */}
      <section className="mx-auto container px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Quick Nav Sticky Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 rounded-2xl border border-base-200 bg-base-200/40 p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60 px-3 mb-3">
              Table of Contents
            </h3>
            <nav className="space-y-1">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? "bg-primary text-primary-content shadow-sm font-bold"
                        : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{sec.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-5 border-t border-base-300/70 px-3">
              <h4 className="text-xs font-bold text-base-content mb-1">
                Need privacy assistance?
              </h4>
              <p className="text-[11px] text-base-content/60 leading-relaxed mb-3">
                Reach out directly to our Data Protection Officer for data requests or deletion.
              </p>
              <a
                href="mailto:privacy@devhire.io"
                className="btn btn-outline btn-xs w-full rounded-xl font-bold gap-1 text-primary hover:bg-primary hover:text-primary-content hover:border-primary"
              >
                <Mail className="w-3.5 h-3.5" />
                privacy@devhire.io
              </a>
            </div>
          </aside>

          {/* Policy Document Body */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Overview */}
            <article id="overview" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  1. Overview & Commitment
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  At <strong>DevHire</strong> ("DevHire", "we", "us", or "our"), respecting the privacy and autonomy of software engineers, tech professionals, and hiring organizations is fundamental to our product philosophy.
                </p>
                <p>
                  This Privacy Policy applies to all users of the DevHire website, APIs, candidate suites, recruiter platforms, and application portals. By creating an account or browsing roles on DevHire, you agree to the collection and handling of your information as outlined in this document.
                </p>
                <div className="alert alert-info alert-soft rounded-2xl text-xs py-3 px-4">
                  <AlertCircle className="w-4 h-4 shrink-0 text-info" />
                  <span>
                    Our core promise: <strong>We do not run third-party advertising trackers or sell candidate contact details to data brokers.</strong>
                  </span>
                </div>
              </div>
            </article>

            {/* 2. Information We Collect */}
            <article id="data-collection" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  2. Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  We collect information strictly necessary to provide modern job discovery, application submissions, and recruitment communications:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                    <h4 className="font-bold text-xs text-base-content mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Candidate Data
                    </h4>
                    <p className="text-xs text-base-content/70">
                      Full name, email address, password hash, phone number, resume URL, GitHub/portfolio links, years of experience, skill proficiencies, and work preferences (Remote/Hybrid).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                    <h4 className="font-bold text-xs text-base-content mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Employer & Recruiter Data
                    </h4>
                    <p className="text-xs text-base-content/70">
                      Corporate email, company name, corporate website, logo, hiring location, job post details, salary bands, and verification documents.
                    </p>
                  </div>
                </div>

                <p>
                  <strong>Application Submission Data:</strong> When submitting an application for a role, we record your candidate identification, stage timeline history, notes, and cover notes directly in our secured MongoDB cluster.
                </p>
              </div>
            </article>

            {/* 3. How We Use Your Data */}
            <article id="data-usage" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  3. How We Use Your Data
                </h2>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Matching & Applications:</strong> Processing your candidate application submissions and synchronizing real-time stage updates to your candidate dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Account Authentication & Security:</strong> Authorizing sessions via JSON Web Tokens (JWT) and verifying user roles (Candidate, Employer, Admin).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Platform Analytics:</strong> Aggregating anonymous metrics such as average salary estimates, top in-demand programming languages, and response rates.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong>Customer Support & Abuse Prevention:</strong> Investigating fraudulent job listings, spam applications, and enforcing terms of service.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 4. Developer Visibility & Control */}
            <article id="visibility" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  4. Developer Visibility & Control
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  Unlike legacy recruiting platforms where your resume is broadcast publicly to thousands of cold callers, <strong>DevHire enforces strict consent-first visibility:</strong>
                </p>
                <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200 space-y-2">
                  <p className="font-semibold text-xs text-base-content">
                    🔒 Application-Gated Access:
                  </p>
                  <p className="text-xs text-base-content/70">
                    A hiring team only receives your full resume link, phone number, and private contact info when you voluntarily click <strong>"Apply now"</strong> on their specific job card.
                  </p>
                </div>
                <p>
                  Candidates can update, replace, or remove their uploaded resumes or portfolios anytime from the <strong>Candidate Dashboard ➔ My Profile</strong> page.
                </p>
              </div>
            </article>

            {/* 5. Information Sharing & Third Parties */}
            <article id="third-party" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Share2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  5. Information Sharing & Third Parties
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  We do not sell personal data. We only share candidate and recruiter data with trusted infrastructure providers under strict Data Processing Agreements (DPAs):
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span><strong>Database Hosting:</strong> MongoDB Atlas (AES-256 encrypted database cluster).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span><strong>Application Hosting:</strong> Cloud providers with SOC2 Type II certifications.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span><strong>Prospective Employers:</strong> Only employers you actively choose to apply to.</span>
                  </li>
                </ul>
              </div>
            </article>

            {/* 6. Security Standards */}
            <article id="security" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  6. Security & Encryption Standards
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  Security is baked into DevHire's backend architecture:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200">
                    <h4 className="font-bold text-xs text-base-content mb-1">Bcrypt Password Hashing</h4>
                    <p className="text-xs text-base-content/70">Passwords are salted and hashed with bcrypt. Plaintext passwords are never logged or stored.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-base-200/40 border border-base-200">
                    <h4 className="font-bold text-xs text-base-content mb-1">Encrypted JWT Sessions</h4>
                    <p className="text-xs text-base-content/70">Cryptographically signed tokens with strict expiration timeframes and role-based guards.</p>
                  </div>
                </div>
              </div>
            </article>

            {/* 7. Cookies & Session Storage */}
            <article id="cookies" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Server className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  7. Cookies & Session Storage
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  DevHire uses local storage and lightweight cookies solely for essential platform operations:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Authentication Token:</strong> Storing JWT session credentials in client storage to maintain your login status across tabs.</li>
                  <li><strong>UI Preferences:</strong> Saving your theme preferences (Dark/Light mode) and filter criteria on the Jobs board.</li>
                </ul>
                <p className="text-xs text-base-content/60">
                  We do not utilize cross-site tracking cookies or advertising pixels from social media ad networks.
                </p>
              </div>
            </article>

            {/* 8. Your Legal Rights */}
            <article id="rights" className="scroll-mt-24 rounded-3xl border border-base-200 bg-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  8. Your Legal Rights (GDPR & CCPA)
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  Regardless of your country of residence, DevHire grants all users universal rights:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-200/30 border border-base-200">
                    <Download className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-base-content">Right of Access & Portability</h4>
                      <p className="text-xs text-base-content/70">Request an export of all candidate records, job submissions, and profile metrics in machine-readable JSON format.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-base-200/30 border border-base-200">
                    <Trash2 className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-xs text-base-content">Right to Erasure ("Right to Be Forgotten")</h4>
                      <p className="text-xs text-base-content/70">Permanently delete your profile, resume records, application histories, and credentials from our databases within 72 hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 9. Contact */}
            <article id="contact" className="scroll-mt-24 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-primary text-primary-content">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-base-content">
                  9. Data Protection Officer Contact
                </h2>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-base-content/80 leading-relaxed">
                <p>
                  If you have any questions regarding this Privacy Policy, wish to exercise your data rights, or want to report a security vulnerability:
                </p>
                <div className="p-4 rounded-2xl bg-base-100 border border-base-300 space-y-1.5">
                  <p className="font-bold text-base-content">DevHire Legal & Data Protection Team</p>
                  <p className="text-xs text-base-content/70">Email: <a href="mailto:privacy@devhire.io" className="text-primary font-semibold hover:underline">privacy@devhire.io</a></p>
                  <p className="text-xs text-base-content/70">General Support: <Link to="/contact" className="text-primary font-semibold hover:underline">DevHire Help Desk</Link></p>
                  <p className="text-xs text-base-content/60">Response Time: All data requests are acknowledged within 24 business hours.</p>
                </div>
              </div>
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
              Browse vetted jobs with salary transparency and candidate-first privacy.
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
