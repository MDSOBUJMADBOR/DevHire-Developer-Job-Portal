import { Quote, Star } from "lucide-react";
import Reveal from "./Reveal";

const testimonials = [
  {
    name: "Alex Morgan",
    role: "Frontend Developer",
    initials: "AM",
    color: "bg-violet-100 text-violet-700",
    quote:
      "The focused job search made it much easier to find roles that matched my React and TypeScript experience.",
  },
  {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    initials: "SC",
    color: "bg-blue-100 text-blue-700",
    quote:
      "I like being able to compare opportunities and see the requirements before applying.",
  },
  {
    name: "Daniel Brooks",
    role: "Backend Developer",
    initials: "DB",
    color: "bg-emerald-100 text-emerald-700",
    quote:
      "The clean interface makes searching for engineering roles feel simple and organized.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-base-200/40 py-20 sm:px-8 lg:py-24">
      <div className="mx-auto container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
            DEVELOPER STORIES
          </span>

          <h2 className="mt-5 text-3xl font-extrabold text-base-content sm:text-4xl">
            Built for people who{" "}<span className="text-primary">build the web</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-base-content/60">
            A better experience for discovering your next opportunity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((person, index) => (
            <Reveal key={person.name} delay={index * 100} direction="up">
              <article
                className="rounded-2xl border border-base-300/70 bg-base-100 p-6 shadow-sm transition-colors duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-7"
              >
                <Quote size={28} className="text-primary/30" />

                <div className="mt-4 flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={15}
                      fill="currentColor"
                      strokeWidth={1}
                    />
                  ))}
                </div>

                <p className="mt-5 min-h-24 text-sm leading-7 text-base-content/70">
                  &ldquo;{person.quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-base-300/50 pt-5">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold ${person.color} dark:bg-primary/20 dark:text-primary`}
                  >
                    {person.initials}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-base-content">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-xs text-base-content/50">
                      {person.role}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-5 text-center text-xs text-base-content/40">
          Illustrative demo testimonials — replace with verified user feedback.
        </p>
      </div>
    </section>
  );
}
