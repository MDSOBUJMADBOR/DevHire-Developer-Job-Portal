import { Link } from "react-router-dom";

const SALARIES = [
  { role: "Frontend Developer", avg: "$128k", range: "$110–145k", demand: "High" },
  { role: "Backend Developer", avg: "$145k", range: "$130–165k", demand: "High" },
  { role: "Full Stack Developer", avg: "$138k", range: "$120–155k", demand: "Very high" },
  { role: "MERN Stack Developer", avg: "$120k", range: "$100–140k", demand: "High" },
  { role: "Junior Software Developer", avg: "$82k", range: "$70–95k", demand: "Medium" },
  { role: "Software Developer", avg: "$132k", range: "$115–150k", demand: "Very high" },
  { role: "Senior Frontend Developer", avg: "$160k", range: "$140–180k", demand: "High" },
  { role: "Senior Software Developer", avg: "$170k", range: "$150–190k", demand: "Very high" },
  { role: "Junior Frontend Developer", avg: "$60k", range: "$50–70k", demand: "Medium" },
];

const Salaries = () => {
  return (
    <div className="mx-auto w-full container px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold tracking-widest text-primary uppercase">
        Salaries
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Developer salary guide
      </h1>
      <p className="mt-2 max-w-xl text-sm text-base-content/60">
        Verified compensation bands from 2,140+ vetted roles on DevHire.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-base-300/70 bg-base-100 shadow-sm">
        <table className="table w-full">
          <thead>
            <tr className="text-xs uppercase">
              <th>Role</th>
              <th>Average</th>
              <th>Range</th>
              <th>Demand</th>
              <th className="text-right">Jobs</th>
            </tr>
          </thead>
          <tbody>
            {SALARIES.map((row) => (
              <tr key={row.role} className="hover">
                <td className="font-bold">{row.role}</td>
                <td className="font-bold text-primary">{row.avg}</td>
                <td className="text-base-content/70">{row.range}</td>
                <td>
                  <span
                    className={`badge badge-soft text-xs font-bold ${
                      row.demand === "Very high"
                        ? "badge-success"
                        : row.demand === "High"
                          ? "badge-info"
                          : "badge-ghost"
                    }`}
                  >
                    {row.demand}
                  </span>
                </td>
                <td className="text-right">
                  <Link to="/jobs" className="link link-primary text-sm font-bold">
                    Browse →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl bg-primary/5 p-5 text-sm">
        <p className="font-bold">💡 Want the full report?</p>
        <p className="mt-1 text-base-content/60">
          Create a free account to compare salaries by experience, location, and
          stack.
        </p>
        <Link to="/register" className="btn btn-primary btn-sm mt-3 rounded-full px-5 font-bold">
          Get free access
        </Link>
      </div>
    </div>
  );
};

export default Salaries;
