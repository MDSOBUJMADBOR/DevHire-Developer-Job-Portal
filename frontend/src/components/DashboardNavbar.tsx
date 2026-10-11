import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
  title: string;
}

const DashboardNavbar = ({
  sidebarOpen,
  onMenuToggle,
  title,
}: DashboardNavbarProps) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const initial = (
    user?.name?.trim()?.[0] ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-300/70 bg-base-100/85 shadow-[0_1px_12px_oklch(0%_0_0/0.06)] backdrop-blur-xl">
      <div className="h-0.5 w-full bg-gradient-to-r from-primary via-secondary to-accent" />
      <nav className="mx-auto flex h-16 w-full container items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-base-300 bg-base-100 shadow-sm transition-colors hover:bg-base-200 lg:hidden"
          >
            {sidebarOpen ? (
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
          <Link
            to="/"
            aria-label="DevHire home"
            className="group hidden shrink-0 items-center gap-2 sm:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-md shadow-primary/25 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
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
            <span className="text-lg font-extrabold tracking-tight transition-colors group-hover:text-primary">
              Dev<span className="text-primary">Hire</span>
            </span>
          </Link>
          <span className="hidden h-6 w-px bg-base-300 sm:block" />
          <div className="min-w-0">
            <h1 className="truncate text-base leading-tight font-bold sm:text-lg">
              {title}
            </h1>
            <p className="hidden truncate text-[11px] text-base-content/50 md:block">
              Dashboard
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-base-300/70 bg-base-200/50 transition-all hover:border-primary/40 hover:bg-base-200 hover:text-primary"
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

          {/* User dropdown */}
          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-expanded={userMenuOpen}
              aria-haspopup="menu"
              className={`flex items-center gap-2.5 rounded-full border py-1.5 pr-2.5 pl-1.5 transition-all duration-200 ${
                userMenuOpen
                  ? "border-primary/50 bg-base-200 shadow-md shadow-primary/10"
                  : "border-base-300/70 bg-base-200/50 hover:border-primary/40 hover:bg-base-200 hover:shadow-sm"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-content ring-2 ring-primary/20">
                {initial}
              </span>
              <span className="hidden max-w-28 truncate text-left leading-tight md:block">
                <span className="block truncate text-sm font-bold">
                  {user?.name}
                </span>
                <span className="block text-[11px] font-medium text-base-content/50 capitalize">
                  {user?.role.toLowerCase()}
                </span>
              </span>
              <svg
                className={`hidden h-4 w-4 opacity-60 transition-transform duration-200 md:block ${
                  userMenuOpen ? "rotate-180" : ""
                }`}
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
                className="animate-dropdown absolute right-0 mt-2 w-60 origin-top-right overflow-hidden rounded-2xl border border-base-300/80 bg-base-100 shadow-2xl shadow-base-300/30"
              >
                <div className="flex items-center gap-3 border-b border-base-300/60 bg-base-200/40 px-4 py-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-content">
                    {initial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{user?.name}</p>
                    <p className="truncate text-xs text-base-content/50">
                      {user?.email}
                    </p>
                    <span className="badge badge-primary badge-xs mt-1 font-bold capitalize">
                      {user?.role.toLowerCase()}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to="/"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
                  >
                    <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                    Back to Home
                  </Link>
                  <Link
                    to="/profile"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
                  >
                    <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </Link>
                  <Link
                    to="/jobs"
                    role="menuitem"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
                  >
                    <svg className="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>
                    Browse Jobs
                  </Link>
                </div>
                <div className="border-t border-base-300/60 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-error transition-colors hover:bg-error/10"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default DashboardNavbar;
