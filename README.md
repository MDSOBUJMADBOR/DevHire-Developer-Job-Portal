# 🚀 DevHire — Modern Developer Job & Hiring Platform

<div align="center">

![DevHire Banner](https://img.shields.io/badge/DevHire-Developer%20Job%20Portal-6366f1?style=for-the-badge&logo=rocket&logoColor=white)

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI_v5-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)](https://daisyui.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**DevHire** is a full-stack, developer-first recruitment and job discovery platform. Designed specifically for software engineers, engineering leaders, and modern tech companies, DevHire bridges the gap between top engineering talent and high-growth teams with salary transparency, rich developer profiles, interactive salary estimators, in-app application submission to MongoDB, live recruitment graphs, and dedicated role-based portals.

[Explore Jobs](#-public-portal--features) • [Candidate Suite](#-candidate-portal) • [Recruiter Suite](#-recruiter--employer-portal) • [Admin Control Center](#-admin-control-center) • [Setup Guide](#-getting-started) • [API Reference](#-api-endpoints-overview)

</div>

---

## 🌟 Key Highlights & Architecture

- **Full-Stack MERN Architecture:** Built with React 19, TypeScript, Node.js/Express, and MongoDB with strict typing.
- **Role-Based Access Control (RBAC):** Three distinct portals for **Candidates**, **Recruiters (Employers)**, and **Admins**.
- **Interactive Application Engine:** Candidates apply directly from job cards or modal popups; data persists in MongoDB and synchronizes in real time with the candidate's **My Applications** dashboard.
- **Recruiter Analytics Dashboard:** Live visual graphs including a **Weekly/Monthly Application Inflow Bar Chart**, **Hiring Funnel & ATS Conversion Pipeline**, and **Tech Stack Distribution Breakdown**.
- **Modern Responsive Design System:** Tailwind CSS v4 paired with DaisyUI v5 for ultra-fast performance, dark/light compatibility, and 100% mobile responsiveness.
- **Radical Salary Transparency:** Every job features explicit compensation bands with an interactive salary estimator widget.

---

## 🖥️ Public Portal & Features

| Page | Description |
| :--- | :--- |
| **Landing Page (`Home.tsx`)** | Dynamic hero section, search bar, live featured jobs from REST API, trusted companies carousel, value propositions, and candidate testimonials. |
| **Job Search & Filters (`Jobs.tsx`)** | Real-time search by keywords, category pill filters (`Frontend`, `Backend`, `Full Stack`, `DevOps`, etc.), workplace model dropdown (`Remote`, `Hybrid`, `On-site`), and instant **"Apply Now" Modal** trigger. |
| **Top Companies (`Companies.tsx`)** | Directory of vetted tech teams (Stripe, OpenAI, Vercel, Supabase, Datadog) with tech stack tags, work models, compensation benchmarks, and open role counters. |
| **Salary Guide (`Salaries.tsx`)** | Interactive **Developer Salary Estimator Widget**, compensation benchmarks, demand indices, and instant toggle between **Grid Cards** and **Detailed Table View**. |
| **Engineering Playbooks (`Resources.tsx`)** | Technical interview cheatsheets, ATS resume templates, and system design roadmaps with an interactive reader modal. |
| **For Employers (`Employers.tsx`)** | Dedicated recruitment landing page detailing 12-day time-to-hire ROI, pre-screened developer profiles, direct comparison with traditional job portals, and hiring CTAs. |
| **About Us (`About.tsx`)** | The Developer-First Manifesto, mission, 18,500+ engineer community metrics, core values, dual-sided ecosystem breakdown, and tech stack highlights. |
| **Contact Support (`Contact.tsx`)** | Multi-channel support desk (candidate, employer, security triage), interactive message dispatch form with category selection, and headquarters info. |

---

## 👨‍💻 Candidate Portal

A comprehensive career hub for developers to track applications, manage resumes, and optimize recruiter visibility:

- **Dashboard Overview (`Overview.tsx`):** Real-time application metrics (Total, In Review, Interviewing, Offered), saved job counter, profile strength indicator, and recent activity log.
- **My Applications (`MyApplications.tsx`):** Real-time application tracking connected directly to MongoDB (`/api/applications/my-applications`). Displays status badges (`Submitted`, `Under Review`, `Interviewing`, `Offered`, `Not Selected`), stage progress timeline, notes, candidate info inspector, and 1-click application withdrawal.
- **Interactive Application Modal (`ApplyJobModal.tsx`):** 1-click modal that autofills candidate info, accepts resume link, portfolio, GitHub, years of experience, and cover note, saving directly to MongoDB.
- **My Profile (`MyProfile.tsx`):** Developer bio, professional headline, years of experience, remote/hybrid preferences, GitHub, LinkedIn, and portfolio link manager connected to backend REST APIs.
- **Saved Jobs (`SavedJobs.tsx`):** Bookmarked developer roles with a 1-click Quick Apply action that automatically synchronizes with active applications.
- **My Resume (`MyResume.tsx`):** Drag-and-drop resume upload zone (PDF/DOCX), automated ATS compatibility analyzer (90%+), and an **in-page embedded PDF document viewer** with instant download and replace.
- **Skills Manager (`Skills.tsx`):** Technical and soft skills manager with proficiency tiers (`Beginner`, `Intermediate`, `Advanced`, `Expert`), star ratings, category groupings, and quick-add suggestions.
- **Work Experience (`Experience.tsx`):** Career timeline with company names, roles, employment types, technologies used, achievements, and add/edit/delete modals.
- **Education & Certifications (`Education.tsx`):** Academic degree history and professional certifications (AWS, Meta, GCP) manager.
- **Account Settings (`Settings.tsx`):** Profile information updates, password change security form, and job alert preferences.

---

## 🏢 Recruiter & Employer Portal

Equips hiring teams and technical recruiters with tools to source and evaluate software talent:

- **Analytics Overview (`Overview.tsx`):** 
  - **Application Inflow Graph:** Multi-bar chart with gradient pillars and Weekly/Monthly toggle to track applicant volume.
  - **ATS Pipeline Funnel Graph:** 5-stage conversion visualization from *Applied (100%)* to *Offer Extended (7%)*.
  - **Tech Stack Distribution Graph:** Multi-segment breakdown of candidate competencies (Full Stack, Backend, Frontend, DevOps, Mobile).
  - **Recruiter Capability Hub:** 4 one-click workflow triggers (*Post Job*, *Manage Listings*, *Review Candidates*, *Update Brand*).
- **Post a Job (`PostJob.tsx`):** Multi-step job authoring form with salary bands, tech tags, experience level, workplace model, and live candidate preview modal connected to `POST /api/jobs`.
- **Manage Jobs (`ManageJobs.tsx`):** Centralized job dashboard with real-time search, filters, inline edit modal (`PATCH /api/jobs/:id`), status toggling, and deletion (`DELETE /api/jobs/:id`).
- **Company Profile (`YourProfile.tsx`):** Manage corporate bio, hiring locations, tech stacks, benefits, team size, website, and recruiter details.

---

## 🛡️ Admin Control Center

Comprehensive platform moderation and user governance:

- **Analytics Overview:** High-level metrics showing total registered candidates, verified recruiters, active jobs, and platform health.
- **User Management (`UserManagement.tsx`):** Directory of all registered users with **instant inline role switching** (`ADMIN`, `EMPLOYER`, `CANDIDATE`) and active status toggling.
- **Recruiter Management (`RecruiterManagement.tsx`):** Directory of employer accounts with verification badges, registered emails, and live job counts.
- **Job Moderation (`JobManagement.tsx`):** Full moderation table where administrators review pending job posts, approve or reject listings, inspect details, or remove obsolete posts.
- **Platform Configuration (`Settings.tsx`):** Platform-wide maintenance toggles, security rules, and admin credentials.

---

## 🛠️ Tech Stack & Libraries

### Frontend
- **Framework:** React 19 + TypeScript (Strict Mode)
- **Build Tool:** Vite v8
- **Styling:** Tailwind CSS v4 + DaisyUI v5
- **Icons:** Lucide React
- **Smooth Scrolling:** Lenis Scroll
- **Routing:** React Router v7 (`react-router-dom`)
- **State & Auth:** React Context API + Local Storage Persistence

### Backend
- **Runtime:** Node.js (LTS)
- **Framework:** Express.js 5 (TypeScript)
- **Database:** MongoDB via Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs password hashing
- **Development Tooling:** `ts-node-dev` with hot-reloading

---

## 📂 Project Structure

```text
Job-Portal/
├── backend/
│   ├── src/
│   │   ├── config/             # DB connection (connectDB) & env variables
│   │   ├── constants/          # Enums (Role: ADMIN, EMPLOYER, CANDIDATE)
│   │   ├── middlewares/        # authMiddleware, roleMiddleware, error/notFound
│   │   ├── modules/
│   │   │   ├── application/    # Application model, service, controller, routes
│   │   │   ├── auth/           # Login, register, JWT controllers & routes
│   │   │   ├── job/            # Job CRUD, public list & admin moderation
│   │   │   └── user/           # User profile & role switching service
│   │   ├── routes/             # Centralized Express router mounting (/api)
│   │   ├── types/              # Common & Express typing definitions
│   │   ├── utils/              # catchAsync, response helpers, JWT sign/verify
│   │   ├── app.ts              # Express middleware and app config
│   │   └── server.ts           # Server bootstrap and port listener
│   ├── .env                    # Backend environment secrets
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # ApplyJobModal, Navbar, Footer, ProtectedRoute, FAQ
│   │   ├── context/            # AuthContext & role session management
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/
│   │   │   ├── home/           # Landing page sections & CTA
│   │   │   ├── dashboard/
│   │   │   │   ├── admin/      # Admin moderation & user management
│   │   │   │   ├── candidate/  # MyApplications, MyResume, MyProfile, Skills, SavedJobs
│   │   │   │   └── recruiter/  # Overview (Graphs), PostJob, ManageJobs, YourProfile
│   │   │   ├── Jobs.tsx        # Public searchable job list & Apply triggers
│   │   │   ├── Companies.tsx   # Tech company directory
│   │   │   ├── Salaries.tsx    # Interactive salary estimator
│   │   │   ├── Resources.tsx   # Engineering playbooks & guides
│   │   │   ├── Employers.tsx   # For Employers recruitment suite & comparison
│   │   │   ├── About.tsx       # Developer-first manifesto & platform story
│   │   │   ├── Contact.tsx     # Multi-channel support desk & message form
│   │   │   ├── Login.tsx       # Auth login page
│   │   │   └── Register.tsx    # Registration with role selection (Candidate/Employer)
│   │   ├── services/           # Typed api() fetch client with JWT Bearer header
│   │   ├── App.tsx             # Route declarations
│   │   └── main.tsx            # DOM root mounting
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas URI)
- **Git**

---

### 1. Clone the Repository

```bash
git clone https://github.com/MDSOBUJMADBOR/DevHire-Developer-Job-Portal.git
cd DevHire-Developer-Job-Portal
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/job-portal
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the backend server in development mode:

```bash
npm run dev
```

The backend server will start at: `http://localhost:5000`

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at: `http://localhost:5173`

---

### 4. Production Build Verification

To verify that all TypeScript types, bundler configurations, and assets compile without errors:

```bash
cd frontend
npm run build
```

---

## 📡 API Endpoints Overview

### Authentication & Users
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Candidate or Employer |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/users` | Admin | Fetch registered users directory |
| `PATCH` | `/api/users/:id` | Authenticated | Update user profile, contact info, or admin role change |

### Jobs Management
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Fetch approved job listings (supports query & category) |
| `GET` | `/api/jobs/my-jobs` | Employer / Admin | Fetch jobs posted by the logged-in user |
| `GET` | `/api/jobs/admin/all` | Admin | Fetch all jobs (including Pending, Approved, Rejected) |
| `GET` | `/api/jobs/:id` | Public | Fetch single job listing details |
| `POST` | `/api/jobs` | Employer / Admin | Post a new developer job |
| `PATCH` | `/api/jobs/:id` | Employer / Admin | Update job details (Ownership protected) |
| `DELETE`| `/api/jobs/:id` | Employer / Admin | Delete a job listing (Ownership protected) |

### Applications & ATS
| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications` | Authenticated | Submit candidate application to MongoDB |
| `GET` | `/api/applications/my-applications` | Authenticated | Fetch candidate's own submitted applications |
| `GET` | `/api/applications/all` | Employer / Admin | Fetch all incoming applications across postings |
| `GET` | `/api/applications/:id` | Authenticated | Retrieve single application details |
| `DELETE`| `/api/applications/:id` | Authenticated | Withdraw / remove job application |

---

## 🤝 Contributing

Contributions, issues, and feature suggestions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request targeting the `development` branch

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author & Contact

**MD Sobuj Madbor**
- **GitHub:** [@MDSOBUJMADBOR](https://github.com/MDSOBUJMADBOR)
- **Repository:** [DevHire-Developer-Job-Portal](https://github.com/MDSOBUJMADBOR/DevHire-Developer-Job-Portal)
- **Portfolio:** [Visit Portfolio](https://md-sobuj-madbor-portflio.vercel.app)

<div align="center">
  <sub>Built with ❤️ by MD Sobuj Madbor for developers worldwide.</sub>
</div>
