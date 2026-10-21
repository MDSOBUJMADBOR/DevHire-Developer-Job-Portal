import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Building2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export interface CompanyItem {
  id: string;
  name: string;
  initial: string;
  industry: string;
  category: "SaaS" | "Fintech" | "AI & Data" | "Cloud & DevOps" | "DevTools";
  roles: number;
  location: string;
  workModel: "Remote-First" | "Hybrid" | "Global Remote" | "On-Site";
  avgSalary: string;
  techStack: string[];
  description: string;
  featured?: boolean;
}

const COMPANIES_DATA: CompanyItem[] = [
  {
    id: "c-1",
    name: "Stripe",
    initial: "S",
    industry: "Financial Infrastructure & Payments",
    category: "Fintech",
    roles: 412,
    location: "San Francisco, CA • Remote",
    workModel: "Global Remote",
    avgSalary: "$165k–$220k",
    techStack: ["Ruby", "Go", "React", "TypeScript", "Kafka"],
    description: "Building the financial infrastructure for the internet with high-availability distributed systems.",
    featured: true,
  },
  {
    id: "c-2",
    name: "Vercel",
    initial: "V",
    industry: "Frontend Cloud & Developer Experience",
    category: "DevTools",
    roles: 185,
    location: "Remote (Global)",
    workModel: "Remote-First",
    avgSalary: "$150k–$195k",
    techStack: ["Next.js", "React 19", "Rust", "Node.js", "Edge Compute"],
    description: "The platform for frontend developers, providing the speed and reliability needed to innovate at the edge.",
    featured: true,
  },
  {
    id: "c-3",
    name: "Supabase",
    initial: "S",
    industry: "Open Source Backend & Databases",
    category: "DevTools",
    roles: 94,
    location: "Worldwide Remote",
    workModel: "Global Remote",
    avgSalary: "$140k–$185k",
    techStack: ["PostgreSQL", "Elixir", "Go", "TypeScript", "Docker"],
    description: "The open source Firebase alternative providing Postgres databases, authentication, edge functions, and real-time APIs.",
    featured: true,
  },
  {
    id: "c-4",
    name: "OpenAI",
    initial: "O",
    industry: "Artificial Intelligence & Research",
    category: "AI & Data",
    roles: 230,
    location: "San Francisco, CA",
    workModel: "Hybrid",
    avgSalary: "$210k–$310k",
    techStack: ["Python", "PyTorch", "Kubernetes", "TypeScript", "Triton"],
    description: "Pioneering safe, beneficial artificial general intelligence through cutting-edge neural models.",
    featured: true,
  },
  {
    id: "c-5",
    name: "Datadog",
    initial: "D",
    industry: "Cloud Monitoring & Observability",
    category: "Cloud & DevOps",
    roles: 320,
    location: "New York, NY • Remote",
    workModel: "Hybrid",
    avgSalary: "$155k–$190k",
    techStack: ["Go", "Python", "Kafka", "PostgreSQL", "Terraform"],
    description: "Essential monitoring and security platform for cloud applications, handling trillions of daily events.",
  },
  {
    id: "c-6",
    name: "Nexora Technologies",
    initial: "N",
    industry: "Enterprise SaaS • Cloud Management",
    category: "SaaS",
    roles: 320,
    location: "Austin, TX (Remote)",
    workModel: "Remote-First",
    avgSalary: "$135k–$175k",
    techStack: ["React", "TypeScript", "Node.js", "AWS", "GraphQL"],
    description: "Next-generation SaaS workflow automation and developer productivity management software.",
  },
  {
    id: "c-7",
    name: "Cloudly Systems",
    initial: "C",
    industry: "Serverless & Cloud Infrastructure",
    category: "Cloud & DevOps",
    roles: 280,
    location: "Seattle, WA • Hybrid",
    workModel: "Hybrid",
    avgSalary: "$140k–$180k",
    techStack: ["Go", "Kubernetes", "AWS", "Terraform", "Redis"],
    description: "High-performance cloud virtualization and automated container orchestration platforms.",
  },
  {
    id: "c-8",
    name: "FintechCo Solutions",
    initial: "F",
    industry: "Digital Banking & Wealth Management",
    category: "Fintech",
    roles: 190,
    location: "New York, NY • Hybrid",
    workModel: "Hybrid",
    avgSalary: "$145k–$190k",
    techStack: ["Java", "Spring Boot", "React", "PostgreSQL", "Docker"],
    description: "Institutional financial trading APIs and consumer neobanking infrastructure.",
  },
  {
    id: "c-9",
    name: "Datawise Analytics",
    initial: "D",
    industry: "Big Data Pipelines & Vector Search",
    category: "AI & Data",
    roles: 240,
    location: "Remote (US/EU)",
    workModel: "Global Remote",
    avgSalary: "$150k–$185k",
    techStack: ["Python", "Apache Spark", "Snowflake", "FastAPI", "React"],
    description: "Empowering business intelligence with real-time streaming analytics and generative AI models.",
  },
  {
    id: "c-10",
    name: "Shipfast DevTools",
    initial: "S",
    industry: "CI/CD & Developer Productivity",
    category: "DevTools",
    roles: 150,
    location: "San Francisco, CA • Remote",
    workModel: "Remote-First",
    avgSalary: "$130k–$170k",
    techStack: ["TypeScript", "Next.js", "Docker", "Tailwind CSS", "Prisma"],
    description: "Modern deployment workflows that allow engineering teams to ship code from git push to production in seconds.",
  },
  {
    id: "c-11",
    name: "PixelForge Commerce",
    initial: "P",
    industry: "Headless E-commerce & Retail Tech",
    category: "SaaS",
    roles: 130,
    location: "London, UK • Remote",
    workModel: "Remote-First",
    avgSalary: "£90k–£125k",
    techStack: ["React 19", "Node.js", "GraphQL", "Redis", "Stripe"],
    description: "Architecting lightning-fast headless storefronts and multi-currency payment checkout flows.",
  },
  {
    id: "c-12",
    name: "Cloudflare",
    initial: "C",
    industry: "Edge Compute & Internet Security",
    category: "Cloud & DevOps",
    roles: 295,
    location: "San Francisco, CA • Remote",
    workModel: "Global Remote",
    avgSalary: "$160k–$210k",
    techStack: ["Rust", "Go", "TypeScript", "Wasm", "Linux Kernel"],
    description: "Connecting and protecting internet properties worldwide with massive global edge infrastructure.",
  },
  {
    id: "c-13",
    name: "Figma",
    initial: "F",
    industry: "Collaborative Web Design Software",
    category: "SaaS",
    roles: 160,
    location: "San Francisco, CA • Hybrid",
    workModel: "Hybrid",
    avgSalary: "$170k–$225k",
    techStack: ["C++", "WebAssembly", "TypeScript", "React", "Rust"],
    description: "Empowering millions of product designers and frontend engineers with collaborative design tools.",
  },
  {
    id: "c-14",
    name: "Scale AI",
    initial: "S",
    industry: "AI Data Infrastructure & ML Ops",
    category: "AI & Data",
    roles: 215,
    location: "San Francisco, CA • Hybrid",
    workModel: "Hybrid",
    avgSalary: "$175k–$240k",
    techStack: ["Python", "TypeScript", "React", "PostgreSQL", "Docker"],
    description: "Delivering world-class labeled datasets and foundation model evaluation platforms.",
  },
  {
    id: "c-15",
    name: "Postman",
    initial: "P",
    industry: "API Development & Collaboration",
    category: "DevTools",
    roles: 125,
    location: "Remote (Global)",
    workModel: "Global Remote",
    avgSalary: "$130k–$175k",
    techStack: ["Node.js", "React", "Electron", "TypeScript", "AWS"],
    description: "The industry standard API platform used by over 30 million developers to build and test APIs.",
  },
  {
    id: "c-16",
    name: "MongoDB Inc",
    initial: "M",
    industry: "Document Database & Cloud Atlas",
    category: "Cloud & DevOps",
    roles: 260,
    location: "New York, NY • Remote",
    workModel: "Global Remote",
    avgSalary: "$145k–$195k",
    techStack: ["C++", "Go", "Python", "TypeScript", "Kubernetes"],
    description: "Empowering innovators with the leading document database and scalable serverless cloud data platform.",
  },
  {
    id: "c-17",
    name: "Shopify",
    initial: "S",
    industry: "Global Commerce & POS Infrastructure",
    category: "SaaS",
    roles: 340,
    location: "Digital by Design (Remote)",
    workModel: "Remote-First",
    avgSalary: "$150k–$190k",
    techStack: ["Ruby on Rails", "React", "TypeScript", "GraphQL", "MySQL"],
    description: "Powering millions of independent businesses across 175+ countries with robust e-commerce backends.",
  },
  {
    id: "c-18",
    name: "Elastic",
    initial: "E",
    industry: "Search & Real-time Analytics",
    category: "AI & Data",
    roles: 175,
    location: "Distributed (Global Remote)",
    workModel: "Global Remote",
    avgSalary: "$140k–$185k",
    techStack: ["Java", "Scala", "TypeScript", "Go", "Lucene"],
    description: "Leading search platform powering observability, enterprise vector search, and cybersecurity operations.",
  },
];

const CATEGORIES = [
  "All",
  "Fintech",
  "AI & Data",
  "DevTools",
  "Cloud & DevOps",
  "SaaS",
];

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");

  const filteredCompanies = useMemo(() => {
    return COMPANIES_DATA.filter((comp) => {
      const matchSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.techStack.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchCat =
        selectedCategory === "All" || comp.category === selectedCategory;

      const matchModel =
        selectedModel === "All" || comp.workModel === selectedModel;

      return matchSearch && matchCat && matchModel;
    });
  }, [searchQuery, selectedCategory, selectedModel]);

  const totalOpenRoles = useMemo(() => {
    return COMPANIES_DATA.reduce((acc, c) => acc + c.roles, 0);
  }, []);

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-base-300 bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-16 sm:py-20">
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Vetted Engineering Teams
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-base-content max-w-3xl mx-auto leading-tight">
            Top Companies Hiring{" "}
            <span className="text-primary bg-clip-text">Developers</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-base-content/70 leading-relaxed">
            Discover verified tech teams with transparent salary bands, engineering-driven cultures, and open full-time, contract, and remote positions.
          </p>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 text-left">
            <div className="p-4 rounded-3xl border border-base-300 bg-base-100 shadow-sm">
              <p className="text-xs font-bold text-base-content/60 uppercase">
                Featured Employers
              </p>
              <p className="text-2xl font-black text-base-content mt-1">
                {COMPANIES_DATA.length}+ Companies
              </p>
            </div>
            <div className="p-4 rounded-3xl border border-primary/20 bg-primary/5 shadow-sm">
              <p className="text-xs font-bold text-primary uppercase">
                Total Live Roles
              </p>
              <p className="text-2xl font-black text-primary mt-1">
                {totalOpenRoles.toLocaleString()}+ Jobs
              </p>
            </div>
            <div className="p-4 rounded-3xl border border-accent/20 bg-accent/5 shadow-sm">
              <p className="text-xs font-bold text-accent uppercase">
                Remote Availability
              </p>
              <p className="text-2xl font-black text-accent mt-1">85% Remote</p>
            </div>
            <div className="p-4 rounded-3xl border border-base-300 bg-base-100 shadow-sm">
              <p className="text-xs font-bold text-base-content/60 uppercase">
                Salary Transparency
              </p>
              <p className="text-2xl font-black text-base-content mt-1">100% Vetted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search companies by name, tech stack (e.g. React, Go, PyTorch), or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm w-full pl-9 rounded-xl bg-base-100 border-base-300 text-xs sm:text-sm font-medium focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="select select-sm rounded-xl bg-base-100 border-base-300 text-xs font-bold"
              >
                <option value="All">All Work Models</option>
                <option value="Global Remote">Global Remote</option>
                <option value="Remote-First">Remote-First</option>
                <option value="Hybrid">Hybrid</option>
              </select>

              <span className="text-xs font-bold text-base-content/60 whitespace-nowrap pl-2">
                <strong>{filteredCompanies.length}</strong> companies
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-xs rounded-xl font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "btn-primary shadow-xs"
                    : "btn-ghost bg-base-100 border border-base-300 hover:border-base-content/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100">
            <Building2 className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-base-content">
              No hiring companies found
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
              Try adjusting your search query or switching industry categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCompanies.map((company) => (
              <article
                key={company.id}
                className="group rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-xl font-black text-primary border border-primary/20 shrink-0">
                        {company.initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-extrabold text-base-content group-hover:text-primary transition-colors">
                            {company.name}
                          </h2>
                          {company.featured && (
                            <span className="badge badge-primary badge-soft text-[10px] font-bold px-1.5 py-0.5">
                              Top Employer
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-base-content/60 mt-0.5">
                          {company.industry}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-base-content/75 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Badges Info */}
                  <div className="p-3 rounded-2xl bg-base-200/50 border border-base-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/60">Location / Model:</span>
                      <span className="font-semibold text-base-content/90">
                        {company.workModel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/60">Average Compensation:</span>
                      <span className="font-bold text-success">
                        {company.avgSalary}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base-content/60">Active Engineering Roles:</span>
                      <span className="font-bold text-primary">
                        {company.roles} open roles
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {company.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-base-200 text-[11px] font-semibold text-base-content/75"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-base-200 flex items-center gap-2">
                  <Link
                    to="/jobs"
                    className="btn btn-primary btn-sm flex-1 rounded-xl font-bold gap-1 text-xs shadow-xs"
                  >
                    View {company.roles} Jobs <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/salaries"
                    className="btn btn-ghost border border-base-300 btn-sm rounded-xl font-bold text-xs hover:bg-base-200"
                  >
                    Salaries
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Hiring CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-10 text-primary-content shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Are you hiring top software engineers?
            </h3>
            <p className="text-xs sm:text-sm text-primary-content/85 max-w-xl">
              Showcase your engineering culture, tech stack, and benefits directly to over 45,000+ vetted developers on DevHire.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="btn btn-neutral bg-white text-primary hover:bg-white/90 border-none rounded-2xl font-black px-6 shadow-md text-xs sm:text-sm"
            >
              List Your Company
            </Link>
            <Link
              to="/jobs"
              className="btn btn-ghost bg-primary-content/15 text-primary-content hover:bg-primary-content/25 rounded-2xl font-bold px-6 text-xs sm:text-sm"
            >
              Explore Open Roles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Companies;
