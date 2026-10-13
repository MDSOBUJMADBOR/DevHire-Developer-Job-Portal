import { ArrowRight, Code2, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-base-200/40 py-12 sm:px-8 lg:px-8">
      <div className="relative mx-auto container overflow-hidden rounded-3xl border border-primary/20 bg-base-100 shadow-xl shadow-primary/5">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0%_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0%_0_0/0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-lg shadow-primary/25">
            <Code2 size={32} />
          </div>

          {/* Badge */}
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Sparkles size={14} />
            Your next chapter starts here
          </span>

          {/* Heading */}
          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-base-content sm:text-4xl lg:text-5xl">
            Ready to build your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              next career move?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-base-content/60 sm:text-base">
            Find meaningful opportunities, connect with engineering
            teams, and take the next step in your developer journey.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="/register"
              className="btn btn-primary rounded-xl px-8 py-3.5 text-sm font-bold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Create your account
              <ArrowRight size={17} />
            </a>

            <a
              href="/employers"
              className="btn btn-outline rounded-xl border-base-300 px-8 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
            >
              Hire developers
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-base-content/50">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Free to join
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified salaries
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Remote-friendly
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
