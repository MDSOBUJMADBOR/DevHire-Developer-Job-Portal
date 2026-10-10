import { useState } from "react";
import { useAuth } from "../context/AuthContext";

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
import CompanyProfile from "./dashboard/recruiter/CompanyProfile";
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
  { key: "company", label: "Company Profile" },
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

  if (prevRole !== normalizedRole) {
    setPrevRole(normalizedRole);
    setActive("overview");
  }

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
        case "company":
          return <CompanyProfile />;
        case "post-job":
          return <PostJob />;
        case "manage-jobs":
          return <ManageJobs />;
        case "edit-job":
          return <EditJob />;
        case "applicants":
          return <Applicants />;
        case "applicant-details":
          return <ApplicantDetails />;
        default:
          return <RecruiterOverview />;
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
          return <AdminOverview />;
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

  return (
    <div className="mx-auto w-full container px-4 py-8 sm:px-6 lg:px-8">
      <p className="text-sm text-base-content/60">
        Welcome back, {user?.name} ({user?.role})
      </p>

      <div className="mt-4 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-base-300 bg-base-100 p-3 shadow-sm">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {menu.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActive(item.key)}
                className={`rounded-xl px-4 py-2.5 text-left text-sm font-semibold whitespace-nowrap transition-colors ${
                  active === item.key
                    ? "bg-primary text-primary-content"
                    : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-h-[400px] rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
          {renderPage()}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
