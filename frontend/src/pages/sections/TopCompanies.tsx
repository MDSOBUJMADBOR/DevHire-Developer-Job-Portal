
"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";

const CATEGORIES = [
  { title: "Full Stack Developer", count: "320+" },
  { title: "Backend Developer", count: "280+" },
  { title: "Frontend Developer", count: "310+" },
  { title: "MERN Stack Developer", count: "190+" },
  { title: "Junior Software Developer", count: "150+" },
  { title: "Software Developer", count: "410+" },
  { title: "Senior Frontend Developer", count: "175+" },
  { title: "Senior Software Developer", count: "210+" },
  { title: "Junior Frontend Developer", count: "130+" },
];

/* =====================================================
   Category Card
===================================================== */

type Category = {
  title: string;
  count: string;
};

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <a href="/jobs">
      <div className="group relative w-[280px] shrink-0 overflow-hidden rounded-2xl border border-base-300/70 bg-base-100 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:w-[310px]">
        {/* Decorative Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

        {/* Card Content */}
        <div className="relative flex items-center gap-4">
          {/* Icon */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-content">
            <Code2 className="h-8 w-8" />
          </div>

          {/* Information */}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-base-content transition-colors group-hover:text-primary">
              {category.title}
            </h3>

            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />

              <span className="text-xs font-semibold text-primary">
                {category.count} Jobs
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-5 h-px w-full bg-base-300/50" />

        {/* Bottom Info */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-base-content/50">
            Career Opportunities
          </span>

          <span className="flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-2">
            Explore Jobs
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
};

/* =====================================================
   Marquee Row
===================================================== */

const MarqueeRow = ({
  categories,
  reverse = false,
}: {
  categories: Category[];
  reverse?: boolean;
}) => {
  // Duplicate cards for seamless scrolling
  const items = [...categories, ...categories];

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-max gap-5"
        initial={{
          x: reverse ? "-50%" : "0%",
        }}
        animate={{
          x: reverse ? "0%" : "-50%",
        }}
        transition={{
          duration: reverse ? 32 : 28,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
        whileHover={{
          animationPlayState: "paused",
        }}
      >
        {items.map((category, index) => (
          <CategoryCard
            key={`${category.title}-${index}`}
            category={category}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* =====================================================
   Main Job Categories Component
===================================================== */

export default function JobCategories() {
  // Split categories into two rows
  const firstRow = CATEGORIES.slice(0, 5);
  const secondRow = CATEGORIES.slice(5);

  return (
    <section className="relative overflow-hidden bg-base-200/40 px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mx-auto mb-9 max-w-2xl text-center sm:mb-11"
        >
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Explore Opportunities
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl lg:text-4xl">
            Explore Jobs by{" "}
            <span className="text-primary">Category</span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
            Discover exciting career opportunities across different
            software development roles and find the perfect job
            for your skills.
          </p>
        </motion.div>

        {/* Marquee */}
        <div className="relative">
          {/* Left Fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-base-100 to-transparent sm:w-20 lg:w-32" />

          {/* Right Fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-base-100 to-transparent sm:w-20 lg:w-32" />

          {/* Row 1 */}
          <MarqueeRow categories={firstRow} />

          {/* Row 2 */}
          <div className="mt-5">
            <MarqueeRow
              categories={secondRow}
              reverse={true}
            />
          </div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-base-content/50 sm:text-sm">
            Find your next opportunity and take your developer
            career to the next level.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
