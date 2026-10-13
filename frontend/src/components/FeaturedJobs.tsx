import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";
import Reveal from "./Reveal";

const jobs = [
  {
    id: 1,
    role: "Senior Frontend Engineer",
    company: "Nexora",
    initial: "N",
    location: "Remote",
    salary: "$140k–180k",
    type: "Full-time",
    tags: ["React", "TypeScript", "Next.js"],
    color: "bg-violet-100 text-violet-700",
  },
  {
    id: 2,
    role: "Backend Developer",
    company: "Cloudly",
    initial: "C",
    location: "Hybrid",
    salary: "$90k–130k",
    type: "Full-time",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    role: "MERN Stack Developer",
    company: "StackLab",
    initial: "S",
    location: "Remote",
    salary: "$75k–110k",
    type: "Full-time",
    tags: ["MongoDB", "Express", "React"],
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 4,
    role: "Junior Software Developer",
    company: "Datawise",
    initial: "D",
    location: "On-site",
    salary: "$45k–65k",
    type: "Entry-level",
    tags: ["JavaScript", "Git", "REST API"],
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: 5,
    role: "Full Stack Developer",
    company: "FintechCo",
    initial: "F",
    location: "Hybrid",
    salary: "$100k–145k",
    type: "Full-time",
    tags: ["React", "Node.js", "SQL"],
    color: "bg-pink-100 text-pink-700",
  },
  {
    id: 6,
    role: "Frontend Developer",
    company: "PixelWorks",
    initial: "P",
    location: "Remote",
    salary: "$80k–120k",
    type: "Contract",
    tags: ["HTML", "CSS", "React"],
    color: "bg-cyan-100 text-cyan-700",
  },
];

interface Job {
  id: number;
  role: string;
  company: string;
  initial: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  color: string;
}

function JobCard({ job }: { job: Job }) {
  return (
    <article className="group rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${job.color} dark:bg-primary/20 dark:text-primary`}
        >
          {job.initial}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold leading-6 text-base-content transition group-hover:text-primary">
            {job.role}
          </h3>
          <p className="mt-1 text-sm text-base-content/60">{job.company}</p>
        </div>

        <a
          href={`/jobs/${job.id}`}
          aria-label={`View ${job.role}`}
          className="rounded-lg border border-base-300 p-2 text-base-content/50 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
        >
          <ArrowUpRight size={17} />
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {job.tags.map((tag: string) => (
          <span
            key={tag}
            className="rounded-lg bg-base-200 px-2.5 py-1.5 text-xs font-medium text-base-content/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-base-content/60">
        <span className="flex items-center gap-1.5">
          <MapPin size={14} />{job.location}
        </span>

        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness size={14} />{job.type}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-base-300/50 pt-4">
        <div>
          <p className="font-extrabold text-base-content">{job.salary}</p>
          <p className="mt-1 text-xs text-base-content/50">Salary range</p>
        </div>

        <a
          href={`/jobs/${job.id}`}
          className="btn btn-primary btn-sm rounded-lg px-4 text-xs font-bold"
        >
          View details
        </a>
      </div>
    </article>
  );
}

export default function FeaturedJobs() {
  return (
    <section className="bg-base-200/40 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto container">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
              HANDPICKED OPPORTUNITIES
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-base-content sm:text-4xl">
              Featured <span className="text-primary">jobs</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
              Explore developer opportunities that match your skills
              and career goals.
            </p>
          </div>

          <a
            href="/jobs"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-primary hover:text-primary/80 sm:self-auto"
          >
            View all jobs <ArrowUpRight size={17} />
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, index) => (
            <Reveal key={job.id} delay={index * 100} direction="up">
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
