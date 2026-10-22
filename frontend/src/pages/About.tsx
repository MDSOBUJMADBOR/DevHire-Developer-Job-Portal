import { Link } from "react-router-dom";
import {
  Code2,
  Terminal,
  ShieldCheck,
  Users,
  Building2,
  Sparkles,
  Zap,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Layers,
  Heart,
  DollarSign,
  Cpu,
} from "lucide-react";

const STATS = [
  { value: "18,500+", label: "Active Software Engineers", icon: Users },
  { value: "850+", label: "Vetted Tech Teams & Startups", icon: Building2 },
  { value: "$145k", label: "Average Global Compensation", icon: DollarSign },
  { value: "94%", label: "Placement Satisfaction Rate", icon: CheckCircle2 },
];

const CORE_VALUES = [
  {
    icon: DollarSign,
    title: "Radical Salary Transparency",
    description:
      "No more guessing games or awkward negotiations. Every single developer opening published on DevHire includes explicit, verified compensation bands.",
    badge: "Transparency",
  },
  {
    icon: Terminal,
    title: "Engineered for Tech Stacks",
    description:
      "Filter jobs by exact technologies—React 19, Go, Node.js, Kubernetes, Next.js, and Python—rather than vague corporate buzzwords.",
    badge: "Developer First",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Ghosting Commitment",
    description:
      "Our interactive application pipeline gives candidates real-time visibility into their hiring status, from screening to interview to final offer.",
    badge: "Respect",
  },
  {
    icon: Zap,
    title: "Fast-Track Technical Hiring",
    description:
      "We cut down hiring latency by connecting technical recruiters directly with pre-screened engineering talent with portfolio and GitHub integration.",
    badge: "Efficiency",
  },
];

const PLATFORM_PILLARS = [
  {
    role: "For Software Engineers",
    headline: "Take control of your technical career trajectory",
    points: [
      "Real-time application tracking with interactive stage timelines",
      "Salary benchmarking calculator tailored to experience level & tech stack",
      "In-app resume viewer and skills endorsement tracker",
      "One-click applications to high-growth tech companies & unicorns",
    ],
    ctaText: "Explore Open Roles",
    ctaLink: "/jobs",
    highlight: "bg-primary/10 border-primary/20",
  },
  {
    role: "For Hiring Teams & CTOs",
    headline: "Source, evaluate, and hire top 1% engineering talent",
    points: [
      "Targeted job distribution directly to active developers",
      "Full applicant tracking system (ATS) with pipeline conversion stages",
      "Company branding portal to showcase tech stack and engineering culture",
      "Granular filters by remote, hybrid, seniority level, and frameworks",
    ],
    ctaText: "Post a Developer Job",
    ctaLink: "/register",
    highlight: "bg-accent/10 border-accent/20",
  },
];

const TECH_ECOSYSTEM = [
  { name: "Frontend", stack: "React 19, TypeScript, Next.js, Vue, Tailwind CSS" },
  { name: "Backend & Systems", stack: "Node.js, Go, Python, Rust, Java, Express" },
  { name: "Cloud & DevOps", stack: "AWS, Docker, Kubernetes, Terraform, CI/CD" },
  { name: "Data & AI", stack: "PostgreSQL, MongoDB, Redis, LLMs, PyTorch" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-base-200">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold border border-primary/20 shadow-xs animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            <span>The Developer-First Career & Recruitment Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-base-content max-w-4xl mx-auto leading-tight sm:leading-none">
            Built by engineers, for engineers who want{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-accent">
              better hiring.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            DevHire bridges the gap between ambitious software talent and modern tech companies with verified tech stacks, salary transparency, and seamless ATS application tracking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/jobs"
              className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold px-6 gap-2 shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
            >
              <Briefcase className="w-4 h-4" />
              Explore Open Jobs
            </Link>
            <Link
              to="/companies"
              className="btn btn-outline btn-sm sm:btn-md rounded-2xl font-bold px-6 gap-2"
            >
              <Building2 className="w-4 h-4" />
              Browse Top Tech Teams
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE PLATFORM METRICS */}
      <section className="py-12 bg-base-200/50 border-b border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-base-100 border border-base-300 text-center space-y-2 shadow-xs hover:border-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
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

      {/* 3. OUR STORY & THE PROBLEM WE SOLVE */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200 text-xs font-bold text-base-content/70">
              <Code2 className="w-3.5 h-3.5 text-primary" />
              Our Story & Origin
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
              Why traditional job platforms fail modern developers.
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-base-content/75 leading-relaxed">
              <p>
                For years, software engineers have had to navigate generic job boards overloaded with recruiter spam, undisclosed salaries, obsolete requirements, and black-hole application processes where candidate submissions vanish without feedback.
              </p>
              <p>
                We built <span className="font-bold text-base-content">DevHire</span> to replace obsolete recruitment friction with complete transparency. Every role on DevHire specifies concrete tech stacks, real salary brackets, and work arrangements (Remote, Hybrid, or On-site).
              </p>
              <p>
                Whether you are a junior engineer looking for your first breakthrough or a principal architect negotiating your next career leap, DevHire gives you the tools, insights, and visibility to make data-driven career choices.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100"].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="Engineer"
                    className="w-10 h-10 rounded-full border-2 border-base-100 object-cover"
                  />
                ))}
              </div>
              <p className="text-xs font-semibold text-base-content/70">
                Backed by 1,000+ developer community contributors & leaders.
              </p>
            </div>
          </div>

          {/* Interactive Code / Showcase Window */}
          <div className="rounded-3xl border border-base-300 bg-base-200/50 p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-base-300">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error" />
                <span className="w-3 h-3 rounded-full bg-warning" />
                <span className="w-3 h-3 rounded-full bg-success" />
              </div>
              <span className="text-[11px] font-mono text-base-content/50">
                devhire-manifesto.ts
              </span>
            </div>

            <pre className="text-xs sm:text-sm font-mono text-base-content/90 bg-base-100 p-4 rounded-2xl overflow-x-auto leading-relaxed border border-base-300">
              <code>{`const DevHireManifesto = {
  mission: "Empower software engineers worldwide",
  corePrinciples: [
    "100% Salary Transparency on every post",
    "Real technical requirements (No 10 yrs exp in 2 yr old tech)",
    "Real-time ATS tracking without recruiter ghosting",
    "Verified high-growth teams & startups"
  ],
  engineeringStack: ["React 19", "TypeScript", "Node.js", "MongoDB"],
  communityFirst: true,
};

export default DevHireManifesto;`}</code>
            </pre>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-base-100 border border-base-300 text-xs">
                <span className="text-primary font-bold block text-sm">100%</span>
                <span className="text-base-content/60">Salary Transparency</span>
              </div>
              <div className="p-3 rounded-2xl bg-base-100 border border-base-300 text-xs">
                <span className="text-success font-bold block text-sm">Real-Time</span>
                <span className="text-base-content/60">Stage Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES / PRINCIPLES */}
      <section className="py-16 bg-base-200/40 border-y border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Heart className="w-3.5 h-3.5" />
              Our Core Values
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-base-content">
              What we stand for every single day.
            </h2>
            <p className="text-xs sm:text-sm text-base-content/65">
              The fundamental guidelines that shape every feature we ship on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-base-100 border border-base-300 hover:border-primary/50 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge badge-primary badge-soft badge-xs font-bold">
                      {val.badge}
                    </span>
                    <h3 className="text-base font-bold text-base-content">
                      {val.title}
                    </h3>
                    <p className="text-xs text-base-content/70 leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DUAL-SIDED ECOSYSTEM: DEVELOPERS & EMPLOYERS */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            Two-Sided Synergy
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-base-content">
            Tailored experiences for both talent and teams.
          </h2>
          <p className="text-xs sm:text-sm text-base-content/65">
            Dedicated portals engineered specifically for the distinct requirements of each role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PLATFORM_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border ${pillar.highlight} bg-base-100 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow`}
            >
              <div className="space-y-4">
                <span className="badge badge-primary font-bold text-xs">
                  {pillar.role}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-base-content leading-snug">
                  {pillar.headline}
                </h3>
                <ul className="space-y-2.5 pt-2">
                  {pillar.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-base-content/80">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={pillar.ctaLink}
                className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold gap-2 self-start"
              >
                {pillar.ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SUPPORTED TECH STACKS & ECOSYSTEM */}
      <section className="py-14 bg-base-200/50 border-t border-base-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-base-content">
              Supported Engineering Ecosystems
            </h3>
            <p className="text-xs text-base-content/60">
              Connecting specialists across modern software stacks
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_ECOSYSTEM.map((eco, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-base-100 border border-base-300 space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-base-content">
                    {eco.name}
                  </h4>
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed font-medium">
                  {eco.stack}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-16 sm:py-24 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-14 rounded-3xl bg-linear-to-r from-primary/15 via-base-200 to-accent/15 border border-primary/20 space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-content flex items-center justify-center mx-auto shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-base-content tracking-tight">
            Ready to find your next engineering chapter?
          </h2>

          <p className="text-xs sm:text-sm text-base-content/70 max-w-xl mx-auto">
            Join thousands of developers and top technology companies already growing together on DevHire.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="btn btn-primary btn-sm sm:btn-md rounded-2xl font-bold px-8 shadow-md"
            >
              Get Started for Free
            </Link>
            <Link
              to="/salaries"
              className="btn btn-ghost border border-base-300 btn-sm sm:btn-md rounded-2xl font-bold px-6"
            >
              Explore Salary Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
