import { Link } from "react-router-dom";

const FOOTER_COLS = [
  {
    title: 'Job Seekers',
    links: [
      { label: 'Find Jobs', href: '/jobs' },
      { label: 'Browse Companies', href: '/companies' },
      { label: 'Salary Guide', href: '/salaries' },
      { label: 'Remote Jobs', href: '/jobs' },
      { label: 'Career Resources', href: '/resources' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { label: 'Post a Job', href: '/register' },
      { label: 'Pricing', href: '/employers' },
      { label: 'Talent Search', href: '/employers' },
      { label: 'Employer Branding', href: '/employers' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/' },
      { label: 'Contact', href: '/' },
      { label: 'Blog', href: '/resources' },
      { label: 'Careers', href: '/companies' },
      { label: 'Press Kit', href: '/' },
    ],
  },
];

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com',
    path: 'M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.29 9.29 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.28 10.28 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z',
  },
  {
    label: 'X',
    href: 'https://x.com',
    path: 'M18.9 2H22l-6.77 7.74L23.2 22h-6.23l-4.88-6.38L6.5 22H3.34l7.24-8.28L2.8 2h6.39l4.41 5.83L18.9 2Zm-1.1 18.1h1.72L7.28 3.8H5.43L17.8 20.1Z',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    path: 'M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z',
  },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-base-300/70 bg-base-200/40">
      <div className="mx-auto w-full container px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m8 8-5 4 5 4m8-8 5 4-5 4M14 4l-4 16" />
                </svg>
              </span>
              <span className="text-[22px] font-extrabold tracking-tight text-base-content">
                Dev<span className="text-primary">Hire</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-base-content/60">
              The developer job portal. Find vetted remote & on-site roles at
              startups and enterprises hiring right now.
            </p>



            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-base-300/70 bg-base-100 text-base-content/70 transition-all hover:border-primary/40 hover:text-primary"
                >
                  <svg
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-xs font-bold tracking-[0.14em] text-base-content/50 uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-medium text-base-content/70 transition-colors hover:text-primary"
                    >
                      {link.label}
                      {link.label === 'Careers' && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          Hiring
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-base-300/70 pt-6 sm:flex-row">
          <p className="text-xs text-base-content/50">
            © 2026 DevHire. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs font-medium text-base-content/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="ml-1.5">All systems operational</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-medium">
            {[
              { label: 'Privacy', href: '/' },
              { label: 'Terms', href: '/' },
              { label: 'Cookies', href: '/' },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="text-base-content/50 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
