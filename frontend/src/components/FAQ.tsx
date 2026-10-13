
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "./Reveal";

const faqs = [
  {
    question: "Is DevHire free for job seekers?",
    answer:
      "You can configure DevHire to let candidates browse opportunities and create profiles for free. Actual access depends on your platform's pricing rules.",
  },
  {
    question: "How can I apply for a developer job?",
    answer:
      "Browse jobs, open a listing to review its requirements, and use the application flow provided by the employer.",
  },
  {
    question: "Can I find remote developer jobs?",
    answer:
      "Yes, once remote positions are included in your listings, candidates can filter opportunities by remote, hybrid, or on-site work.",
  },
  {
    question: "How can companies post jobs?",
    answer:
      "Employers can register, complete their company profile, and use the job posting flow available on your platform.",
  },
  {
    question: "Can I update my developer profile?",
    answer:
      "A profile dashboard can let registered users update their skills, experience, resume, and career preferences.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="bg-base-200/40 py-20 sm:px-8 lg:py-24">
      <div className="container mx-auto">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          {/* Left Content */}
          <div>
            <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary">
              FAQ
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-base-content sm:text-4xl">
              Questions?
              <br />
              <span className="text-primary">
                We&apos;ve got answers.
              </span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-base-content/60 sm:text-base">
              Learn more about finding jobs, creating a profile, and getting
              started with DevHire.
            </p>

            <a
              href="/contact"
              className="mt-6 inline-flex items-center text-sm font-bold text-base-content/70 transition-colors duration-300 hover:text-primary"
            >
              Contact our team →
            </a>
          </div>

          {/* FAQ Accordion */}
          <div className="divide-y divide-base-300/50">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <Reveal key={faq.question} delay={index * 80} direction="up">
                  <div className="py-5">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenIndex(isOpen ? -1 : index)
                    }
                    className="flex w-full items-center justify-between gap-5 text-left"
                  >
                    <span className="text-sm font-bold text-base-content/80 transition-colors duration-300 hover:text-primary sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={19}
                      className={`shrink-0 text-primary transition-transform duration-500 ease-in-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {/* Smooth Open / Close Animation */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                    aria-hidden={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`pr-6 text-sm leading-7 text-base-content/60 transition-[padding,transform] duration-500 ease-in-out ${
                          isOpen
                            ? "translate-y-0 pt-4"
                            : "-translate-y-2 pt-0"
                        }`}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
