import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  BriefcaseBusiness,
  X,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { api } from "../services/api";

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string;
}

export interface JobItem {
  _id?: string;
  id?: string | number;
  title: string;
  category?: string;
  company: string;
  location: string;
  workplace?: string;
  type: string;
  salary?: JobSalary | string | null;
  skills?: string[];
  tags?: string[];
  description?: string;
  requirements?: string;
  contactEmail?: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const FALLBACK_JOBS: JobItem[] = [
  { id: 1, title: "Full Stack Developer", company: "Nexora", location: "Remote", workplace: "Remote", type: "Full-time", salary: "$120–155k", tags: ["React", "Node.js"], description: "Building modern scalable full-stack web applications." },
  { id: 2, title: "Backend Developer", company: "Cloudly", location: "Hybrid", workplace: "Hybrid", type: "Full-time", salary: "$130–165k", tags: ["Node.js", "AWS"], description: "Designing cloud infrastructure and high-throughput microservices." },
  { id: 3, title: "Frontend Developer", company: "Shipfast", location: "Remote", workplace: "Remote", type: "Full-time", salary: "$110–145k", tags: ["React", "TypeScript"], description: "Crafting beautiful responsive developer experiences with modern React." },
  { id: 4, title: "MERN Stack Developer", company: "Datawise", location: "Remote", workplace: "Remote", type: "Contract", salary: "$100–140k", tags: ["MongoDB", "Express", "React", "Node"], description: "End-to-end full stack development with the MongoDB and Express stack." },
  { id: 5, title: "Junior Software Developer", company: "FintechCo", location: "On-site", workplace: "On-site", type: "Full-time", salary: "$70–95k", tags: ["JavaScript", "Python"], description: "Working with senior engineers to build financial data visualization tools." },
  { id: 6, title: "Software Developer", company: "Nexora", location: "Hybrid", workplace: "Hybrid", type: "Full-time", salary: "$115–150k", tags: ["TypeScript", "Go"], description: "Backend development with Go and TypeScript microservices." },
  { id: 7, title: "Senior Frontend Developer", company: "Cloudly", location: "Remote", workplace: "Remote", type: "Full-time", salary: "$140–180k", tags: ["React", "Next.js"], description: "Lead frontend engineering on a high-growth cloud SaaS platform." },
  { id: 8, title: "Senior Software Developer", company: "Datawise", location: "Remote", workplace: "Remote", type: "Full-time", salary: "$150–190k", tags: ["System Design", "Python"], description: "Distributed data pipelines and architectural system design." },
  { id: 9, title: "Junior Frontend Developer", company: "Shipfast", location: "Remote", workplace: "Remote", type: "Internship", salary: "$50–70k", tags: ["HTML", "CSS", "React"], description: "Frontend internship focusing on modern React components." },
];

const formatSalary = (salary?: JobSalary | string | null): string => {
  if (!salary) return "Negotiable";
  if (typeof salary === "string") return salary;

  const { min, max, currency = "USD" } = salary;
  if (!min && !max) return "Negotiable";

  const formatK = (val: number) => {
    return val >= 1000 ? `${Math.round(val / 1000)}k` : `${val}`;
  };

  if (min && max) {
    return `$${formatK(min)}–$${formatK(max)} ${currency !== "USD" ? currency : ""}`.trim();
  }
  if (min) return `From $${formatK(min)}`;
  if (max) return `Up to $${formatK(max)}`;
  return "Negotiable";
};

const CATEGORIES = [
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "MERN Stack Developer",
  "Junior Software Developer",
  "Software Developer",
  "Senior Frontend Developer",
  "Senior Software Developer",
  "Junior Frontend Developer",
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "all";

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [workplaceFilter, setWorkplaceFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api<ApiResponse<JobItem[]>>("/jobs");
      if (res.data && res.data.length > 0) {
        setJobs(res.data);
      } else {
        // Fallback to sample jobs if database has no approved jobs yet
        setJobs(FALLBACK_JOBS);
      }
    } catch (err) {
      console.warn("Could not fetch jobs from backend, using default jobs:", err);
      setJobs(FALLBACK_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Sync category filter if searchParams change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setCategoryFilter(cat);
    }
  }, [searchParams]);

  // Aggregate all unique categories from loaded jobs + defaults
  const allCategories = useMemo(() => {
    const set = new Set<string>(CATEGORIES);
    jobs.forEach((j) => {
      if (j.category && j.category.trim()) {
        set.add(j.category.trim());
      }
    });
    return Array.from(set);
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const cat = categoryFilter.trim().toLowerCase();

    return jobs.filter((job) => {
      const titleMatch = (job.title || "").toLowerCase().includes(q);
      const companyMatch = (job.company || "").toLowerCase().includes(q);
      const locationMatch = (job.location || "").toLowerCase().includes(q);
      const tagMatch = (job.skills || job.tags || []).some((t) =>
        t.toLowerCase().includes(q)
      );

      const matchesQuery = !q || titleMatch || companyMatch || locationMatch || tagMatch;

      const jobCategory = (job.category || "").toLowerCase();
      const jobTitle = (job.title || "").toLowerCase();
      const matchesCategory =
        cat === "all" ||
        jobCategory === cat ||
        jobCategory.includes(cat) ||
        jobTitle.includes(cat);

      const workplace = (job.workplace || job.location || "").toLowerCase();
      const matchesWorkplace =
        workplaceFilter === "all" || workplace.includes(workplaceFilter.toLowerCase());

      const jobType = (job.type || "").toLowerCase();
      const matchesType =
        typeFilter === "all" || jobType.includes(typeFilter.toLowerCase());

      return matchesQuery && matchesCategory && matchesWorkplace && matchesType;
    });
  }, [jobs, query, categoryFilter, workplaceFilter, typeFilter]);

  return (
    <div className="mx-auto w-full container px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-primary uppercase">
            Find Jobs
          </p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Developer jobs
          </h1>
          <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-base-content/60">
            {loading
              ? "Searching for open opportunities..."
              : `${filtered.length} open roles across top engineering teams.`}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto shrink-0">
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="btn btn-outline btn-xs sm:btn-sm rounded-full font-bold gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            to="/register"
            className="btn btn-primary btn-xs sm:btn-sm rounded-full px-4 sm:px-5 font-bold"
          >
            Post a job
          </Link>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="mt-6 flex flex-col lg:flex-row items-stretch gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
          <input
            value={query}
            onChange={(e) => {
              setSearchParams(
                e.target.value.trim() ? { q: e.target.value } : {},
                { replace: true }
              );
            }}
            placeholder="Search by title, company, skills, or location…"
            className="input input-bordered w-full rounded-full pl-11 pr-10 text-xs sm:text-sm h-10 sm:h-11"
          />
          {query && (
            <button
              onClick={() => setSearchParams({}, { replace: true })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="select select-bordered select-sm sm:select-md rounded-full text-xs font-semibold px-4 w-full h-10 sm:h-11"
          >
            <option value="all">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Workplace Dropdown */}
          <select
            value={workplaceFilter}
            onChange={(e) => setWorkplaceFilter(e.target.value)}
            className="select select-bordered select-sm sm:select-md rounded-full text-xs font-semibold px-4 w-full h-10 sm:h-11"
          >
            <option value="all">All Workplaces</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>

          {/* Job Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="select select-bordered select-sm sm:select-md rounded-full text-xs font-semibold px-4 w-full h-10 sm:h-11"
          >
            <option value="all">All Job Types</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Category Pills Quick Filter Bar */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`btn btn-xs rounded-full font-bold px-3.5 transition-all shrink-0 ${
            categoryFilter === "all"
              ? "btn-primary shadow-sm"
              : "btn-ghost border border-base-300 text-base-content/70 hover:text-base-content"
          }`}
        >
          All ({jobs.length})
        </button>

        {allCategories.map((cat) => {
          const isSelected = categoryFilter.toLowerCase() === cat.toLowerCase();
          const count = jobs.filter(
            (j) =>
              (j.category && j.category.toLowerCase() === cat.toLowerCase()) ||
              (j.title && j.title.toLowerCase().includes(cat.toLowerCase()))
          ).length;

          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(isSelected ? "all" : cat)}
              className={`btn btn-xs rounded-full font-semibold px-3 transition-all shrink-0 ${
                isSelected
                  ? "btn-primary shadow-sm font-bold"
                  : "btn-ghost border border-base-300 text-base-content/70 hover:text-base-content"
              }`}
            >
              {cat}
              {count > 0 && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-primary-content/20 text-primary-content font-bold"
                      : "bg-base-200 text-base-content/70"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-base-300/70 bg-base-100 p-6 animate-pulse space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-base-300 rounded w-3/4"></div>
                  <div className="h-3 bg-base-300 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-20 bg-base-300 rounded-full"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-base-300 rounded-lg"></div>
                <div className="h-6 w-16 bg-base-300 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Jobs List */
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {filtered.map((job, index) => {
            const salaryText = typeof job.salary === "string" ? job.salary : formatSalary(job.salary);
            const skillsList = job.skills || job.tags || [];

            return (
              <article
                key={job._id || job.id || index}
                className="rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="flex-1 min-w-0">
                      <h2
                        onClick={() => setSelectedJob(job)}
                        className="text-base font-bold hover:text-primary transition-colors cursor-pointer break-words"
                      >
                        {job.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-base-content/60 flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-base-content/80 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {job.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location} {job.workplace && `(${job.workplace})`}
                        </span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </p>
                    </div>

                    <span className="badge badge-success badge-soft font-bold whitespace-nowrap text-xs py-2 px-3 self-start">
                      {salaryText}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {skillsList.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-ghost text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between pt-3.5 border-t border-base-200 gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      to="/register"
                      className="btn btn-primary btn-xs sm:btn-sm rounded-full px-4 sm:px-5 font-bold flex-1 sm:flex-initial text-center"
                    >
                      Apply now
                    </Link>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="btn btn-ghost btn-xs sm:btn-sm rounded-full border border-base-300 px-3 sm:px-4 font-bold flex-1 sm:flex-initial text-center"
                    >
                      View details
                    </button>
                  </div>

                  <Link
                    to="/companies"
                    className="text-xs text-base-content/60 hover:text-primary font-semibold flex items-center justify-end gap-1 shrink-0 self-end sm:self-auto"
                  >
                    View company <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Empty Search Result */}
      {!loading && filtered.length === 0 && (
        <div className="mt-12 text-center py-16 rounded-3xl border border-dashed border-base-300 p-8 max-w-md mx-auto">
          <BriefcaseBusiness className="w-10 h-10 mx-auto text-base-content/30 mb-3" />
          <h3 className="font-bold text-base">No matching developer jobs</h3>
          <p className="mt-1 text-sm text-base-content/60">
            {query
              ? `No jobs match “${query}”. Try adjusting your keywords or filters.`
              : "No jobs are currently available matching your selected filters."}
          </p>
          {(query || categoryFilter !== "all" || workplaceFilter !== "all" || typeFilter !== "all") && (
            <button
              onClick={() => {
                setSearchParams({}, { replace: true });
                setCategoryFilter("all");
                setWorkplaceFilter("all");
                setTypeFilter("all");
              }}
              className="btn btn-outline btn-sm rounded-full mt-4 font-bold"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-base-200 flex items-start justify-between gap-3 sm:gap-4">
              <div>
                <span className="badge badge-primary badge-sm font-semibold mb-1.5">
                  {selectedJob.category || selectedJob.type}
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold break-words">
                  {selectedJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1.5 text-xs text-base-content/70">
                  <span className="font-semibold text-base-content flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {selectedJob.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {selectedJob.location} {selectedJob.workplace && `(${selectedJob.workplace})`}
                  </span>
                  <span>•</span>
                  <span>{selectedJob.type}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost btn-sm btn-circle shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Salary Range
                  </span>
                  <span className="font-bold text-xs mt-0.5 block text-success">
                    {typeof selectedJob.salary === "string" ? selectedJob.salary : formatSalary(selectedJob.salary)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Workplace
                  </span>
                  <span className="font-semibold text-xs mt-0.5 block">
                    {selectedJob.workplace || selectedJob.location}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Job Type
                  </span>
                  <span className="font-semibold text-xs mt-0.5 block">
                    {selectedJob.type}
                  </span>
                </div>
              </div>

              {/* Skills */}
              {(selectedJob.skills || selectedJob.tags) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Required Skills & Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedJob.skills || selectedJob.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="badge badge-primary badge-soft text-xs font-semibold py-1.5 sm:py-2 px-2.5 sm:px-3"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedJob.description && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Role Description
                  </h4>
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-base-content/80 bg-base-200/30 p-3.5 sm:p-4 rounded-2xl border border-base-200">
                    {selectedJob.description}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Requirements & Qualifications
                  </h4>
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-base-content/80 bg-base-200/30 p-3.5 sm:p-4 rounded-2xl border border-base-200">
                    {selectedJob.requirements}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost btn-sm rounded-full font-bold w-full sm:w-auto text-center"
              >
                Close
              </button>
              <Link
                to="/register"
                className="btn btn-primary btn-sm rounded-full px-6 font-bold w-full sm:w-auto text-center"
              >
                Apply now
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
