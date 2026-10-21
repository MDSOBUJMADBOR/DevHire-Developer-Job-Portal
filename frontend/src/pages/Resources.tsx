import { useState, useMemo, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  Download,
  Bookmark,
  CheckCircle2,
  Layers,
  ChevronDown,
} from "lucide-react";

interface GuideItem {
  id: string;
  title: string;
  desc: string;
  category: "Interviews" | "Resume & Portfolio" | "Career Growth" | "System Design" | "Negotiation";
  readTime: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  featured?: boolean;
  downloadsCount?: number;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  content?: {
    summary: string;
    keyTakeaways: string[];
    steps: string[];
  };
}

const RESOURCES_DATA: GuideItem[] = [
  {
    id: "g-1",
    title: "The 2026 Staff-Level System Design Playbook",
    desc: "Architecting high-throughput microservices, distributed caches, and event-driven pipelines that scale to millions of concurrent users.",
    category: "System Design",
    readTime: "14 min read",
    level: "Advanced",
    featured: true,
    downloadsCount: 1240,
    author: {
      name: "Marcus Vance",
      role: "Ex-Staff Architect @ Stripe",
      initials: "MV",
    },
    content: {
      summary:
        "A practical guide to passing staff and principal engineering system design loops. Covers trade-offs between sync vs async messaging, consistency guarantees, partitioning strategies, and database sharding.",
      keyTakeaways: [
        "Always lead with requirements: calculate QPS, read/write ratios, and storage growth before proposing components.",
        "Choose idempotency keys and transactional outbox patterns to prevent double-processing in distributed systems.",
        "Design for failure: incorporate circuit breakers, exponential backoff with jitter, and dead letter queues.",
      ],
      steps: [
        "Phase 1: Clarifying Scope & Estimating Latency (5 mins)",
        "Phase 2: High-Level Architecture & API Contract (10 mins)",
        "Phase 3: Database Schema & Partition Key Strategy (15 mins)",
        "Phase 4: Bottleneck Deep-Dive & Resiliency Patterns (15 mins)",
      ],
    },
  },
  {
    id: "g-2",
    title: "Senior Frontend Interview Playbook (React 19 & TypeScript)",
    desc: "In-depth breakdown of state machines, React Compiler optimizations, concurrency, microfrontends, and web performance metrics (INP & LCP).",
    category: "Interviews",
    readTime: "9 min read",
    level: "Intermediate",
    featured: true,
    downloadsCount: 3100,
    author: {
      name: "Elena Rostova",
      role: "Principal UI Engineer @ Vercel",
      initials: "ER",
    },
    content: {
      summary:
        "Stop memorizing generic algorithm questions. Top engineering teams evaluate your mastery of component lifecycles, re-render avoidance, accessibility (a11y), and state boundaries.",
      keyTakeaways: [
        "Master the new React 19 Actions API and optimistic state updates.",
        "Understand browser rendering pipelines: reflow vs repaint and requestAnimationFrame scheduling.",
        "Demonstrate clean architectural isolation with custom hooks and compound component patterns.",
      ],
      steps: [
        "Step 1: Code a Real-World Custom Hook (useDebouncedFetch)",
        "Step 2: Optimize a 10,000-row Virtualized Data Table",
        "Step 3: Answer System Architecture for Client-Side Caching",
      ],
    },
  },
  {
    id: "g-3",
    title: "Developer Resume That Actually Passes ATS Scanners",
    desc: "Single-column Markdown and LaTeX templates engineered for automated parsing with real before/after bullet point examples.",
    category: "Resume & Portfolio",
    readTime: "6 min read",
    level: "Beginner",
    featured: false,
    downloadsCount: 5400,
    author: {
      name: "Darius King",
      role: "Technical Recruiter @ DevHire",
      initials: "DK",
    },
    content: {
      summary:
        "ATS systems reject 70% of developer resumes with graphical multi-columns or icon bars. Learn how to format your engineering experience with quantified business metrics.",
      keyTakeaways: [
        "Use the Google X-Y-Z formula: Accomplished [X], as measured by [Y], by doing [Z].",
        "Put your tech stack tags immediately beneath each job role.",
        "Keep links clickable and directly pointing to live production demos and GitHub repositories.",
      ],
      steps: [
        "Audit 1: Remove tables, graphics, and star rating bars",
        "Audit 2: Add quantified latency and revenue metrics",
        "Audit 3: Verify single-column PDF export compliance",
      ],
    },
  },
  {
    id: "g-4",
    title: "Salary Negotiation Scripts for Software Engineers",
    desc: "Word-for-word counter-offer emails and phone scripts that have helped engineers secure +$15k to +$45k in base salary and equity grants.",
    category: "Negotiation",
    readTime: "8 min read",
    level: "Intermediate",
    featured: false,
    downloadsCount: 2850,
    author: {
      name: "Sarah Lin",
      role: "Career Coach & Former Director @ Meta",
      initials: "SL",
    },
    content: {
      summary:
        "Negotiating is an expected part of tech hiring. Never accept the first verbal offer immediately; use time, leverage, and objective market data to expand your total package.",
      keyTakeaways: [
        "Always express excitement first before presenting counter-parameters.",
        "Frame requests around market benchmarking data rather than personal financial needs.",
        "Negotiate signing bonuses and equity acceleration if the base salary band is fixed.",
      ],
      steps: [
        "Step 1: The Verbal Response Script when the Offer is Extended",
        "Step 2: Crafting the Written Counter-Proposal",
        "Step 3: Handling Exploding Deadlines with Confidence",
      ],
    },
  },
  {
    id: "g-5",
    title: "MERN Stack Portfolio Projects That Get Interviews",
    desc: "Five full-stack production project blueprints complete with WebSocket notifications, Stripe billing, Redis caching, and CI/CD pipelines.",
    category: "Resume & Portfolio",
    readTime: "11 min read",
    level: "Intermediate",
    featured: false,
    downloadsCount: 1950,
    author: {
      name: "Tariq Mahmood",
      role: "Senior Full Stack Dev",
      initials: "TM",
    },
    content: {
      summary:
        "Tired of generic Todo apps and weather widgets? Build enterprise-grade prototypes with real-time multi-tenant data, webhook handlers, and automated test coverage.",
      keyTakeaways: [
        "Include authentication (OAuth2 + JWT with HTTP-only cookies).",
        "Deploy on production infrastructure with custom domain and SSL.",
        "Provide a 1-click 'Demo Account' button so recruiters can explore instantly without registering.",
      ],
      steps: [
        "Project 1: Real-Time Collaborative Document Canvas",
        "Project 2: Micro-SaaS Analytics Dashboard with Webhooks",
        "Project 3: Distributed Background Job Queue with Redis",
      ],
    },
  },
  {
    id: "g-6",
    title: "Junior to Senior Software Engineer Roadmap",
    desc: "A milestone-based framework outlining technical depth, team leadership, cross-functional communication, and PR review standards.",
    category: "Career Growth",
    readTime: "13 min read",
    level: "Intermediate",
    featured: false,
    downloadsCount: 4200,
    author: {
      name: "Marcus Vance",
      role: "Ex-Staff Architect @ Stripe",
      initials: "MV",
    },
    content: {
      summary:
        "Advancement isn't just about typing code faster. Senior engineers are multipliers who unblock teammates, mitigate technical debt, and prevent costly architectural blunders.",
      keyTakeaways: [
        "Shift from solving tickets to identifying high-impact business problems.",
        "Write clear Technical Design Documents (TDD) before writing code.",
        "Mentor juniors and elevate overall engineering standards via constructive code reviews.",
      ],
      steps: [
        "Milestone 1: Independent Ownership of Complex Features",
        "Milestone 2: Leading Team-Wide Architecture Decisions",
        "Milestone 3: Cross-Team Influence & Technical Strategy",
      ],
    },
  },
  {
    id: "g-7",
    title: "The Ultimate Remote Engineering Toolkit",
    desc: "Asynchronous communication best practices, timezone management, home lab ergonomics, and standing out in global distributed teams.",
    category: "Career Growth",
    readTime: "7 min read",
    level: "Beginner",
    featured: false,
    downloadsCount: 1680,
    author: {
      name: "Elena Rostova",
      role: "Principal UI Engineer @ Vercel",
      initials: "ER",
    },
    content: {
      summary:
        "Remote work rewards asynchronous clarity. Learn how to write PR descriptions that get approved in one pass and document decisions effortlessly.",
      keyTakeaways: [
        "Write overcommunicate summaries with Loom videos and architecture diagrams.",
        "Establish non-negotiable deep-work focus blocks on your calendar.",
        "Master Git rebase and atomic commits to streamline team merges.",
      ],
      steps: [
        "Habit 1: The 15-Minute Daily Async Standup Format",
        "Habit 2: Writing Self-Documenting Pull Requests",
        "Habit 3: Managing Energy & Preventing Remote Burnout",
      ],
    },
  },
];

const CATEGORIES = [
  "All",
  "Interviews",
  "System Design",
  "Resume & Portfolio",
  "Negotiation",
  "Career Growth",
];

const DOWNLOADABLE_TOOLKITS = [
  {
    title: "ATS-Ready Developer Resume Template",
    type: "PDF & Markdown",
    size: "420 KB",
    downloads: "14.2k",
    tag: "Resume",
  },
  {
    title: "System Design Cheat Sheet (Microservices & DBs)",
    type: "PDF Quick Ref",
    size: "1.2 MB",
    downloads: "28.5k",
    tag: "Architecture",
  },
  {
    title: "Tech Offer Negotiation Email Scripts",
    type: "DOCX & Markdown",
    size: "180 KB",
    downloads: "9.8k",
    tag: "Salary",
  },
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeGuideModal, setActiveGuideModal] = useState<GuideItem | null>(null);
  const [savedGuideIds, setSavedGuideIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("devhire_saved_guides");
      if (stored) return JSON.parse(stored);
    } catch {}
    return ["g-1", "g-3"];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = (id: string, title: string) => {
    setSavedGuideIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("devhire_saved_guides", JSON.stringify(updated));
      } catch {}
      showToast(exists ? `Removed "${title}" from saved guides.` : `Saved "${title}" to your library! 🔖`);
      return updated;
    });
  };

  const handleDownloadMock = (name: string) => {
    showToast(`Downloading "${name}"... 📥`);
  };

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast(`Thanks for subscribing! Playbooks will be delivered to ${newsletterEmail}. 🎉`);
    setNewsletterEmail("");
  };

  const filteredGuides = useMemo(() => {
    return RESOURCES_DATA.filter((guide) => {
      const matchSearch =
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "All" ||
        guide.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="alert alert-success shadow-lg fixed bottom-6 right-6 z-50 max-w-md animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-base-300 bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-16 sm:py-20">
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Engineering Playbooks & Career Toolkit
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-base-content max-w-3xl mx-auto leading-tight">
            Developer Career & Technical{" "}
            <span className="text-primary bg-clip-text">Resource Hub</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-base-content/70 leading-relaxed">
            Battle-tested guides on technical interviews, ATS-friendly resumes, salary negotiation, and distributed system architectures written by engineering leaders.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-3xl border border-base-300 bg-base-100 shadow-sm">
              <p className="text-xs font-bold text-base-content/60 uppercase">
                Free Guides
              </p>
              <p className="text-2xl font-black text-base-content mt-1">45+ Playbooks</p>
            </div>
            <div className="p-4 rounded-3xl border border-primary/20 bg-primary/5 shadow-sm">
              <p className="text-xs font-bold text-primary uppercase">
                Community Downloads
              </p>
              <p className="text-2xl font-black text-primary mt-1">48,000+</p>
            </div>
            <div className="p-4 rounded-3xl border border-accent/20 bg-accent/5 shadow-sm">
              <p className="text-xs font-bold text-accent uppercase">
                Success Rate
              </p>
              <p className="text-2xl font-black text-accent mt-1">87% Callbacks</p>
            </div>
            <div className="p-4 rounded-3xl border border-base-300 bg-base-100 shadow-sm">
              <p className="text-xs font-bold text-base-content/60 uppercase">
                Access Level
              </p>
              <p className="text-2xl font-black text-base-content mt-1">100% Free</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Featured Editorial Spotlight Banner */}
        <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary font-bold text-xs">Featured Guide</span>
                <span className="text-xs font-bold text-base-content/60">System Design Track</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
                {RESOURCES_DATA[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                {RESOURCES_DATA[0].desc}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/60 pt-1">
                <span className="flex items-center gap-1 font-semibold text-base-content">
                  By {RESOURCES_DATA[0].author.name} ({RESOURCES_DATA[0].author.role})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {RESOURCES_DATA[0].readTime}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveGuideModal(RESOURCES_DATA[0])}
                className="btn btn-primary btn-sm rounded-xl font-bold px-6 shadow-sm gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Read Full Playbook
              </button>
              <button
                type="button"
                onClick={() => toggleBookmark(RESOURCES_DATA[0].id, RESOURCES_DATA[0].title)}
                className={`btn btn-sm rounded-xl font-bold gap-2 ${
                  savedGuideIds.includes(RESOURCES_DATA[0].id)
                    ? "btn-accent"
                    : "btn-ghost border border-base-300"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                {savedGuideIds.includes(RESOURCES_DATA[0].id) ? "Saved" : "Save Guide"}
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search guides by title, category, or keyword (e.g. React, Resume, Negotiation)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm w-full pl-9 rounded-xl bg-base-100 border-base-300 text-xs sm:text-sm font-medium focus:border-primary focus:outline-none"
              />
            </div>

            <div className="text-xs font-semibold text-base-content/60 self-center">
              Showing <strong>{filteredGuides.length}</strong> guides
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-xs rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? "btn-primary shadow-xs"
                    : "btn-ghost bg-base-100 border border-base-300 hover:border-base-content/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100">
            <BookOpen className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-base-content">
              No matching playbooks found
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGuides.map((guide) => {
              const isSaved = savedGuideIds.includes(guide.id);
              return (
                <article
                  key={guide.id}
                  className="group rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge badge-primary badge-soft text-xs font-bold">
                        {guide.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(guide.id, guide.title)}
                        title={isSaved ? "Remove from bookmarks" : "Save guide"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSaved
                            ? "text-primary bg-primary/10"
                            : "text-base-content/40 hover:text-base-content hover:bg-base-200"
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    <h3
                      onClick={() => setActiveGuideModal(guide)}
                      className="font-extrabold text-base text-base-content group-hover:text-primary transition-colors cursor-pointer leading-snug"
                    >
                      {guide.title}
                    </h3>

                    <p className="text-xs text-base-content/70 leading-relaxed line-clamp-3">
                      {guide.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-base-200 space-y-3">
                    <div className="flex items-center justify-between text-xs text-base-content/60">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-base-200 text-base-content/80 font-bold flex items-center justify-center text-[10px]">
                          {guide.author.initials}
                        </div>
                        <span className="font-semibold truncate max-w-[120px]">
                          {guide.author.name}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {guide.readTime}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveGuideModal(guide)}
                      className="btn btn-sm btn-outline border-base-300 hover:btn-primary w-full rounded-xl font-bold text-xs gap-1.5"
                    >
                      Read Playbook <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Downloadable Toolkits & Cheat Sheets */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Free Developer Toolkits
              </span>
              <h3 className="text-xl font-black text-base-content mt-0.5">
                Downloadable Templates & Quick References
              </h3>
            </div>
            <span className="badge badge-ghost font-bold text-xs">Instant Download</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DOWNLOADABLE_TOOLKITS.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-base-200/40 border border-base-200 flex flex-col justify-between space-y-3 hover:border-primary/40 transition-all"
              >
                <div>
                  <span className="badge badge-sm badge-ghost font-bold text-[11px] mb-2">
                    {item.tag}
                  </span>
                  <h4 className="font-extrabold text-sm text-base-content">
                    {item.title}
                  </h4>
                  <p className="text-xs text-base-content/60 mt-1">
                    {item.type} • {item.size} • {item.downloads} downloads
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadMock(item.title)}
                  className="btn btn-xs btn-primary rounded-xl font-bold gap-1.5 self-start"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Free
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Career Questions (Accordion) */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Got Questions?
            </span>
            <h3 className="text-xl font-black text-base-content mt-0.5">
              Frequently Asked Career & Hiring Questions
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <details className="group rounded-2xl border border-base-300 bg-base-200/30 p-4 open:bg-base-200/60 transition-colors">
              <summary className="font-extrabold text-base-content cursor-pointer flex items-center justify-between">
                <span>How should I organize my GitHub repository to catch recruiters' eyes?</span>
                <ChevronDown className="w-4 h-4 text-base-content/50 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-base-content/75 leading-relaxed pl-1">
                Pin 3–4 production-quality repositories with comprehensive `README.md` files including animated demo GIFs, system architecture diagrams, tech stacks used, and live demo links with 1-click test credentials.
              </p>
            </details>

            <details className="group rounded-2xl border border-base-300 bg-base-200/30 p-4 open:bg-base-200/60 transition-colors">
              <summary className="font-extrabold text-base-content cursor-pointer flex items-center justify-between">
                <span>What is the biggest red flag in take-home coding assessments?</span>
                <ChevronDown className="w-4 h-4 text-base-content/50 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-base-content/75 leading-relaxed pl-1">
                Lack of automated test coverage, messy Git commit history (single giant commit), and ignoring edge cases (like network disconnects, null values, or rate limits). Always include a concise architectural summary explaining your design decisions.
              </p>
            </details>

            <details className="group rounded-2xl border border-base-300 bg-base-200/30 p-4 open:bg-base-200/60 transition-colors">
              <summary className="font-extrabold text-base-content cursor-pointer flex items-center justify-between">
                <span>When is the optimal time to negotiate salary during tech interviews?</span>
                <ChevronDown className="w-4 h-4 text-base-content/50 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-base-content/75 leading-relaxed pl-1">
                Wait until the hiring team has fully vetted you and explicitly extended a formal offer. At that moment, your leverage is at its absolute peak because they have committed to you as their top candidate.
              </p>
            </details>
          </div>
        </div>

        {/* Free Newsletter / Digest CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-10 text-primary-content shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Get Weekly Engineering Playbooks
            </h3>
            <p className="text-xs sm:text-sm text-primary-content/85 max-w-xl">
              Join 18,000+ software engineers receiving our curated interview breakdowns, architectural diagrams, and compensation updates every Tuesday morning.
            </p>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto"
          >
            <input
              type="email"
              required
              placeholder="Enter your work email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="input input-sm rounded-xl bg-white text-base-content placeholder:text-base-content/50 text-xs sm:text-sm font-semibold w-full sm:w-64 focus:outline-none"
            />
            <button
              type="submit"
              className="btn btn-sm btn-neutral bg-base-content text-base-100 hover:bg-base-content/90 border-none rounded-xl font-bold px-5 text-xs w-full sm:w-auto shrink-0 shadow-md"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </div>

      {/* Guide Reader Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-base-200 pb-4">
              <div>
                <span className="badge badge-primary badge-soft font-bold text-xs">
                  {activeGuideModal.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-base-content mt-1">
                  {activeGuideModal.title}
                </h2>
                <p className="text-xs text-base-content/60 mt-1">
                  By {activeGuideModal.author.name} • {activeGuideModal.readTime}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuideModal(null)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {activeGuideModal.content && (
              <div className="space-y-6 text-sm text-base-content/80">
                <div className="p-4 rounded-2xl bg-base-200/50 border border-base-200">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-primary mb-1">
                    Executive Summary
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-base-content/85">
                    {activeGuideModal.content.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-base-content mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-warning" />
                    Key Architectural Takeaways
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    {activeGuideModal.content.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-base-content mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Actionable Roadmap & Checklist
                  </h4>
                  <div className="space-y-2">
                    {activeGuideModal.content.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-base-200/40 border border-base-200 text-xs font-semibold flex items-center gap-3"
                      >
                        <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-base-200">
              <button
                type="button"
                onClick={() =>
                  toggleBookmark(activeGuideModal.id, activeGuideModal.title)
                }
                className="btn btn-sm btn-ghost gap-2 font-bold text-xs"
              >
                <Bookmark className="w-4 h-4" />
                {savedGuideIds.includes(activeGuideModal.id) ? "Saved in Library" : "Bookmark Guide"}
              </button>

              <div className="flex items-center gap-2">
                <Link
                  to="/jobs"
                  className="btn btn-sm btn-primary rounded-xl font-bold px-5 text-xs"
                >
                  Apply These Skills in Jobs
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveGuideModal(null)}
                  className="btn btn-sm btn-ghost rounded-xl font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
