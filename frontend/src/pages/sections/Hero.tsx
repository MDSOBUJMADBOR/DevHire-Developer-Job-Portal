const COMPANIES = ['Nexora', 'Cloudly', 'FintechCo', 'Datawise', 'Shipfast'];

const ROLES = [
  {
    company: 'Nexora',
    initial: 'N',
    title: 'Senior Frontend Engineer',
    meta: 'Remote • $140–180k',
    match: '98%',
    tags: ['React', 'TypeScript'],
  },
  {
    company: 'Cloudly',
    initial: 'C',
    title: 'Backend Engineer (Node)',
    meta: 'Hybrid • $130–165k',
    match: '94%',
    tags: ['Node.js', 'AWS'],
  },
  {
    company: 'Datawise',
    initial: 'D',
    title: 'Full-Stack Developer',
    meta: 'Remote • $120–155k',
    match: '91%',
    tags: ['Python', 'React'],
  },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-base-100">
      {/* professional backdrop: grid + glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0%_0_0/0.04)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0%_0_0/0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_35%,black,transparent)]" />
        <div className="absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full container items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24 ">
        {/* Left */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-base-300 bg-base-100 py-1.5 pr-4 pl-1.5 shadow-sm">
            <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-content">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              LIVE
            </span>
            <span className="text-xs font-semibold text-base-content/70">
              2,140 vetted roles open this week
            </span>
          </div>

          <h1 className="mt-6 text-4xl leading-[1.04] font-extrabold tracking-[-0.02em] text-balance text-base-content sm:text-5xl lg:text-[4.2rem]">
            Get hired for the{' '}
            <span className="relative whitespace-nowrap">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                best dev roles
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 220 12"
                className="absolute -bottom-1 left-0 w-full text-primary/40"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C60 3 160 3 217 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-base-content/65 sm:text-lg">
            DevHire is the career platform built for developers. Verified
            salaries, remote-first filters, and direct access to engineering
            hiring managers — no recruiters spamming your inbox.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/jobs"
              className="btn btn-primary rounded-full px-7 py-3.5 text-sm font-bold shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
            >
              Browse developer jobs
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
            <a
              href="/employers"
              className="btn btn-ghost rounded-full border-base-300 px-7 py-3.5 text-sm font-bold hover:border-primary/40 hover:text-primary"
            >
              Hire developers
            </a>
          </div>

          {/* trust row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center">
              <div className="flex -space-x-2.5">
                {['AK', 'JM', 'RS', 'TL'].map((n, i) => (
                  <span
                    key={n}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-base-100 ${i % 2 === 0
                        ? 'bg-primary text-primary-content'
                        : 'bg-neutral text-neutral-content'
                      }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="ml-3">
                <div
                  className="flex items-center gap-0.5 text-warning"
                  aria-label="4.9 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-3.5 w-3.5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                    </svg>
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-base-content">
                    4.9/5
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-base-content/55">
                  from 12,400+ developer reviews
                </p>
              </div>
            </div>
            <span className="hidden h-10 w-px bg-base-300 sm:block" />
            <div className="flex items-center gap-4">
              {COMPANIES.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="text-sm font-extrabold tracking-tight text-base-content/50"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: professional hiring dashboard */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl shadow-base-300/25">
            {/* window bar */}
            <div className="flex items-center justify-between border-b border-base-300/70 px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              </div>
              <p className="rounded-full bg-base-200 px-3 py-1 text-[11px] font-semibold text-base-content/60">
                devhire.com/matches
              </p>
              <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
                ● 3 new invites
              </span>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {ROLES.map((job) => (
                <article
                  key={job.title}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-base-300/70 p-3.5 transition-colors hover:border-primary/40 hover:bg-base-200/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-200 text-sm font-extrabold text-base-content">
                      {job.initial}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-base-content">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-base-content/55">
                        {job.company} • {job.meta}
                      </p>
                      <div className="mt-1.5 flex gap-1.5">
                        {job.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-base-200 px-1.5 py-0.5 text-[10px] font-bold text-base-content/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className="text-xs font-extrabold text-success">
                      {job.match} match
                    </span>
                    <a href="/jobs" className="btn btn-primary btn-xs rounded-full px-4 font-bold">
                      Apply
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* footer strip */}
            <div className="flex items-center justify-between border-t border-base-300/70 bg-base-200/40 px-5 py-3.5">
              <div>
                <p className="text-[11px] font-semibold text-base-content/50">
                  Profile strength
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-base-300">
                    <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-primary to-secondary" />
                  </div>
                  <span className="text-[11px] font-bold text-base-content">92%</span>
                </div>
              </div>
              <a
                href="/profile"
                className="text-xs font-bold text-primary hover:underline"
              >
                Complete profile →
              </a>
            </div>
          </div>

          {/* floating offer card */}
          <div className="absolute -bottom-6 -left-3 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 shadow-xl sm:-left-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 7H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-9 7H7v-2h4v2Zm8 0h-5v-2h5v2Z" />
              </svg>
            </span>
            <span>
              <span className="block text-xs font-bold text-base-content">
                Offer received • $178k
              </span>
              <span className="block text-[11px] text-base-content/55">
                Senior Frontend • Remote
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
