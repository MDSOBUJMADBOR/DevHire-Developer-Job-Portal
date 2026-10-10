import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

const JOBS = [
  { id: 1, title: "Full Stack Developer", company: "Nexora", location: "Remote", type: "Full-time", salary: "$120–155k", tags: ["React", "Node.js"] },
  { id: 2, title: "Backend Developer", company: "Cloudly", location: "Hybrid", type: "Full-time", salary: "$130–165k", tags: ["Node.js", "AWS"] },
  { id: 3, title: "Frontend Developer", company: "Shipfast", location: "Remote", type: "Full-time", salary: "$110–145k", tags: ["React", "TypeScript"] },
  { id: 4, title: "MERN Stack Developer", company: "Datawise", location: "Remote", type: "Contract", salary: "$100–140k", tags: ["MongoDB", "Express", "React", "Node"] },
  { id: 5, title: "Junior Software Developer", company: "FintechCo", location: "On-site", type: "Full-time", salary: "$70–95k", tags: ["JavaScript", "Python"] },
  { id: 6, title: "Software Developer", company: "Nexora", location: "Hybrid", type: "Full-time", salary: "$115–150k", tags: ["TypeScript", "Go"] },
  { id: 7, title: "Senior Frontend Developer", company: "Cloudly", location: "Remote", type: "Full-time", salary: "$140–180k", tags: ["React", "Next.js"] },
  { id: 8, title: "Senior Software Developer", company: "Datawise", location: "Remote", type: "Full-time", salary: "$150–190k", tags: ["System Design", "Python"] },
  { id: 9, title: "Junior Frontend Developer", company: "Shipfast", location: "Remote", type: "Internship", salary: "$50–70k", tags: ["HTML", "CSS", "React"] },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return JOBS;
    return JOBS.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto w-full container px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold tracking-widest text-primary uppercase">
        Find Jobs
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Developer jobs
      </h1>
      <p className="mt-2 max-w-xl text-sm text-base-content/60">
        {filtered.length} open roles across top engineering teams.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => {
            setSearchParams(
              e.target.value.trim() ? { q: e.target.value } : {},
              { replace: true }
            );
          }}
          placeholder="Search by title, company, or location…"
          className="input input-bordered w-full rounded-full"
        />
        <Link to="/register" className="btn btn-primary shrink-0 rounded-full px-6 font-bold">
          Post a job
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {filtered.map((job) => (
          <article
            key={job.id}
            className="rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">{job.title}</h2>
                <p className="mt-1 text-sm text-base-content/60">
                  {job.company} • {job.location} • {job.type}
                </p>
              </div>
              <span className="badge badge-success badge-soft font-bold whitespace-nowrap">
                {job.salary}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <span key={tag} className="badge badge-ghost text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link to="/register" className="btn btn-primary btn-sm rounded-full px-5 font-bold">
                Apply now
              </Link>
              <Link to={`/companies`} className="btn btn-ghost btn-sm rounded-full border border-base-300 px-5 font-bold">
                View company
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-base-content/60">
          No jobs match “{query}”. Try a different search.
        </p>
      )}
    </div>
  );
};

export default Jobs;
