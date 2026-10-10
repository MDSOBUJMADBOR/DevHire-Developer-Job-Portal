const CATEGORIES = [
  { title: 'Full Stack Developer', jobs: '320+ jobs', icon: 'FS' },
  { title: 'Backend Developer', jobs: '280+ jobs', icon: 'BE' },
  { title: 'Frontend Developer', jobs: '310+ jobs', icon: 'FE' },
  { title: 'MERN Stack Developer', jobs: '190+ jobs', icon: 'ME' },
  { title: 'Junior Software Developer', jobs: '150+ jobs', icon: 'JD' },
  { title: 'Software Developer', jobs: '410+ jobs', icon: 'SD' },
  { title: 'Senior Frontend Developer', jobs: '175+ jobs', icon: 'SF' },
  { title: 'Senior Software Developer', jobs: '210+ jobs', icon: 'SS' },
  { title: 'Junior Frontend Developer', jobs: '130+ jobs', icon: 'JF' },
];

const TopCompanies = () => {
  return (
    <section className="relative">
      <div className="relative mx-auto w-full container px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">
              Top categories
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Explore by job category
            </h2>
            <p className="mt-2 max-w-xl text-sm text-base-content/60 sm:text-base">
              Browse the most in-demand developer roles and find your next
              opportunity faster.
            </p>
          </div>
          <a
            href="/jobs"
            className="btn btn-ghost btn-sm rounded-full font-bold text-primary"
          >
            View all jobs →
          </a>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <a
              key={category.title}
              href="/jobs"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-base-300/70 bg-base-100 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-extrabold text-primary">
                  {category.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {category.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-base-content/55">
                    {category.jobs} available
                  </span>
                </span>
              </div>
              <span className="btn btn-ghost btn-xs rounded-full px-3 font-bold transition-colors group-hover:bg-primary group-hover:text-primary-content">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopCompanies;