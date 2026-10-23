import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  MapPin,
  Building2,
  X,
} from "lucide-react";
import Reveal from "./Reveal";
import { api } from "../services/api";
import ApplyJobModal from "./ApplyJobModal";
import type { JobItem as BaseJobItem } from "../pages/Jobs";

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string;
}

export interface JobItem {
  _id?: string;
  id?: string | number;
  title?: string;
  role?: string;
  category?: string;
  company: string;
  initial?: string;
  location: string;
  workplace?: string;
  type: string;
  salary?: JobSalary | string | null;
  skills?: string[];
  tags?: string[];
  description?: string;
  requirements?: string;
  contactEmail?: string;
  deadline?: string | null;
  color?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const FALLBACK_JOBS: JobItem[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    role: "Senior Frontend Engineer",
    company: "Nexora",
    initial: "N",
    location: "Remote",
    salary: "$140k–180k",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    color: "bg-violet-100 text-violet-700",
    description: "Build robust frontend web apps using React and Next.js.",
  },
  {
    id: 2,
    title: "Backend Developer",
    role: "Backend Developer",
    company: "Cloudly",
    initial: "C",
    location: "Hybrid",
    salary: "$90k–130k",
    type: "Full-time",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    color: "bg-blue-100 text-blue-700",
    description: "Design and implement scalable REST APIs and microservices.",
  },
  {
    id: 3,
    title: "MERN Stack Developer",
    role: "MERN Stack Developer",
    company: "StackLab",
    initial: "S",
    location: "Remote",
    salary: "$75k–110k",
    type: "Full-time",
    tags: ["MongoDB", "Express", "React"],
    color: "bg-emerald-100 text-emerald-700",
    description: "End-to-end full-stack development with MERN stack.",
  },
  {
    id: 4,
    title: "Junior Software Developer",
    role: "Junior Software Developer",
    company: "Datawise",
    initial: "D",
    location: "On-site",
    salary: "$45k–65k",
    type: "Entry-level",
    tags: ["JavaScript", "Git", "REST API"],
    color: "bg-amber-100 text-amber-700",
    description: "Join an agile team to build and maintain developer tools.",
  },
  {
    id: 5,
    title: "Full Stack Developer",
    role: "Full Stack Developer",
    company: "FintechCo",
    initial: "F",
    location: "Hybrid",
    salary: "$100k–145k",
    type: "Full-time",
    tags: ["React", "Node.js", "SQL"],
    color: "bg-pink-100 text-pink-700",
    description: "Develop cutting-edge financial applications and dashboards.",
  },
  {
    id: 6,
    title: "Frontend Developer",
    role: "Frontend Developer",
    company: "PixelWorks",
    initial: "P",
    location: "Remote",
    salary: "$80k–120k",
    type: "Contract",
    tags: ["HTML", "CSS", "React"],
    color: "bg-cyan-100 text-cyan-700",
    description: "Pixel-perfect UI design implementation with responsive components.",
  },
];

const COLOR_CLASSES = [
  "bg-violet-100 text-violet-700",
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

const formatSalaryString = (
  salary?: JobSalary | string | null
): string => {
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

export default function FeaturedJobs() {
  const [featuredJobs, setFeaturedJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [applyingJob, setApplyingJob] = useState<BaseJobItem | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api<ApiResponse<JobItem[]>>("/jobs");
        if (res.data && res.data.length > 0) {
          // Take exactly 6 jobs
          const normalized = res.data.slice(0, 6).map((job, index) => {
            const roleTitle = job.title || job.role || "Software Developer";
            const companyName = job.company || "Tech Company";
            const initial = companyName[0]?.toUpperCase() || "J";
            const tags = (job.skills && job.skills.length > 0)
              ? job.skills
              : (job.tags || ["Developer"]);

            return {
              ...job,
              id: job._id || job.id || index + 1,
              title: roleTitle,
              role: roleTitle,
              company: companyName,
              initial,
              color: COLOR_CLASSES[index % COLOR_CLASSES.length],
              salary: formatSalaryString(job.salary),
              tags,
            };
          });
          setFeaturedJobs(normalized);
        } else {
          setFeaturedJobs(FALLBACK_JOBS);
        }
      } catch (err) {
        console.warn("Could not fetch jobs from backend, using fallback data:", err);
        setFeaturedJobs(FALLBACK_JOBS);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="bg-base-200/40 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto container px-4 sm:px-0">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
              HANDPICKED OPPORTUNITIES
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
              Featured <span className="text-primary">jobs</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
              Explore developer opportunities that match your skills and career goals.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary hover:text-primary/80 sm:self-auto"
          >
            View all jobs <ArrowUpRight size={17} />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-base-300/70 bg-base-100 p-6 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-base-300"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-base-300 rounded w-3/4"></div>
                    <div className="h-3 bg-base-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-base-300 rounded-lg"></div>
                  <div className="h-6 w-16 bg-base-300 rounded-lg"></div>
                </div>
                <div className="h-8 bg-base-300 rounded-xl mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Jobs Grid (Max 6 Items) */
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job, index) => {
              const salaryStr = typeof job.salary === "string" ? job.salary : formatSalaryString(job.salary);

              return (
                <Reveal key={job.id || index} delay={index * 100} direction="up">
                  <article className="group rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-6 flex flex-col justify-between h-full">
                    <div>
                      {/* Top Bar: Initial + Title + Open Details */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${job.color || "bg-primary/10 text-primary"
                            } dark:bg-primary/20 dark:text-primary`}
                        >
                          {job.initial || (job.company ? job.company[0].toUpperCase() : "J")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3
                            onClick={() => setSelectedJob(job)}
                            className="font-bold leading-6 text-base-content transition group-hover:text-primary cursor-pointer line-clamp-1"
                          >
                            {job.role || job.title}
                          </h3>
                          <p className="mt-1 text-sm text-base-content/60">
                            {job.company}
                          </p>
                        </div>

                        <button
                          onClick={() => setSelectedJob(job)}
                          aria-label={`View ${job.role || job.title}`}
                          className="rounded-lg border border-base-300 p-2 text-base-content/50 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                        >
                          <ArrowUpRight size={17} />
                        </button>
                      </div>

                      {/* Tags */}
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {(job.tags || job.skills || []).slice(0, 4).map((tag: string) => (
                          <span
                            key={tag}
                            className="rounded-lg bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Location & Type */}
                      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-base-content/60">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {job.location}
                          {job.workplace && ` (${job.workplace})`}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <BriefcaseBusiness size={14} />
                          {job.type}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Salary & Button */}
                    <div className="mt-6 flex items-center justify-between border-t border-base-300/50 pt-4">
                      <div>
                        <p className="font-extrabold text-base-content">{salaryStr}</p>
                        <p className="mt-0.5 text-xs text-base-content/50">Salary range</p>
                      </div>

                      <button
                        onClick={() => setSelectedJob(job)}
                        className="btn btn-primary btn-sm rounded-xl px-4 text-xs font-bold"
                      >
                        View details
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {/* JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-base-100 border border-base-300 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-base-200 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${selectedJob.color || "bg-primary/10 text-primary"
                    }`}
                >
                  {selectedJob.initial || (selectedJob.company ? selectedJob.company[0].toUpperCase() : "J")}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold">
                    {selectedJob.role || selectedJob.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-base-content/70">
                    <span className="font-bold text-base-content flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {selectedJob.company}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedJob.location}
                    </span>
                    <span>•</span>
                    <span>{selectedJob.type}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="btn btn-ghost btn-sm btn-circle shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-base-200/50 border border-base-200">
                <div>
                  <span className="text-[11px] font-semibold text-base-content/60 uppercase block">
                    Compensation
                  </span>
                  <span className="font-bold text-xs mt-0.5 block text-success">
                    {typeof selectedJob.salary === "string"
                      ? selectedJob.salary
                      : formatSalaryString(selectedJob.salary)}
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
              {(selectedJob.tags || selectedJob.skills) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedJob.tags || selectedJob.skills || []).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="badge badge-primary badge-soft text-xs font-semibold py-2 px-3"
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
                    Job Overview
                  </h4>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-base-content/80 bg-base-200/30 p-4 rounded-2xl border border-base-200">
                    {selectedJob.description}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/70 mb-2">
                    Requirements
                  </h4>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-base-content/80 bg-base-200/30 p-4 rounded-2xl border border-base-200">
                    {selectedJob.requirements}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-base-200 bg-base-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Link
                to={`/jobs?q=${encodeURIComponent(selectedJob.role || selectedJob.title || "")}`}
                className="btn btn-ghost btn-sm rounded-xl font-bold gap-1 text-xs justify-center"
              >
                Find similar roles <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedJob;
                    if (target) {
                      setSelectedJob(null);
                      setApplyingJob({
                        ...target,
                        title: target.title || target.role || "Developer",
                      });
                    }
                  }}
                  className="btn btn-primary btn-sm rounded-xl px-5 font-bold w-full sm:w-auto text-center"
                >
                  Apply now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLY JOB MODAL */}
      <ApplyJobModal
        job={applyingJob}
        isOpen={!!applyingJob}
        onClose={() => setApplyingJob(null)}
      />
    </section>
  );
}
