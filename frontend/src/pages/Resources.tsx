import { Link } from "react-router-dom";

const GUIDES = [
  { title: "Frontend interview playbook", desc: "React, TypeScript & system design questions top companies actually ask.", tag: "Interviews", readTime: "8 min read" },
  { title: "Backend resume that gets callbacks", desc: "Real examples from hired Node.js & Python developers.", tag: "Resume", readTime: "5 min read" },
  { title: "MERN portfolio projects that stand out", desc: "5 project ideas hiring managers love + deployment checklist.", tag: "Portfolio", readTime: "10 min read" },
  { title: "Salary negotiation for developers", desc: "Scripts to go from first offer to +$20k without killing the offer.", tag: "Salaries", readTime: "7 min read" },
  { title: "Junior to Senior roadmap", desc: "Skills, milestones, and timelines from 500+ promoted engineers.", tag: "Career", readTime: "12 min read" },
  { title: "Remote job search guide", desc: "Where to apply, how to stand out async, and red flags to avoid.", tag: "Remote", readTime: "6 min read" },
];

const Resources = () => {
  return (
    <div className="mx-auto w-full container px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-bold tracking-widest text-primary uppercase">
        Resources
      </p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Guides for developers
      </h1>
      <p className="mt-2 max-w-xl text-sm text-base-content/60">
        Practical playbooks on interviews, resumes, portfolios, and salary
        negotiation.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <article
            key={guide.title}
            className="flex flex-col rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <span className="badge badge-primary badge-soft w-fit text-xs font-bold">
              {guide.tag}
            </span>
            <h2 className="mt-3 text-base font-bold">{guide.title}</h2>
            <p className="mt-1.5 flex-1 text-sm text-base-content/60">{guide.desc}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-base-content/50">{guide.readTime}</span>
              <Link to="/register" className="text-sm font-bold text-primary hover:underline">
                Read free →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Resources;
