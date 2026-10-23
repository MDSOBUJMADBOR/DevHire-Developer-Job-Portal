import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/DashboardNavbar";

import CandidateOverview from "./dashboard/candidate/Overview";
import MyProfile from "./dashboard/candidate/MyProfile";
import MyResume from "./dashboard/candidate/MyResume";
import MyApplications from "./dashboard/candidate/MyApplications";
import SavedJobs from "./dashboard/candidate/SavedJobs";
import Skills from "./dashboard/candidate/Skills";
import Experience from "./dashboard/candidate/Experience";
import Education from "./dashboard/candidate/Education";
import CandidateSettings from "./dashboard/candidate/Settings";

import RecruiterOverview from "./dashboard/recruiter/Overview";
import YourProfile from "./dashboard/recruiter/YourProfile";
import PostJob from "./dashboard/recruiter/PostJob";
import ManageJobs from "./dashboard/recruiter/ManageJobs";
import EditJob from "./dashboard/recruiter/EditJob";
import Applicants from "./dashboard/recruiter/Applicants";
import ApplicantDetails from "./dashboard/recruiter/ApplicantDetails";

import AdminOverview from "./dashboard/admin/Overview";
import UserManagement from "./dashboard/admin/UserManagement";
import RecruiterManagement from "./dashboard/admin/RecruiterManagement";
import JobManagement from "./dashboard/admin/JobManagement";
import ApplicationManagement from "./dashboard/admin/ApplicationManagement";
import Reports from "./dashboard/admin/Reports";
import AdminSettings from "./dashboard/admin/Settings";

const CANDIDATE_MENU = [
  { key: "overview", label: "Overview" },
  { key: "profile", label: "My Profile" },
  { key: "resume", label: "My Resume" },
  { key: "applications", label: "My Applications" },
  { key: "saved", label: "Saved Jobs" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "settings", label: "Settings" },
];

const RECRUITER_MENU = [
  { key: "overview", label: "Overview" },
  { key: "profile", label: "Your Profile" },
  { key: "post-job", label: "Post Job" },
  { key: "manage-jobs", label: "Manage Jobs" },
  { key: "edit-job", label: "Edit Job" },
  { key: "applicants", label: "Applicants" },
  { key: "applicant-details", label: "Applicant Details" },
];

const ADMIN_MENU = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "User Management" },
  { key: "recruiters", label: "Recruiter Management" },
  { key: "jobs", label: "Job Management" },
  { key: "applications", label: "Application Management" },
  { key: "reports", label: "Reports" },
  { key: "settings", label: "Settings" },
];

const Dashboard = () => {
  const { user } = useAuth();

  console.log("user", user?.role);

  const normalizedRole = (user?.role ?? "").toLowerCase();
  const isCandidate = normalizedRole === "candidate";
  const isRecruiter =
    normalizedRole === "recruiter" || normalizedRole === "employer";
  const isAdmin = normalizedRole === "admin";

  const menu = isCandidate
    ? CANDIDATE_MENU
    : isRecruiter
      ? RECRUITER_MENU
      : isAdmin
        ? ADMIN_MENU
        : [];

  const [active, setActive] = useState("overview");
  const [prevRole, setPrevRole] = useState(normalizedRole);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (prevRole !== normalizedRole) {
    setPrevRole(normalizedRole);
    setActive("overview");
  }

  // Close drawer on Escape + lock body scroll while open
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const selectPage = (key: string) => {
    setActive(key);
    setSidebarOpen(false);
  };

  const activeLabel =
    menu.find((item) => item.key === active)?.label ?? "Dashboard";

  const renderPage = () => {
    if (isCandidate) {
      switch (active) {
        case "profile":
          return <MyProfile />;
        case "resume":
          return <MyResume />;
        case "applications":
          return <MyApplications />;
        case "saved":
          return <SavedJobs />;
        case "skills":
          return <Skills />;
        case "experience":
          return <Experience />;
        case "education":
          return <Education />;
        case "settings":
          return <CandidateSettings />;
        default:
          return <CandidateOverview />;
      }
    }

    if (isRecruiter) {
      switch (active) {
        case "profile":
        case "company":
          return <YourProfile />;
        case "post-job":
          return (
            <PostJob
              onNavigateToManage={() => selectPage("manage-jobs")}
            />
          );
        case "manage-jobs":
          return (
            <ManageJobs
              onNavigateToPost={() => selectPage("post-job")}
            />
          );
        case "edit-job":
          return <EditJob />;
        case "applicants":
          return <Applicants />;
        case "applicant-details":
          return <ApplicantDetails />;
        default:
          return <RecruiterOverview onNavigate={selectPage} />;
      }
    }

    if (isAdmin) {
      switch (active) {
        case "users":
          return <UserManagement />;
        case "recruiters":
          return <RecruiterManagement />;
        case "jobs":
          return <JobManagement />;
        case "applications":
          return <ApplicationManagement />;
        case "reports":
          return <Reports />;
        case "settings":
          return <AdminSettings />;
        default:
          return <AdminOverview onNavigate={setActive} />;
      }
    }

    return (
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-base-content/60">
          Unknown role: {user?.role ?? "none"}
        </p>
      </div>
    );
  };

  const navButtons = (onSelect: (key: string) => void) =>
    menu.map((item) => (
      <button
        key={item.key}
        type="button"
        onClick={() => onSelect(item.key)}
        aria-current={active === item.key ? "page" : undefined}
        title={item.label}
        className={`block w-full truncate rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
          active === item.key
            ? "bg-primary text-primary-content"
            : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
        }`}
      >
        {item.label}
      </button>
    ));

  return (
    <div className="min-h-screen bg-base-200/50">
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        title={activeLabel}
      />

      <div className="mx-auto w-full container px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <p className="truncate text-xs text-base-content/60 sm:text-sm">
          Welcome back, {user?.name} ({user?.role})
        </p>

        <div className="mt-4 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Static sidebar — desktop */}
        <aside className="hidden rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm lg:block">
          <nav className="flex flex-col gap-2">
            {navButtons(setActive)}
          </nav>
        </aside>

        <section className="min-h-[400px] min-w-0 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6">
          {renderPage()}
        </section>
      </div>

      {/* Slide-in sidebar — mobile / tablet */}
      <div
        aria-hidden={!sidebarOpen}
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!sidebarOpen}
        aria-label="Dashboard menu"
        inert={!sidebarOpen}
        className={`fixed top-0 left-0 z-[60] flex h-dvh w-[84%] max-w-72 flex-col bg-base-100 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarOpen ? "visible" : "invisible"}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-base-300/70 px-4 py-4">
          <p className="truncate text-base font-extrabold">
            Dev<span className="text-primary">Hire</span>
            <span className="ml-2 text-xs font-medium text-base-content/50">
              {user?.role}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close dashboard menu"
            tabIndex={sidebarOpen ? 0 : -1}
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
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
          {navButtons(selectPage)}
        </nav>
        <div className="border-t border-base-300/70 px-4 py-3">
          <p className="truncate text-center text-xs text-base-content/50">
            {user?.name} • {user?.email}
          </p>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default Dashboard;
