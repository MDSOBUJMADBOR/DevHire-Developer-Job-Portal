import { useState, useEffect, type FormEvent } from "react";
import {
  Code2,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Search,
  Zap,
} from "lucide-react";

export type SkillCategory = "Frontend" | "Backend" | "Databases & Cloud" | "Tools & Soft Skills";
export type ProficiencyLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsOfExp: number;
}

const DEFAULT_SKILLS: SkillItem[] = [
  { id: "sk-1", name: "React 19", category: "Frontend", proficiency: "Expert", yearsOfExp: 5 },
  { id: "sk-2", name: "TypeScript", category: "Frontend", proficiency: "Expert", yearsOfExp: 4 },
  { id: "sk-3", name: "Tailwind CSS", category: "Frontend", proficiency: "Expert", yearsOfExp: 4 },
  { id: "sk-4", name: "Next.js", category: "Frontend", proficiency: "Advanced", yearsOfExp: 3 },
  { id: "sk-5", name: "Node.js", category: "Backend", proficiency: "Advanced", yearsOfExp: 4 },
  { id: "sk-6", name: "Express.js", category: "Backend", proficiency: "Advanced", yearsOfExp: 4 },
  { id: "sk-7", name: "PostgreSQL", category: "Databases & Cloud", proficiency: "Intermediate", yearsOfExp: 3 },
  { id: "sk-8", name: "MongoDB", category: "Databases & Cloud", proficiency: "Advanced", yearsOfExp: 4 },
  { id: "sk-9", name: "Docker", category: "Databases & Cloud", proficiency: "Intermediate", yearsOfExp: 2 },
  { id: "sk-10", name: "Git & GitHub", category: "Tools & Soft Skills", proficiency: "Expert", yearsOfExp: 5 },
  { id: "sk-11", name: "System Design", category: "Tools & Soft Skills", proficiency: "Advanced", yearsOfExp: 3 },
  { id: "sk-12", name: "Agile / Scrum", category: "Tools & Soft Skills", proficiency: "Advanced", yearsOfExp: 4 },
];

const SUGGESTED_SKILLS = [
  { name: "Python", category: "Backend" as SkillCategory },
  { name: "GraphQL", category: "Backend" as SkillCategory },
  { name: "Redis", category: "Databases & Cloud" as SkillCategory },
  { name: "AWS", category: "Databases & Cloud" as SkillCategory },
  { name: "Kubernetes", category: "Databases & Cloud" as SkillCategory },
  { name: "Vue.js", category: "Frontend" as SkillCategory },
  { name: "CI/CD", category: "Tools & Soft Skills" as SkillCategory },
  { name: "Jest / Vitest", category: "Tools & Soft Skills" as SkillCategory },
];

const CATEGORIES: SkillCategory[] = [
  "Frontend",
  "Backend",
  "Databases & Cloud",
  "Tools & Soft Skills",
];

const PROFICIENCIES: ProficiencyLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const Skills = () => {
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_skills");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SKILLS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New skill form state
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Frontend");
  const [newSkillProficiency, setNewSkillProficiency] = useState<ProficiencyLevel>("Advanced");
  const [newSkillYears, setNewSkillYears] = useState<number>(2);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("devhire_candidate_skills", JSON.stringify(skills));
  }, [skills]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddSkill = (e: FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const exists = skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) {
      alert(`"${newSkillName}" is already in your skills list.`);
      return;
    }

    const created: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      yearsOfExp: Number(newSkillYears) || 1,
    };

    setSkills((prev) => [...prev, created]);
    setNewSkillName("");
    setModalOpen(false);
    showToast(`Added ${created.name} (${created.proficiency}) to your skills!`);
  };

  const handleQuickAddSuggested = (suggested: { name: string; category: SkillCategory }) => {
    const exists = skills.some(
      (s) => s.name.toLowerCase() === suggested.name.toLowerCase()
    );
    if (exists) return;

    const created: SkillItem = {
      id: `sk-${Date.now()}`,
      name: suggested.name,
      category: suggested.category,
      proficiency: "Advanced",
      yearsOfExp: 2,
    };

    setSkills((prev) => [...prev, created]);
    showToast(`Added ${created.name} to skills!`);
  };

  const handleRemoveSkill = (id: string, name: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    showToast(`Removed ${name}.`);
  };

  const handleProficiencyChange = (id: string, newLevel: ProficiencyLevel) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, proficiency: newLevel } : s))
    );
  };

  const filteredSkills = skills.filter((item) => {
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getProficiencyBadge = (level: ProficiencyLevel) => {
    switch (level) {
      case "Expert":
        return "badge-primary text-primary-content";
      case "Advanced":
        return "badge-accent badge-soft font-bold";
      case "Intermediate":
        return "badge-warning badge-soft font-bold";
      case "Beginner":
        return "badge-ghost font-semibold";
    }
  };

  const getStars = (level: ProficiencyLevel) => {
    const count =
      level === "Expert" ? 4 : level === "Advanced" ? 3 : level === "Intermediate" ? 2 : 1;
    return (
      <div className="flex items-center gap-0.5 text-warning">
        {Array.from({ length: 4 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < count ? "fill-warning text-warning" : "text-base-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
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
              Skills & Proficiencies
            </h1>
            <span className="badge badge-primary badge-soft font-bold text-xs px-2.5 py-1">
              {skills.length} Total
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/60">
            Showcase your technical capabilities and mastery level to recruiter screening algorithms.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      {/* Skills Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-base-300 bg-base-100 shadow-xs">
          <p className="text-xs font-semibold text-base-content/60 uppercase">
            Total Skills
          </p>
          <p className="text-2xl font-black mt-1 text-base-content">{skills.length}</p>
        </div>
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 shadow-xs">
          <p className="text-xs font-semibold text-primary uppercase">
            Expert Level
          </p>
          <p className="text-2xl font-black mt-1 text-primary">
            {skills.filter((s) => s.proficiency === "Expert").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-accent/20 bg-accent/5 shadow-xs">
          <p className="text-xs font-semibold text-accent uppercase">
            Advanced
          </p>
          <p className="text-2xl font-black mt-1 text-accent">
            {skills.filter((s) => s.proficiency === "Advanced").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-warning/20 bg-warning/5 shadow-xs">
          <p className="text-xs font-semibold text-warning uppercase">
            Intermediate / Novice
          </p>
          <p className="text-2xl font-black mt-1 text-warning">
            {skills.filter((s) => s.proficiency === "Intermediate" || s.proficiency === "Beginner").length}
          </p>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-base-200/50 border border-base-300">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search skills by name (e.g. React, Docker, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm w-full pl-9 rounded-xl bg-base-100 border-base-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-xs rounded-xl font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "btn-primary"
                    : "btn-ghost bg-base-100 border border-base-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Quick Add Section */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-base-content/70">
          <span className="flex items-center gap-1 font-bold text-base-content/90">
            <Zap className="w-3.5 h-3.5 text-warning" />
            Suggested Additions:
          </span>
          {SUGGESTED_SKILLS.filter(
            (sug) => !skills.some((s) => s.name.toLowerCase() === sug.name.toLowerCase())
          ).slice(0, 5).map((sug) => (
            <button
              key={sug.name}
              type="button"
              onClick={() => handleQuickAddSuggested(sug)}
              className="badge badge-outline hover:badge-primary cursor-pointer transition-colors font-semibold text-xs py-2 gap-1"
            >
              <Plus className="w-3 h-3" />
              {sug.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
            <Code2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-base-content">
            No skills found
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
            {searchQuery
              ? "No skill matches your search query."
              : "No skills recorded in this category yet."}
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-primary btn-sm rounded-xl font-bold"
            >
              Add First Skill
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="group p-4 rounded-2xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-sm transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-base-content group-hover:text-primary transition-colors">
                    {skill.name}
                  </h4>
                  <p className="text-[11px] text-base-content/50 font-medium">
                    {skill.category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id, skill.name)}
                  title="Remove skill"
                  className="btn btn-xs btn-ghost text-error/70 hover:text-error hover:bg-error/10 rounded-lg p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-base-200 text-xs">
                <div>{getStars(skill.proficiency)}</div>

                {/* Inline proficiency switcher */}
                <select
                  value={skill.proficiency}
                  onChange={(e) =>
                    handleProficiencyChange(
                      skill.id,
                      e.target.value as ProficiencyLevel
                    )
                  }
                  className={`select select-xs rounded-lg font-bold border-none text-[11px] ${getProficiencyBadge(
                    skill.proficiency
                  )}`}
                >
                  {PROFICIENCIES.map((p) => (
                    <option key={p} value={p} className="bg-base-100 text-base-content font-semibold">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] text-base-content/60">
                <span>Experience:</span>
                <span className="font-bold text-base-content/80">
                  {skill.yearsOfExp} {skill.yearsOfExp === 1 ? "year" : "years"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Skill Inventory
                </span>
                <h3 className="text-xl font-black mt-0.5">Add New Skill</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js, Kubernetes, Tailwind, Python"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Category *
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                  className="select select-sm select-bordered w-full rounded-xl mt-1 text-xs font-semibold focus:border-primary"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Proficiency Level *
                </label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as ProficiencyLevel)}
                  className="select select-sm select-bordered w-full rounded-xl mt-1 text-xs font-semibold focus:border-primary"
                >
                  {PROFICIENCIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={newSkillYears}
                  onChange={(e) => setNewSkillYears(Number(e.target.value))}
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
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
