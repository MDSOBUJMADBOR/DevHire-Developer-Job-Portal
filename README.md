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

**DevHire** is a full-stack, developer-first recruitment and job discovery platform. Designed specifically for software engineers, engineering leaders, and modern tech companies, DevHire bridges the gap between top engineering talent and high-growth teams with salary transparency, rich developer profiles, interactive salary estimators, and dedicated role-based portals.

[Explore Jobs](#-public-portal--features) • [Candidate Suite](#-candidate-portal) • [Recruiter Suite](#-recruiter--employer-portal) • [Admin Control Center](#-admin-control-center) • [Setup Guide](#-getting-started)

</div>

---

## 🌟 Key Highlights & Architecture

- **Full-Stack MERN Architecture:** Built with React 19, TypeScript, Node.js/Express, and MongoDB with strict typing.
- **Role-Based Access Control (RBAC):** Three distinct portals for **Candidates**, **Recruiters (Employers)**, and **Admins**.
- **Modern Responsive Design System:** Tailwind CSS v4 paired with DaisyUI v5 for ultra-fast performance, dark/light compatibility, and 100% mobile responsiveness.
- **Real-Time Data Integration:** Connected to RESTful backend endpoints (`/api/jobs`, `/api/users`, `/api/auth`) with JWT authentication.
- **Interactive Tools:** In-page PDF resume document previewer, live developer salary calculator, and technical playbook reader modal.

---

## 🖥️ Public Portal & Features

| Page | Description |
| :--- | :--- |
| **Landing Page (`Home.tsx`)** | Dynamic hero section, search bar, live featured jobs from REST API, trusted companies carousel, value propositions, and candidate testimonials. |
| **Job Search & Filters (`Jobs.tsx`)** | Real-time search by keywords, category pill filters (`Frontend`, `Backend`, `Full Stack`, `DevOps`, etc.), workplace model dropdown (`Remote`, `Hybrid`, `On-site`), job type, and job details drawer. |
| **Top Companies (`Companies.tsx`)** | Directory of 18+ vetted tech teams (Stripe, OpenAI, Vercel, Supabase, Datadog) with tech stack tags, work models, compensation benchmarks, and open role counters. |
| **Salary Guide (`Salaries.tsx`)** | Interactive **Developer Salary Estimator Widget**, compensation benchmarks, demand indices, and instant toggle between **Grid Cards** and **Detailed Table View**. |
| **Engineering Playbooks (`Resources.tsx`)** | Technical interview cheatsheets, ATS resume templates, and system design roadmaps with an interactive reader modal. |

---

## 👨‍💻 Candidate Portal

A comprehensive career hub for developers to track applications, manage resumes, and optimize recruiter visibility:

- **Dashboard Overview (`Overview.tsx`):** Real-time application metrics (Total, In Review, Interviewing, Offered), saved job counter, profile strength indicator, and recent activity log.
- **My Profile (`MyProfile.tsx`):** Developer bio, professional headline, years of experience, remote/hybrid preferences, GitHub, LinkedIn, and portfolio link manager connected to backend REST APIs.
- **My Applications (`MyApplications.tsx`):** Application tracking table/cards with status badges (`Under Review`, `Interviewing`, `Offered`, `Not Selected`), stage timeline modal, notes, and application withdrawal.
- **Saved Jobs (`SavedJobs.tsx`):** Bookmarked developer roles with a 1-click **Quick Apply** modal that automatically synchronizes with active applications.
- **My Resume (`MyResume.tsx`):** Drag-and-drop resume upload zone (PDF/DOCX), automated ATS compatibility analyzer (90%+), and an **in-page embedded PDF document viewer** with instant download and replace.
- **Skills Manager (`Skills.tsx`):** Technical and soft skills manager with proficiency tiers (`Beginner`, `Intermediate`, `Advanced`, `Expert`), star ratings, category groupings, and quick-add suggestions.
- **Work Experience (`Experience.tsx`):** Career timeline with company names, roles, employment types, technologies used, achievements, and add/edit/delete modals.
- **Education & Certifications (`Education.tsx`):** Academic degree history and professional certifications (AWS, Meta, GCP) manager.
- **Account Settings (`Settings.tsx`):** Profile information updates, password change security form, and job alert preferences.

---

## 🏢 Recruiter & Employer Portal

Equips hiring teams and technical recruiters with tools to source and evaluate software talent:

- **Recruiter Overview:** Live candidate applicants count, active job posts metrics, and hiring pipeline status.
- **Company Profile:** Manage corporate bio, hiring locations, tech stacks, benefits, and logo.
- **Post a Job:** Multi-step job authoring form with salary bands, tech tags, experience level, and workplace setup.
- **Manage Jobs:** Centralized job dashboard with options to edit listings, change status (`Open`, `Paused`, `Closed`), and view incoming applications.
- **Applicant Tracking System (ATS):** Review applicant resumes, stage interviews, change candidate statuses, and take internal hiring notes.

---

## 🛡️ Admin Control Center

Comprehensive platform moderation and user governance:

- **Analytics Overview:** High-level metrics showing total registered candidates, verified recruiters, active jobs, and platform health.
- **User Management:** Directory of all registered users with **instant inline role switching** (`Admin`, `Recruiter`, `Candidate`) and active status toggling.
- **Recruiter Management:** Directory of employer accounts with verification badges, registered emails, and live job counts.
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
- **Framework:** Express.js (TypeScript)
- **Database:** MongoDB via Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) + bcrypt password hashing
- **Development Tooling:** `ts-node-dev` with hot-reloading

---

## 📂 Project Structure

```text
Job-Portal/
├── backend/
│   ├── src/
│   │   ├── config/             # DB & environment configs
│   │   ├── constants/          # Enums (Role, Job status, etc.)
│   │   ├── middlewares/        # Auth verify & role guards
│   │   ├── modules/
│   │   │   ├── auth/           # Login, register, JWT controllers & routes
│   │   │   ├── job/            # Job CRUD, public list & admin endpoints
│   │   │   └── user/           # User profile & role switching service
│   │   └── server.ts           # Express app bootstrap
│   ├── .env                    # Backend environment secrets
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProtectedRoute, Modals
│   │   ├── context/            # AuthContext & role session management
│   │   ├── layouts/            # MainLayout, DashboardLayout
│   │   ├── pages/
│   │   │   ├── home/           # Landing page sections
│   │   │   ├── dashboard/
│   │   │   │   ├── admin/      # Admin moderation & user management
│   │   │   │   ├── candidate/  # Candidate applications, resume & profile
│   │   │   │   └── recruiter/  # Job posting & applicant reviews
│   │   │   ├── Jobs.tsx        # Public searchable job list
│   │   │   ├── Companies.tsx   # Tech company directory
│   │   │   ├── Salaries.tsx    # Interactive salary estimator
│   │   │   ├── Resources.tsx   # Engineering playbooks & guides
│   │   │   ├── Login.tsx       # Auth login page
│   │   │   └── Register.tsx    # Registration with role selection
│   │   ├── services/           # Axios/Fetch API client with auth token
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

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Candidate or Employer |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/jobs` | Public | Fetch approved job listings (supports query & category) |
| `GET` | `/api/jobs/admin/all` | Admin | Fetch all jobs (including Pending, Approved, Rejected) |
| `POST` | `/api/jobs` | Employer / Admin | Post a new developer job |
| `PATCH` | `/api/jobs/:id/status`| Admin | Moderate job status (`APPROVED`, `REJECTED`, etc.) |
| `DELETE`| `/api/jobs/:id` | Admin / Employer | Delete a job listing |
| `GET` | `/api/users` | Admin | Fetch registered users directory |
| `PATCH` | `/api/users/:id` | Authenticated | Update user profile, contact info, or admin role change |

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
