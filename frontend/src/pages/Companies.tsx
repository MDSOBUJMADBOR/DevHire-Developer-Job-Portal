import { Link } from "react-router-dom";

const COMPANIES = [
  { name: "Nexora", initial: "N", industry: "SaaS • Remote-first", roles: 320, location: "Remote" },
  { name: "Cloudly", initial: "C", industry: "Cloud Infrastructure", roles: 280, location: "Hybrid" },
  { name: "FintechCo", initial: "F", industry: "Fintech", roles: 190, location: "New York" },
  { name: "Datawise", initial: "D", industry: "Data & AI", roles: 240, location: "Remote" },
  { name: "Shipfast", initial: "S", industry: "Developer Tools", roles: 150, location: "San Francisco" },
  { name: "PixelForge", initial: "P", industry: "E-commerce", roles: 130, location: "London" },
];

const Companies = () => {
  return (
    <div className="mx-auto w-full container px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold tracking-widest text-primary uppercase">
        2k+ Companies
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Top companies hiring developers
      </h1>
      <p className="mt-2 max-w-xl text-sm text-base-content/60">
        Verified engineering teams with open roles, salary transparency, and
        remote-friendly cultures.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPANIES.map((company) => (
          <article
            key={company.name}
            className="rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                {company.initial}
              </span>
              <div>
                <h2 className="text-base font-bold">{company.name}</h2>
                <p className="text-xs text-base-content/55">{company.industry}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-base-content/60">
              📍 {company.location} •{" "}
              <span className="font-bold text-success">{company.roles} open roles</span>
            </p>
            <div className="mt-4 flex gap-2">
              <Link to="/jobs" className="btn btn-primary btn-sm flex-1 rounded-full font-bold">
                View jobs
              </Link>
              <Link
                to="/salaries"
                className="btn btn-ghost btn-sm flex-1 rounded-full border border-base-300 font-bold"
              >
                Salaries
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Companies;
