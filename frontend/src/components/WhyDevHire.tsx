
import { motion } from "framer-motion";
import {
  BadgeCheck,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Globe2,
  ShieldCheck,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Verified Opportunities",
    description:
      "Explore curated job listings with clear requirements and transparent details.",
    color:
      "bg-indigo-50 text-indigo-600 ring-indigo-100 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/20",
  },
  {
    icon: Globe2,
    title: "Remote-Friendly Jobs",
    description:
      "Discover flexible opportunities from remote-first teams and global companies.",
    color:
      "bg-cyan-50 text-cyan-600 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-400 dark:ring-cyan-400/20",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Salary Insights",
    description:
      "Compare salary ranges and make more informed career decisions.",
    color:
      "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  },
  {
    icon: Zap,
    title: "A Simpler Job Search",
    description:
      "Find relevant opportunities by role, skills, experience, and location.",
    color:
      "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
  },
  {
    icon: ShieldCheck,
    title: "Developer-First Experience",
    description:
      "Focus on relevant engineering roles instead of unrelated job listings.",
    color:
      "bg-violet-50 text-violet-600 ring-violet-100 dark:bg-violet-400/10 dark:text-violet-400 dark:ring-violet-400/20",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career Growth",
    description:
      "Discover opportunities that align with your technical skills and goals.",
    color:
      "bg-pink-50 text-pink-600 ring-pink-100 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20",
  },
];

export default function WhyDevHire() {
  return (
    <section
      id="why-devhire"
      className="relative isolate overflow-hidden border-y border-slate-200/70 bg-gradient-to-b from-white via-indigo-50/40 to-white py-20 transition-colors duration-500 dark:border-slate-800 dark:from-slate-950 dark:via-indigo-950/20 dark:to-slate-950 sm:px-8 lg:py-28"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-indigo-300/20 blur-[100px] transition-colors duration-500 dark:bg-indigo-500/10"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-blue-300/20 blur-[110px] transition-colors duration-500 dark:bg-blue-500/10"
      />

      <div className="container relative mx-auto px-4 sm:px-0">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-white/80 px-4 py-2 text-xs font-bold tracking-[0.16em] text-indigo-700 shadow-sm shadow-indigo-100/50 backdrop-blur-sm dark:border-indigo-400/20 dark:bg-indigo-400/[0.07] dark:text-indigo-300 dark:shadow-none">
            <span className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400" />
            WHY DEVHIRE
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Your career deserves
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300">
              something better.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
            Your next big opportunity starts here. Discover developer-focused
            tools designed to make your job search simpler, smarter, and more
            rewarding.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.article
                key={benefit.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -5 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200/40 backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-none dark:hover:border-indigo-400/40 dark:hover:bg-slate-900"
              >
                {/* Hover accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

                {/* Icon */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110 ${benefit.color}`}
                  >
                    <Icon size={23} strokeWidth={1.8} />
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="text-slate-300 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-indigo-600 dark:text-slate-600 dark:group-hover:text-indigo-400"
                  />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-indigo-700 dark:text-slate-100 dark:group-hover:text-indigo-300">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  {benefit.description}
                </p>
              </motion.article>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-4"
        >
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-blue-200 text-xs font-bold text-indigo-700 dark:border-slate-950 dark:from-indigo-500/30 dark:to-blue-500/30 dark:text-indigo-300"
              >
                {["D", "E", "V", "+"][item]}
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Built for developers. Designed for your next career move.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
