import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  Building2,
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  DollarSign,
  Code2,
  Layers,
  Award,
  Check,
  X as CloseIcon,
} from "lucide-react";

const STATS = [
  { value: "12 Days", label: "Average Time-to-Hire", icon: Clock },
  { value: "88%", label: "Offer Acceptance Rate", icon: Award },
  { value: "18,500+", label: "Active Software Engineers", icon: Users },
  { value: "4.2x", label: "Qualified Candidate Ratio", icon: TrendingUp },
];

const TRUSTED_COMPANIES = [
  "Stripe",
  "OpenAI",
  "Supabase",
  "Vercel",
  "Datadog",
  "Figma",
  "Tailwind Labs",
];

const FEATURES = [
  {
    icon: Code2,
    title: "Pre-Screened Technical Profiles",
    desc: "Inspect live GitHub repositories, production portfolios, and verified framework competencies (React 19, Node.js, Go, Python, AWS).",
    badge: "Quality Talent",
  },
  {
    icon: Layers,
    title: "Built-In Candidate ATS Pipeline",
    desc: "Seamlessly transition candidates from Applied ➜ Screening ➜ Technical Interview ➜ Offer Extended with zero external software needed.",
    badge: "Workflow",
  },
  {
    icon: DollarSign,
    title: "Upfront Salary Transparency",
    desc: "Publishing transparent salary benchmarks boosts qualified engineering applications by 65% and completely eliminates awkward negotiations.",
    badge: "Higher Conversion",
  },
  {
    icon: Zap,
    title: "Instant Developer Distribution",
    desc: "Your listings are immediately surfaced to matching active job seekers, skill-filtered alert subscribers, and daily digest readers.",
    badge: "Fast Outreach",
  },
];

const COMPARISON = [
  { feature: "Targeted purely to software engineers", devhire: true, generic: false },
  { feature: "Mandatory salary transparency", devhire: true, generic: false },
  { feature: "Integrated GitHub & live portfolio inspector", devhire: true, generic: false },
  { feature: "Zero recruiter agency commission (No 25% fees)", devhire: true, generic: false },
  { feature: "Interactive ATS stage timeline tracker", devhire: true, generic: false },
  { feature: "Spam & unqualified bot filtration", devhire: true, generic: false },
];

const TESTIMONIALS = [
  {
    quote:
      "DevHire completely transformed our engineering hiring. We hired two senior full-stack developers in under two weeks without paying hefty 25% recruiter commissions.",
    author: "Alex Morgan",
    role: "VP of Engineering, CloudSphere",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
  },
  {
    quote:
      "The quality of developers on DevHire is night-and-day compared to generic job boards. Having candidates' GitHub profiles and salary expectations upfront saves tens of hours.",
    author: "Elena Rostova",
    role: "Head of Talent, Nexora Labs",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  },
];

const Employers = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-base-200">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold border border-primary/20 shadow-xs animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            <span>The Developer Recruitment Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-base-content max-w-4xl mx-auto leading-tight sm:leading-none">
            Hire world-class engineers without the{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
              recruitment friction.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Connect directly with ambitious software talent. Post engineering roles with salary transparency, inspect real GitHub portfolios, and manage your hiring pipeline in one unified portal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/register"
              className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold px-7 gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
            >
              <Briefcase className="w-4 h-4" />
              Post a Developer Job
            </Link>
            <Link
              to="/contact"
              className="btn btn-outline btn-sm sm:btn-md rounded-2xl font-bold px-6 gap-2"
            >
              <Building2 className="w-4 h-4" />
              Talk to Hiring Specialist
            </Link>
          </div>

          {/* Trusted Companies Bar */}
          <div className="pt-8">
            <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-4">
              Trusted by tech teams at high-growth startups & unicorns
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
              {TRUSTED_COMPANIES.map((company, i) => (
                <span
                  key={i}
                  className="font-black text-sm sm:text-base text-base-content/60 tracking-wider hover:text-primary transition-colors cursor-default"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROI METRICS */}
      <section className="py-12 bg-base-200/40 border-b border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-base-100 border border-base-300 text-center space-y-2 shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-base-content/60">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. VALUE PROPOSITIONS */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="badge badge-primary font-bold text-xs uppercase tracking-wider">
            Engineered For Hiring Teams
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-base-content">
            Everything your engineering team needs to hire with confidence.
          </h2>
          <p className="text-xs sm:text-sm text-base-content/65">
            Say goodbye to 500-resume spam piles. DevHire delivers qualified, stack-verified talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-base-100 border border-base-300 hover:border-primary/50 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="badge badge-primary badge-soft badge-xs font-bold">
                    {feat.badge}
                  </span>
                  <h3 className="text-base font-bold text-base-content">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. COMPARISON TABLE: DEVHIRE VS GENERIC BOARDS */}
      <section className="py-16 bg-base-200/50 border-y border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-base-content">
              Why tech teams choose DevHire
            </h2>
            <p className="text-xs sm:text-sm text-base-content/65">
              Compare how DevHire performs against traditional non-technical job portals.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-base-300 bg-base-100 shadow-sm max-w-4xl mx-auto">
            <table className="table w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-base-300 bg-base-200/60 text-base-content">
                  <th className="py-4 px-6 font-bold text-sm">Hiring Advantage</th>
                  <th className="py-4 px-6 font-black text-sm text-primary text-center">
                    DevHire
                  </th>
                  <th className="py-4 px-6 font-semibold text-sm text-base-content/60 text-center">
                    Traditional Job Boards
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200">
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="hover:bg-base-200/20 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-base-content">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="w-6 h-6 rounded-full bg-success/20 text-success inline-flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="w-6 h-6 rounded-full bg-base-300 text-base-content/40 inline-flex items-center justify-center">
                        <CloseIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-16 bg-base-200/40 border-t border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-black text-base-content">
              Loved by Engineering Leaders
            </h3>
            <p className="text-xs sm:text-sm text-base-content/60">
              Hear directly from CTOs and Talent Leaders who hire on DevHire.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((item, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-3xl bg-base-100 border border-base-300 shadow-xs space-y-4"
              >
                <p className="text-xs sm:text-sm text-base-content/80 italic leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-base-200">
                  <img
                    src={item.img}
                    alt={item.author}
                    className="w-10 h-10 rounded-full object-cover border border-base-300"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-base-content">
                      {item.author}
                    </h4>
                    <p className="text-[11px] text-base-content/60">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-linear-to-r from-primary/15 via-base-200 to-accent/15 border border-primary/20 space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-content flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
            Ready to hire your next engineering standout?
          </h2>

          <p className="text-xs sm:text-sm text-base-content/70 max-w-xl mx-auto leading-relaxed">
            Create your employer account today. Post your technical openings and start reviewing verified developer applicants within hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold px-8 shadow-md"
            >
              Create Employer Account
            </Link>
            <Link
              to="/contact"
              className="btn btn-ghost border border-base-300 btn-sm sm:btn-md rounded-2xl font-bold px-6"
            >
              Schedule Hiring Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Employers;
