import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  Users,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface ContactChannel {
  title: string;
  email: string;
  description: string;
  icon: typeof Mail;
  badge: string;
}

const CHANNELS: ContactChannel[] = [
  {
    title: "Candidate & Job Seeker Support",
    email: "support@devhire.io",
    description: "Assistance with your developer profile, application tracking, or salary guide.",
    icon: Users,
    badge: "Under 2h response",
  },
  {
    title: "Employers & Hiring Partnerships",
    email: "employers@devhire.io",
    description: "Custom enterprise plans, recruiter ATS onboarding, and talent sourcing solutions.",
    icon: Building2,
    badge: "Dedicated Advisor",
  },
  {
    title: "Engineering & Security Triage",
    email: "security@devhire.io",
    description: "Responsible disclosure, API integrations, bug reports, and data privacy inquiries.",
    icon: ShieldCheck,
    badge: "Priority Queue",
  },
];

const FAQS = [
  {
    q: "How fast do employers respond to applications?",
    a: "Most active tech teams review submissions within 3 to 5 business days. Your stage timeline in My Applications automatically updates as recruiters review your profile.",
  },
  {
    q: "Is DevHire free for software engineers?",
    a: "Yes! Applying to jobs, creating rich developer profiles, and using our salary calculators are 100% free for all candidates forever.",
  },
  {
    q: "How do I verify our company for job posting?",
    a: "Register as an Employer, complete your company profile, and our moderation team verifies corporate domains within 24 hours.",
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-20 border-b border-base-200">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold border border-primary/20 shadow-xs animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            <span>24/7 Developer & Recruiter Support</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-base-content max-w-3xl mx-auto">
            Get in touch with the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
              DevHire Team
            </span>
          </h1>

          <p className="text-sm sm:text-base text-base-content/70 max-w-xl mx-auto leading-relaxed">
            Have questions about developer hiring, salary data, partnership opportunities, or technical inquiries? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* 2. CHANNELS DIRECTORY */}
      <section className="py-12 bg-base-200/40 border-b border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHANNELS.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-base-100 border border-base-300 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="badge badge-primary badge-soft badge-xs font-bold">
                        {ch.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-base-content">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-base-content/70 leading-relaxed">
                      {ch.description}
                    </p>
                  </div>

                  <a
                    href={`mailto:${ch.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-2 border-t border-base-200"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {ch.email}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & FAQ GRID */}
      <section className="py-16 sm:py-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-base-100 border border-base-300 shadow-md space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send a Message</span>
              </div>
              <h2 className="text-2xl font-black text-base-content">
                How can we assist you today?
              </h2>
              <p className="text-xs text-base-content/60 mt-1">
                Fill in the details below and an engineering team specialist will reach out promptly.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-success/10 border border-success/20 rounded-2xl animate-fadeIn">
                <div className="w-14 h-14 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-base-content">
                  Message Sent Successfully! 🎉
                </h3>
                <p className="text-xs text-base-content/70 max-w-sm mx-auto">
                  Thank you for reaching out. A team member has received your message and will respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn btn-primary btn-sm rounded-xl font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="alert alert-error text-xs font-semibold rounded-2xl flex items-center gap-2 p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-base-content/70 mb-1">
                      Your Full Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="input input-sm w-full rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-base-content/70 mb-1">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input input-sm w-full rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-base-content/70 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="select select-sm w-full rounded-xl bg-base-200/50 border-base-300 text-xs font-bold"
                    >
                      <option value="general">General Support</option>
                      <option value="candidate">Candidate Profile & Applications</option>
                      <option value="employer">Employer Job Posting & ATS</option>
                      <option value="salary">Salary Guide Inquiry</option>
                      <option value="partnerships">Enterprise Partnership</option>
                      <option value="security">Security & Bug Disclosure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-base-content/70 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question about employer verification"
                      className="input input-sm w-full rounded-xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-1">
                    Your Message <span className="text-error">*</span>
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your question, feedback, or technical issue..."
                    className="textarea textarea-sm w-full rounded-2xl bg-base-200/50 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold w-full gap-2 shadow-md shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Dispatching message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Quick Info & FAQs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="p-6 rounded-3xl bg-base-200/50 border border-base-300 space-y-4">
              <h3 className="font-extrabold text-base text-base-content flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Global Headquarters
              </h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                DevHire Technologies Inc.<br />
                548 Market Street, Suite 89201<br />
                San Francisco, CA 94104, USA
              </p>

              <div className="space-y-2 pt-2 border-t border-base-300 text-xs">
                <div className="flex items-center gap-2 text-base-content/70">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Support Hours: Mon – Fri (24h Engineering Coverage)</span>
                </div>
                <div className="flex items-center gap-2 text-base-content/70">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>Support Line: +1 (800) 555-DEVH</span>
                </div>
              </div>
            </div>

            {/* Micro FAQ Accordion */}
            <div className="p-6 rounded-3xl bg-base-100 border border-base-300 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-base-200">
                <HelpCircle className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-sm text-base-content">
                  Frequently Answered Questions
                </h3>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <h4 className="font-bold text-xs text-base-content">
                      {faq.q}
                    </h4>
                    <p className="text-xs text-base-content/70 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/resources"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Visit Candidate Knowledge Base <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
