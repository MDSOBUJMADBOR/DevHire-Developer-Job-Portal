import { useState, useEffect, type FormEvent } from "react";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Building2,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
}

const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Senior Frontend Engineer",
    company: "MetaScale Technologies",
    employmentType: "Full-time",
    location: "San Francisco, CA (Remote)",
    startDate: "Jan 2024",
    endDate: "Present",
    isCurrent: true,
    description:
      "Led client architecture migration to Next.js 14 and React 19. Reduced initial page load times by 42% and implemented design system components used by 15+ engineering teams.",
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
  },
  {
    id: "exp-2",
    role: "Full Stack Developer",
    company: "DevSprint Labs",
    employmentType: "Full-time",
    location: "Austin, TX (Hybrid)",
    startDate: "Mar 2022",
    endDate: "Dec 2023",
    isCurrent: false,
    description:
      "Designed and deployed scalable REST and WebSocket APIs using Node.js, Express, and PostgreSQL. Integrated Stripe payment subscriptions and automated CI/CD workflows using GitHub Actions.",
    technologies: ["Node.js", "Express", "PostgreSQL", "Docker", "Redis", "AWS"],
  },
  {
    id: "exp-3",
    role: "Junior Web Developer",
    company: "ByteWave Studios",
    employmentType: "Full-time",
    location: "New York, NY",
    startDate: "Jun 2020",
    endDate: "Feb 2022",
    isCurrent: false,
    description:
      "Collaborated on building responsive customer dashboards and e-commerce web applications. Wrote automated unit and integration tests achieving 85% test coverage.",
    technologies: ["JavaScript", "React", "HTML5/CSS3", "Git", "Jest"],
  },
];

const Experience = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_experience");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EXPERIENCES;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(
      "devhire_candidate_experience",
      JSON.stringify(experiences)
    );
  }, [experiences]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingId(null);
    setRole("");
    setCompany("");
    setEmploymentType("Full-time");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setIsCurrent(false);
    setDescription("");
    setTechInput("");
    setModalOpen(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setEmploymentType(exp.employmentType);
    setLocation(exp.location);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate);
    setIsCurrent(exp.isCurrent);
    setDescription(exp.description);
    setTechInput(exp.technologies.join(", "));
    setModalOpen(true);
  };

  const handleDelete = (id: string, roleTitle: string) => {
    if (window.confirm(`Delete experience record for "${roleTitle}"?`)) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      showToast(`Removed experience entry: ${roleTitle}`);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;

    const techs = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingId) {
      setExperiences((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                role: role.trim(),
                company: company.trim(),
                employmentType,
                location: location.trim(),
                startDate: startDate.trim(),
                endDate: isCurrent ? "Present" : endDate.trim(),
                isCurrent,
                description: description.trim(),
                technologies: techs,
              }
            : item
        )
      );
      showToast(`Updated experience: ${role.trim()}`);
    } else {
      const newExp: ExperienceItem = {
        id: `exp-${Date.now()}`,
        role: role.trim(),
        company: company.trim(),
        employmentType,
        location: location.trim(),
        startDate: startDate.trim(),
        endDate: isCurrent ? "Present" : endDate.trim(),
        isCurrent,
        description: description.trim(),
        technologies: techs,
      };
      setExperiences((prev) => [newExp, ...prev]);
      showToast(`Added experience: ${role.trim()} at ${company.trim()}`);
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="alert alert-success shadow-lg fixed bottom-6 right-6 z-50 max-w-md animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
              Work Experience
            </h1>
            <span className="badge badge-primary badge-soft font-bold text-xs px-2.5 py-1">
              {experiences.length} Positions
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/60">
            Document your professional software engineering career history, key achievements, and tools used.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* Timeline List */}
      {experiences.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-base-content">
            No work experience recorded
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
            Add your previous employment or contract work to improve candidate ranking.
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={openAddModal}
              className="btn btn-primary btn-sm rounded-xl font-bold"
            >
              Add First Position
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-5 sm:p-6 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-sm transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-lg shrink-0 border border-primary/20">
                    {exp.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-base-content">
                        {exp.role}
                      </h3>
                      {exp.isCurrent && (
                        <span className="badge badge-success badge-soft font-bold text-xs gap-1">
                          <Clock className="w-3 h-3" />
                          Current Role
                        </span>
                      )}
                      <span className="badge badge-sm badge-ghost font-semibold">
                        {exp.employmentType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-base-content/65 mt-1">
                      <span className="flex items-center gap-1 font-bold text-base-content/85">
                        <Building2 className="w-3.5 h-3.5 text-base-content/40" />
                        {exp.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-base-content/40" />
                        {exp.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-start">
                  <button
                    type="button"
                    onClick={() => openEditModal(exp)}
                    className="btn btn-xs btn-ghost border border-base-300 rounded-xl gap-1 font-bold hover:bg-base-200"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id, exp.role)}
                    className="btn btn-xs btn-ghost text-error/80 hover:text-error hover:bg-error/10 rounded-xl p-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {exp.description && (
                <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed pl-1 sm:pl-16">
                  {exp.description}
                </p>
              )}

              {/* Technologies */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 sm:pl-16">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-base-200 text-[11px] font-semibold text-base-content/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Experience Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[92vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Career Record
                </span>
                <h3 className="text-xl font-black mt-0.5">
                  {editingId ? "Edit Work Experience" : "Add Work Experience"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Employment Type
                  </label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="select select-sm select-bordered w-full rounded-xl mt-1 text-xs font-semibold focus:border-primary"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jan 2023"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    End Date
                  </label>
                  <input
                    type="text"
                    disabled={isCurrent}
                    placeholder={isCurrent ? "Present" : "e.g. Dec 2024"}
                    value={isCurrent ? "Present" : endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="currentJobCheckbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="checkbox checkbox-primary checkbox-sm rounded-md"
                />
                <label
                  htmlFor="currentJobCheckbox"
                  className="text-xs font-semibold text-base-content/80 cursor-pointer"
                >
                  I currently work in this role
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Key Achievements & Responsibilities
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your engineering impact, teams led, performance optimizations, and metrics delivered..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-xl mt-1 text-xs sm:text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Technologies Used (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Node.js, AWS, Docker"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-sm btn-ghost rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary rounded-xl font-bold px-5"
                >
                  {editingId ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;
