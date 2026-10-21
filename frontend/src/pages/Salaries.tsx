import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {

  TrendingUp,
  Briefcase,
  Search,

  Sparkles,
  ArrowUpRight,
  BarChart3,
  Calculator,

  Globe,
  Award,

  LayoutGrid,
  Table as TableIcon,
  Flame,

  Zap,
} from "lucide-react";

interface SalaryData {
  role: string;
  category: "Frontend" | "Backend" | "Full Stack" | "DevOps & Cloud" | "Mobile & AI";
  experience: "Junior" | "Mid" | "Senior" | "Lead";
  minSalary: number;
  avgSalary: number;
  maxSalary: number;
  demand: "Very High" | "High" | "Moderate";
  growth: string;
  topSkills: string[];
  openJobsCount: number;
}

const SALARY_BENCHMARKS: SalaryData[] = [
  {
    role: "Senior Software Architect",
    category: "Full Stack",
    experience: "Lead",
    minSalary: 160000,
    avgSalary: 188000,
    maxSalary: 230000,
    demand: "Very High",
    growth: "+14.8%",
    topSkills: ["System Design", "Microservices", "Kubernetes", "AWS"],
    openJobsCount: 142,
  },
  {
    role: "Senior Frontend Engineer",
    category: "Frontend",
    experience: "Senior",
    minSalary: 140000,
    avgSalary: 165000,
    maxSalary: 195000,
    demand: "Very High",
    growth: "+11.2%",
    topSkills: ["React 19", "TypeScript", "Next.js", "Performance"],
    openJobsCount: 285,
  },
  {
    role: "Senior Backend Engineer (Go / Node)",
    category: "Backend",
    experience: "Senior",
    minSalary: 145000,
    avgSalary: 172000,
    maxSalary: 205000,
    demand: "Very High",
    growth: "+13.5%",
    topSkills: ["Go", "Node.js", "PostgreSQL", "Kafka", "Docker"],
    openJobsCount: 310,
  },
  {
    role: "Full Stack Developer",
    category: "Full Stack",
    experience: "Mid",
    minSalary: 115000,
    avgSalary: 138000,
    maxSalary: 162000,
    demand: "Very High",
    growth: "+9.6%",
    topSkills: ["React", "Node.js", "TypeScript", "Tailwind CSS"],
    openJobsCount: 420,
  },
  {
    role: "DevOps & Cloud Infrastructure Engineer",
    category: "DevOps & Cloud",
    experience: "Senior",
    minSalary: 135000,
    avgSalary: 168000,
    maxSalary: 198000,
    demand: "Very High",
    growth: "+15.2%",
    topSkills: ["Terraform", "Kubernetes", "AWS", "CI/CD", "Monitoring"],
    openJobsCount: 195,
  },
  {
    role: "Frontend Developer (React / Next.js)",
    category: "Frontend",
    experience: "Mid",
    minSalary: 105000,
    avgSalary: 128000,
    maxSalary: 150000,
    demand: "High",
    growth: "+8.4%",
    topSkills: ["React", "JavaScript", "CSS/DaisyUI", "REST APIs"],
    openJobsCount: 340,
  },
  {
    role: "Backend Developer (Python & FastAPI)",
    category: "Backend",
    experience: "Mid",
    minSalary: 112000,
    avgSalary: 136000,
    maxSalary: 158000,
    demand: "High",
    growth: "+10.1%",
    topSkills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    openJobsCount: 220,
  },
  {
    role: "AI / LLM Integration Engineer",
    category: "Mobile & AI",
    experience: "Senior",
    minSalary: 155000,
    avgSalary: 185000,
    maxSalary: 225000,
    demand: "Very High",
    growth: "+28.4%",
    topSkills: ["LangChain", "Python", "Vector DBs", "OpenAI APIs"],
    openJobsCount: 165,
  },
  {
    role: "MERN Stack Engineer",
    category: "Full Stack",
    experience: "Mid",
    minSalary: 95000,
    avgSalary: 122000,
    maxSalary: 145000,
    demand: "High",
    growth: "+7.8%",
    topSkills: ["MongoDB", "Express", "React", "Node.js"],
    openJobsCount: 290,
  },
  {
    role: "Junior Software Developer",
    category: "Full Stack",
    experience: "Junior",
    minSalary: 72000,
    avgSalary: 84000,
    maxSalary: 98000,
    demand: "Moderate",
    growth: "+5.2%",
    topSkills: ["JavaScript", "TypeScript", "Git", "HTML/CSS"],
    openJobsCount: 180,
  },
  {
    role: "Junior Frontend Developer",
    category: "Frontend",
    experience: "Junior",
    minSalary: 55000,
    avgSalary: 68000,
    maxSalary: 82000,
    demand: "Moderate",
    growth: "+4.9%",
    topSkills: ["React", "JavaScript", "Tailwind CSS", "GitHub"],
    openJobsCount: 145,
  },
  {
    role: "Mobile App Developer (React Native / Flutter)",
    category: "Mobile & AI",
    experience: "Mid",
    minSalary: 110000,
    avgSalary: 134000,
    maxSalary: 160000,
    demand: "High",
    growth: "+8.9%",
    topSkills: ["React Native", "TypeScript", "iOS/Android", "Redux"],
    openJobsCount: 130,
  },
];

const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Full Stack",
  "DevOps & Cloud",
  "Mobile & AI",
];

const Salaries = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExperience, setSelectedExperience] = useState("All");
  const [sortBy, setSortBy] = useState<"avg-desc" | "avg-asc" | "demand" | "growth">("avg-desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Interactive Calculator State
  const [calcRole, setCalcRole] = useState("Frontend");
  const [calcExp, setCalcExp] = useState("Mid");
  const [calcLocation, setCalcLocation] = useState("Remote");

  const calculatedEstimate = useMemo(() => {
    let base = 120000;
    if (calcRole === "Backend") base = 132000;
    if (calcRole === "Full Stack") base = 128000;
    if (calcRole === "DevOps") base = 142000;
    if (calcRole === "AI") base = 160000;

    let multiplier = 1;
    if (calcExp === "Junior") multiplier = 0.65;
    if (calcExp === "Mid") multiplier = 1.0;
    if (calcExp === "Senior") multiplier = 1.35;
    if (calcExp === "Lead") multiplier = 1.6;

    let locationAdjustment = 1;
    if (calcLocation === "US-SanFrancisco") locationAdjustment = 1.25;
    if (calcLocation === "US-NewYork") locationAdjustment = 1.2;
    if (calcLocation === "Remote") locationAdjustment = 1.05;
    if (calcLocation === "Europe") locationAdjustment = 0.85;

    const median = Math.round((base * multiplier * locationAdjustment) / 1000) * 1000;
    const min = Math.round(median * 0.84);
    const max = Math.round(median * 1.22);

    return { min, median, max };
  }, [calcRole, calcExp, calcLocation]);

  const filteredSalaries = useMemo(() => {
    return SALARY_BENCHMARKS.filter((item) => {
      const matchSearch =
        item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.topSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchExp =
        selectedExperience === "All" || item.experience === selectedExperience;
      return matchSearch && matchCat && matchExp;
    }).sort((a, b) => {
      if (sortBy === "avg-desc") return b.avgSalary - a.avgSalary;
      if (sortBy === "avg-asc") return a.avgSalary - b.avgSalary;
      if (sortBy === "growth")
        return parseFloat(b.growth) - parseFloat(a.growth);
      if (sortBy === "demand") {
        const score = (d: string) =>
          d === "Very High" ? 3 : d === "High" ? 2 : 1;
        return score(b.demand) - score(a.demand);
      }
      return 0;
    });
  }, [searchTerm, selectedCategory, selectedExperience, sortBy]);

  const formatCurrency = (val: number) => {
    return `$${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-base-200/30 ">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden border-b border-base-300 bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-16 sm:py-20">
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-black tracking-wide uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            2026 Developer Compensation Index
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-base-content max-w-3xl mx-auto leading-tight">
            Know Your Worth. Explore Verified{" "}
            <span className="text-primary bg-clip-text">Tech Salaries</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-base-content/70 leading-relaxed">
            Real compensation bands analyzed from over <strong>2,450+ verified engineering offers</strong>, vetted tech companies, and remote-first startups on DevHire.
          </p>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6">
            <div className="p-4 rounded-3xl border border-base-300 bg-base-100 shadow-sm text-left">
              <p className="text-xs font-bold text-base-content/60 uppercase">
                Median Developer Pay
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-base-content">$142,500</span>
                <span className="text-xs font-bold text-success flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" /> +8.4%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-3xl border border-primary/20 bg-primary/5 shadow-sm text-left">
              <p className="text-xs font-bold text-primary uppercase">
                Highest Paying Stack
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-primary">$188,000</span>
                <span className="text-xs font-semibold text-base-content/60">Cloud/Go</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl border border-accent/20 bg-accent/5 shadow-sm text-left">
              <p className="text-xs font-bold text-accent uppercase">
                Remote Premium
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-accent">+14.2%</span>
                <span className="text-xs font-semibold text-base-content/60">Global</span>
              </div>
            </div>

            <div className="p-4 rounded-3xl border border-base-300 bg-base-100 shadow-sm text-left">
              <p className="text-xs font-bold text-base-content/60 uppercase">
                Active Tech Openings
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-base-content">2,450+</span>
                <span className="text-xs font-semibold text-primary">Hiring</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto w-full container px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Interactive Salary Calculator Widget */}
        <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/5 via-base-100 to-base-100 p-6 sm:p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-base-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-base-content">
                  Interactive Salary Estimator
                </h3>
                <p className="text-xs text-base-content/60">
                  Select your engineering track and experience to calculate tailored market expectations.
                </p>
              </div>
            </div>

            <div className="badge badge-primary badge-soft font-bold text-xs px-3 py-2">
              Updated for Q4 2026
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div>
              <label className="text-xs font-bold text-base-content/75">
                Specialization Track
              </label>
              <select
                value={calcRole}
                onChange={(e) => setCalcRole(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl mt-1 font-bold text-xs sm:text-sm"
              >
                <option value="Frontend">Frontend (React, TypeScript)</option>
                <option value="Backend">Backend (Node, Go, Python)</option>
                <option value="Full Stack">Full Stack (MERN, Next.js)</option>
                <option value="DevOps">DevOps & Cloud (AWS, K8s)</option>
                <option value="AI">AI & Machine Learning</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-base-content/75">
                Seniority Level
              </label>
              <select
                value={calcExp}
                onChange={(e) => setCalcExp(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl mt-1 font-bold text-xs sm:text-sm"
              >
                <option value="Junior">Junior (0–2 years)</option>
                <option value="Mid">Mid-Level (2–5 years)</option>
                <option value="Senior">Senior (5–8 years)</option>
                <option value="Lead">Lead / Architect (8+ years)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-base-content/75">
                Work Location Model
              </label>
              <select
                value={calcLocation}
                onChange={(e) => setCalcLocation(e.target.value)}
                className="select select-sm select-bordered w-full rounded-xl mt-1 font-bold text-xs sm:text-sm"
              >
                <option value="Remote">Worldwide Remote</option>
                <option value="US-SanFrancisco">US – San Francisco / Bay Area</option>
                <option value="US-NewYork">US – New York Metro</option>
                <option value="Europe">Europe / UK Tech Hubs</option>
              </select>
            </div>
          </div>

          {/* Calculator Output Display */}
          <div className="mt-6 p-5 rounded-2xl bg-base-200/50 border border-base-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-base-content/60">
                Estimated Compensation Range
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-primary">
                  ${(calculatedEstimate.median).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-base-content/60">
                  / year (Avg)
                </span>
              </div>
              <p className="text-xs text-base-content/65 mt-0.5">
                Expected band: ${(calculatedEstimate.min).toLocaleString()} – ${(calculatedEstimate.max).toLocaleString()}
              </p>
            </div>

            <Link
              to="/jobs"
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 px-6 shadow-sm w-full sm:w-auto"
            >
              <Briefcase className="w-4 h-4" />
              Find Matching Jobs
            </Link>
          </div>
        </div>

        {/* Search, Filter & Controls Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search roles, frameworks, or skills (e.g. React, Go, Senior)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm w-full pl-9 rounded-xl bg-base-100 border-base-300 text-xs sm:text-sm font-medium focus:border-primary focus:outline-none"
              />
            </div>

            {/* Seniority & Sorting Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="select select-sm rounded-xl bg-base-100 border-base-300 text-xs font-bold"
              >
                <option value="All">All Seniorities</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead / Staff</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="select select-sm rounded-xl bg-base-100 border-base-300 text-xs font-bold"
              >
                <option value="avg-desc">Highest Pay First</option>
                <option value="avg-asc">Lowest Pay First</option>
                <option value="growth">Fastest Growth</option>
                <option value="demand">Highest Demand</option>
              </select>

              {/* View Mode Toggle */}
              <div className="join border border-base-300 rounded-xl overflow-hidden bg-base-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`join-item btn btn-xs border-none ${viewMode === "grid" ? "btn-primary" : "btn-ghost"
                    }`}
                  title="Grid Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`join-item btn btn-xs border-none ${viewMode === "table" ? "btn-primary" : "btn-ghost"
                    }`}
                  title="Table View"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-xs rounded-xl font-bold whitespace-nowrap transition-colors ${selectedCategory === cat
                  ? "btn-primary shadow-xs"
                  : "btn-ghost bg-base-100 border border-base-300 hover:border-base-content/20"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-base-content/60 font-semibold px-1">
          <span>
            Showing <strong>{filteredSalaries.length}</strong> verified role benchmarks
          </span>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedExperience("All");
              }}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Benchmarks Listing View */}
        {filteredSalaries.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100">
            <BarChart3 className="w-10 h-10 text-base-content/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-base-content">
              No salary records match your filter
            </h3>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
              Try adjusting your search keywords or switching category filters.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          /* Cards Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSalaries.map((item) => (
              <div
                key={item.role}
                className="group rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="badge badge-sm badge-ghost font-semibold text-[11px]">
                      {item.category}
                    </span>
                    <span
                      className={`badge badge-sm badge-soft font-bold text-[11px] gap-1 ${item.demand === "Very High"
                        ? "badge-error text-error"
                        : item.demand === "High"
                          ? "badge-warning text-warning"
                          : "badge-ghost"
                        }`}
                    >
                      <Flame className="w-3 h-3" />
                      {item.demand}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-base-content mt-2 group-hover:text-primary transition-colors">
                    {item.role}
                  </h3>

                  {/* Salary Display */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-base-200/50 border border-base-200">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black text-primary">
                        {formatCurrency(item.avgSalary)}
                      </span>
                      <span className="text-xs font-bold text-success flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" />
                        {item.growth}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-base-content/60 mt-1">
                      <span>Range:</span>
                      <span className="font-semibold text-base-content/80">
                        {formatCurrency(item.minSalary)} – {formatCurrency(item.maxSalary)}
                      </span>
                    </div>

                    {/* Visual Salary Bar */}
                    <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden mt-2.5">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (item.avgSalary / 230000) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Top Skills Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                    {item.topSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-base-200 text-[11px] font-semibold text-base-content/75"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-base-200 text-xs">
                  <span className="text-base-content/60 font-medium">
                    <strong>{item.openJobsCount}</strong> open roles
                  </span>
                  <Link
                    to="/jobs"
                    className="btn btn-xs btn-primary rounded-xl font-bold gap-1 px-3"
                  >
                    Browse <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto rounded-3xl border border-base-300 bg-base-100 shadow-sm">
            <table className="table w-full">
              <thead>
                <tr className="text-xs uppercase bg-base-200/40 text-base-content/70">
                  <th className="py-4 pl-6">Role & Track</th>
                  <th>Seniority</th>
                  <th>Average Pay</th>
                  <th>Compensation Range</th>
                  <th>Demand</th>
                  <th>YoY Growth</th>
                  <th className="text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-xs sm:text-sm">
                {filteredSalaries.map((row) => (
                  <tr key={row.role} className="hover:bg-base-200/40 transition-colors">
                    <td className="py-4 pl-6 font-bold text-base-content">
                      <div>
                        <span>{row.role}</span>
                        <div className="flex gap-1 mt-1">
                          {row.topSkills.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="badge badge-xs badge-ghost text-[10px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-sm badge-ghost font-semibold">
                        {row.experience}
                      </span>
                    </td>
                    <td className="font-extrabold text-primary text-base">
                      {formatCurrency(row.avgSalary)}
                    </td>
                    <td className="text-base-content/70 font-medium">
                      {formatCurrency(row.minSalary)} – {formatCurrency(row.maxSalary)}
                    </td>
                    <td>
                      <span
                        className={`badge badge-sm badge-soft font-bold text-xs ${row.demand === "Very High"
                          ? "badge-error text-error"
                          : row.demand === "High"
                            ? "badge-warning text-warning"
                            : "badge-ghost"
                          }`}
                      >
                        {row.demand}
                      </span>
                    </td>
                    <td className="font-bold text-success">{row.growth}</td>
                    <td className="text-right pr-6">
                      <Link
                        to="/jobs"
                        className="btn btn-xs btn-primary rounded-xl font-bold gap-1"
                      >
                        View Jobs <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Industry Trends & Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-6 rounded-3xl border border-base-300 bg-base-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-base-content">
              Global Remote Parity
            </h4>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Leading US and European startups are increasingly offering US-level remote benchmarks to attract elite international software talent.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-base-300 bg-base-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-2">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-base-content">
              AI Engineer Surge
            </h4>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Engineers proficient in LLM architectures, vector databases, and Python microservices command a 28%+ premium over traditional stack roles.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-base-300 bg-base-100 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-2">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-base-content">
              Total Rewards Packages
            </h4>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Base salary accounts for ~78% of developer compensation; equity grants, wellness stipends, and bonuses make up the remainder.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 sm:p-10 text-primary-content shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to claim your true market value?
            </h3>
            <p className="text-xs sm:text-sm text-primary-content/85 max-w-xl">
              Create your DevHire candidate profile to get matched directly with hiring managers offering transparent salary ranges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="btn btn-neutral bg-white text-primary hover:bg-white/90 border-none rounded-2xl font-black px-6 shadow-md"
            >
              Create Free Profile
            </Link>
            <Link
              to="/jobs"
              className="btn btn-ghost bg-primary-content/15 text-primary-content hover:bg-primary-content/25 rounded-2xl font-bold px-6"
            >
              Browse Openings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salaries;
