import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const DESKTOP_NAV_LINKS = [
  { label: 'Find Jobs', href: '/jobs', badge: '2k+' },
  { label: 'Companies', href: '/companies' },
  { label: 'Salaries', href: '/salaries' },
];

const RESOURCE_DROPDOWN_LINKS = [
  {
    label: 'Resources',
    href: '/resources',
    description: 'Guides, interview prep & roadmaps',
    badge: 'Hub',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'About',
    href: '/about',
    description: 'Our mission, story & manifesto',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    href: '/contact',
    description: 'Get in touch & developer support',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

const NAV_LINKS = [
  { label: 'Find Jobs', href: '/jobs', badge: '2k+' },
  { label: 'Companies', href: '/companies' },
  { label: 'Salaries', href: '/salaries' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAuth();

  

  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to focus navbar search
  useEffect(() => {
    const onSlash = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    document.addEventListener('keydown', onSlash);
    return () => document.removeEventListener('keydown', onSlash);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    setIsOpen(false);
    navigate(q ? `/jobs?q=${encodeURIComponent(q)}` : '/jobs');
  };

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock body scroll while the mobile sidebar is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const initial = (user?.name?.trim()?.[0] || user?.email?.[0] || 'U').toUpperCase();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-base-300/70 bg-base-100/85 shadow-[0_1px_0_0_oklch(0%_0_0/0.02)] backdrop-blur-xl">
      {/* thin gradient accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
      <nav className="mx-auto flex h-[68px] w-full container items-center justify-between gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
        {/* Left: DevHire logo + search */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:flex-none">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
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
          <span className="leading-none">
            <span className="block text-[22px] font-extrabold tracking-tight text-base-content">
              Dev<span className="text-primary">Hire</span>
            </span>
            <span className="mt-0.5 block text-[11px] font-medium tracking-[0.14em] text-base-content/50 uppercase">
              Developer Jobs
            </span>
          </span>
          </Link>

          {/* Search — right of logo */}
          <form
            onSubmit={submitSearch}
            role="search"
            className="group relative ml-4 hidden w-full max-w-55 min-w-0 md:block lg:ml-10 lg:max-w-72"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-base-content/40 transition-colors duration-200 group-focus-within:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search jobs…"
              aria-label="Search jobs"
              className="h-[42px] w-full rounded-xl border border-base-300/80 bg-base-200/60 pr-[74px] pl-10 text-sm font-medium text-base-content shadow-[inset_0_1px_2px_oklch(0%_0_0/0.05)] outline-none transition-all duration-200 placeholder:text-base-content/40 hover:border-base-300 hover:bg-base-200/80 hover:shadow-sm focus:border-primary/60 focus:bg-base-100 focus:shadow-[0_0_0_3px_oklch(0.62_0.19_255/0.15)] focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            <span className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-1.5">
              {search ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      searchInputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="flex h-6 w-6 items-center justify-center rounded-md text-sm text-base-content/40 transition-all hover:bg-base-300/60 hover:text-base-content"
                  >
                    ✕
                  </button>
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-content shadow-md shadow-primary/25 transition-all hover:scale-105 hover:brightness-110 active:scale-95"
                  >
                    →
                  </button>
                </>
              ) : (
                <kbd className="pointer-events-none hidden h-6 min-w-6 items-center justify-center rounded-md border border-base-300/80 bg-base-100 px-1.5 text-[11px] font-bold text-base-content/40 shadow-sm sm:flex">
                  /
                </kbd>
              )}
            </span>
          </form>
        </div>

        {/* Center: pill nav (desktop) */}
        <ul className="hidden items-center gap-1 rounded-full border border-base-300/70 bg-base-200/60 p-1.5 lg:flex">
          {DESKTOP_NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:text-base-content ${
                    isActive ? 'text-base-content' : 'text-base-content/65'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] leading-none font-bold text-success">
                        {link.badge}
                      </span>
                    )}
                    {/* underline — active only */}
                    <span
                      aria-hidden="true"
                      className={`absolute right-4 bottom-1 left-4 h-0.5 origin-left rounded-full bg-gradient-to-r from-primary to-secondary transition-transform duration-300 ease-out ${
                        isActive
                          ? 'scale-x-100 opacity-100'
                          : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}

          {/* Resources Dropdown with About & Contact (Hover on Desktop) */}
          <li className="relative group">
            {(() => {
              const isResourcesActive = ['/resources', '/about', '/contact'].includes(location.pathname);
              return (
                <>
                  <NavLink
                    to="/resources"
                    className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:text-base-content ${
                      isResourcesActive ? 'text-base-content' : 'text-base-content/65'
                    }`}
                  >
                    <span>Resources</span>
                    <svg
                      className="h-3.5 w-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>

                    {/* underline — active only */}
                    <span
                      aria-hidden="true"
                      className={`absolute right-4 bottom-1 left-4 h-0.5 origin-left rounded-full bg-gradient-to-r from-primary to-secondary transition-transform duration-300 ease-out ${
                        isResourcesActive
                          ? 'scale-x-100 opacity-100'
                          : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-50'
                      }`}
                    />
                  </NavLink>

                  {/* Dropdown Menu on Hover */}
                  <div className="absolute left-1/2 -translate-x-1/2 pt-2 top-full w-64 invisible opacity-0 translate-y-1.5 transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 z-50">
                    <div className="overflow-hidden rounded-2xl border border-base-300/80 bg-base-100/95 p-1.5 shadow-2xl shadow-base-content/10 backdrop-blur-xl">
                      {RESOURCE_DROPDOWN_LINKS.map((item) => {
                        const isCurrent = location.pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                              isCurrent
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'hover:bg-base-200/80 text-base-content/80 hover:text-base-content'
                            }`}
                          >
                            <div
                              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                isCurrent
                                  ? 'bg-primary text-primary-content'
                                  : 'bg-base-200/70 text-base-content/70'
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold leading-tight">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-base-content/55 truncate mt-0.5 font-normal">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              );
            })()}
          </li>
        </ul>

        {/* Right: theme + auth + hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <NavLink
            to="/employers"
            className={({ isActive }) =>
              `group relative mr-1 hidden px-1 py-1 text-sm font-semibold transition-all duration-300 hover:-translate-y-px xl:block ${
                isActive ? 'text-primary' : 'text-base-content/60 hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                For Employers
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-primary to-secondary transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </>
            )}
          </NavLink>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/50 text-base-content transition-all hover:border-primary/40 hover:bg-base-200 hover:text-primary"
          >
            {isDark ? (
              <svg
                className="h-[18px] w-[18px] fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
              </svg>
            ) : (
              <svg
                className="h-[18px] w-[18px] fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
              </svg>
            )}
          </button>

          <span className="hidden h-6 w-px bg-base-300 sm:block" />

          {/* Auth area (desktop): dropdown if user exists, else login */}
          {!authLoading && (
            <div className="hidden items-center gap-2 lg:flex">
              {isAuthenticated && user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((v) => !v)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2.5 rounded-full border border-base-300/70 bg-base-200/50 py-1.5 pr-3 pl-1.5 transition-all hover:border-primary/40 hover:bg-base-200"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
                      {initial}
                    </span>
                    <span className="max-w-28 truncate text-left leading-tight">
                      <span className="block truncate text-sm font-bold">
                        {user.name}
                      </span>
                      <span className="block text-[11px] font-medium text-base-content/50 capitalize">
                        {user.role.toLowerCase()}
                      </span>
                    </span>
                    <svg
                      className={`h-4 w-4 opacity-60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl"
                    >
                      <div className="border-b border-base-300/60 px-4 py-3">
                        <p className="truncate text-sm font-bold">{user.name}</p>
                        <p className="truncate text-xs text-base-content/50">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-semibold text-base-content/80 hover:bg-base-200 hover:text-base-content"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-semibold text-base-content/80 hover:bg-base-200 hover:text-base-content"
                      >
                        Profile
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="block w-full px-4 py-2.5 text-left text-sm font-bold text-error hover:bg-error/10"
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-full px-4 py-2.5 text-sm font-semibold text-base-content transition-colors hover:bg-base-200"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="group flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-content shadow-lg shadow-primary/30 transition-all hover:-translate-y-px hover:shadow-xl hover:shadow-primary/30 hover:brightness-110"
                  >
                    Post a Job
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile / tablet hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/50 text-base-content transition-colors hover:bg-base-200 lg:hidden"
          >
            {isOpen ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M4 7h16M4 12h16M4 17h10" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile sidebar (small devices) */}
      {/* Overlay */}
      <div
        aria-hidden={!isOpen}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      {/* Panel */}
      <aside
        aria-hidden={!isOpen}
        aria-label="Mobile navigation"
        inert={!isOpen}
        className={`fixed top-0 left-0 z-[60] flex h-dvh w-[86%] max-w-80 flex-col bg-base-100 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isOpen ? 'visible' : 'invisible'}`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between gap-3 border-b border-base-300/70 px-4 py-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex min-w-0 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25">
              <svg
                className="h-4 w-4"
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
            <span className="truncate text-lg font-extrabold tracking-tight">
              Dev<span className="text-primary">Hire</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-base-300/70 bg-base-200/50 transition-colors hover:bg-base-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar body */}
        <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {/* Search — mobile */}
          <form
            onSubmit={submitSearch}
            role="search"
            className="group relative pb-3 md:hidden"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-[calc(50%+6px)] text-base-content/40 transition-colors group-focus-within:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search jobs…"
              aria-label="Search jobs"
              tabIndex={isOpen ? 0 : -1}
              className="h-12 w-full rounded-xl border border-base-300/80 bg-base-200/60 pr-12 pl-10 text-sm font-medium shadow-[inset_0_1px_2px_oklch(0%_0_0/0.05)] outline-none transition-all placeholder:text-base-content/40 focus:border-primary/60 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="submit"
                aria-label="Submit search"
                tabIndex={isOpen ? 0 : -1}
                className="absolute top-1/2 right-2.5 flex h-8 w-8 -translate-y-[calc(50%+6px)] items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-content shadow-md shadow-primary/25 transition-transform active:scale-95"
              >
                →
              </button>
            )}
          </form>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              onClick={() => setIsOpen(false)}
              tabIndex={isOpen ? 0 : -1}
              className={({ isActive }) =>
                `group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition-colors duration-200 hover:bg-base-200 hover:text-base-content ${
                  isActive ? 'text-base-content' : 'text-base-content/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex items-center gap-2 pb-1">
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
                        {link.badge} new
                      </span>
                    )}
                    {/* underline — active only */}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-primary to-secondary transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
                      }`}
                    />
                  </span>
                  <svg
                    className="h-4 w-4 opacity-40 transition-opacity group-hover:opacity-80"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                </>
              )}
            </NavLink>
          ))}
          {isAuthenticated && user ? (
            <div className="pt-3">
              <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/50 px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{user.name}</p>
                  <p className="truncate text-xs text-base-content/50">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full border border-base-300 px-4 py-3 text-center text-sm font-bold text-base-content transition-colors hover:bg-base-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full border border-base-300 px-4 py-3 text-center text-sm font-bold text-base-content transition-colors hover:bg-base-200"
                >
                  Profile
                </Link>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 w-full rounded-full bg-error/10 px-4 py-3 text-center text-sm font-bold text-error transition-colors hover:bg-error/15"
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 pt-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full border border-base-300 px-4 py-3 text-center text-sm font-bold text-base-content transition-colors hover:bg-base-200"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-primary-content shadow-lg shadow-primary/25 transition-all hover:brightness-110"
                >
                  Post a Job — free
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="border-t border-base-300/70 px-4 py-3">
          <Link
            to="/employers"
            onClick={() => setIsOpen(false)}
            className="block text-center text-xs font-medium text-base-content/50 hover:text-primary"
          >
            Hiring? View employer plans →
          </Link>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
