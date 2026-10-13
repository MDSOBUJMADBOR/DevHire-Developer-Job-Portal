
import { motion } from "framer-motion";
import {
  Layers3,
  Cloud,
  ChartNoAxesColumnIncreasing,
  Code2,
  Shapes,
} from "lucide-react";

const companies = [
  {
    name: "NEXORA",
    icon: Code2,
    style: "font-black tracking-[0.18em]",
    iconColor: "text-violet-500",
  },
  {
    name: "cloudly",
    icon: Cloud,
    style: "font-bold tracking-tight",
    iconColor: "text-sky-500",
  },
  {
    name: "FintechCo",
    icon: ChartNoAxesColumnIncreasing,
    style: "font-extrabold tracking-tight",
    iconColor: "text-emerald-500",
  },
  {
    name: "DATAPULSE",
    icon: ChartNoAxesColumnIncreasing,
    style: "font-bold tracking-[0.08em]",
    iconColor: "text-indigo-500",
  },
  {
    name: "STACKLAB",
    icon: Layers3,
    style: "font-black tracking-tight",
    iconColor: "text-orange-500",
  },
  {
    name: "pixelworks",
    icon: Shapes,
    style: "font-bold tracking-tight",
    iconColor: "text-fuchsia-500",
  },
];

export default function TrustedCompanies() {
  return (
    <section
      id="trusted-companies"
      className="relative isolate overflow-hidden border-y border-slate-200/70 bg-gradient-to-b from-white via-indigo-50/50 to-white py-16 transition-colors duration-500 dark:border-slate-800 dark:from-[#080d19] dark:via-[#0c1426] dark:to-[#080d19] sm:py-20 lg:py-24"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-28 -z-10 h-72 w-72 rounded-full bg-indigo-300/20 blur-[100px] transition-colors duration-500 dark:bg-indigo-600/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-20 -z-10 h-80 w-80 rounded-full bg-blue-300/20 blur-[110px] transition-colors duration-500 dark:bg-blue-600/15"
      />

      {/* Decorative dots */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] top-1/2 -z-10 hidden -translate-y-1/2 grid-cols-5 gap-3 opacity-60 sm:grid"
      >
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-indigo-300 dark:bg-indigo-500/60"
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] top-1/2 -z-10 hidden -translate-y-1/2 grid-cols-5 gap-3 opacity-60 sm:grid"
      >
        {Array.from({ length: 25 }).map((_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-indigo-300 dark:bg-indigo-500/60"
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Eyebrow */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-indigo-500" />

            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-indigo-700 shadow-sm shadow-indigo-100/50 backdrop-blur-md transition-colors duration-500 dark:border-indigo-400/20 dark:bg-indigo-400/[0.08] dark:text-indigo-300 dark:shadow-none sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
              </span>
              Our Network
            </span>

            <span className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 transition-colors duration-500 sm:text-4xl lg:text-5xl dark:text-white">
            Built for developers.
            <br />
            <span className="mt-1 inline-block bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-violet-400">
              Trusted by ambitious teams.
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 transition-colors duration-500 sm:text-base dark:text-slate-400">
            We connect talented developers with forward-thinking teams
            building the future with technology.
          </p>
        </motion.div>

        {/* Company cards */}
        <div className="mt-12 grid grid-cols-2 items-stretch gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6 lg:gap-4">
          {companies.map((company, index) => {
            const Icon = company.icon;

            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative flex min-h-[88px] items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-5 shadow-sm shadow-slate-200/40 backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-300 hover:border-indigo-300 hover:bg-white hover:shadow-lg hover:shadow-indigo-100/60 dark:border-slate-700/70 dark:bg-slate-900/60 dark:shadow-black/10 dark:hover:border-indigo-400/40 dark:hover:bg-slate-800/80 dark:hover:shadow-indigo-950/30 sm:gap-3 sm:px-4"
              >
                {/* Hover gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-indigo-50/0 to-blue-100/0 transition-colors duration-300 group-hover:from-indigo-50/70 group-hover:to-blue-100/40 dark:group-hover:from-indigo-500/[0.08] dark:group-hover:to-blue-500/[0.04]" />

                {/* Top accent */}
                <span className="absolute left-1/2 top-0 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 group-hover:w-2/3" />

                {/* Company icon */}
                <Icon
                  size={23}
                  strokeWidth={2.3}
                  className={`relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 ${company.iconColor}`}
                />

                {/* Company name */}
                <span
                  className={`relative z-10 select-none text-sm text-slate-700 transition-colors duration-300 group-hover:text-indigo-700 dark:text-slate-200 dark:group-hover:text-white sm:text-base ${company.style}`}
                >
                  {company.name}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-12 flex max-w-xs items-center justify-center gap-3 sm:mt-16"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700" />

          <span className="h-1 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500" />

          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700" />
        </motion.div>
      </div>
    </section>
  );
}
