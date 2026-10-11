import { useState, type FormEvent } from "react";
import { api } from "../../../services/api";

const CATEGORIES = [
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "MERN Stack Developer",
  "Junior Software Developer",
  "Software Developer",
  "Senior Frontend Developer",
  "Senior Software Developer",
  "Junior Frontend Developer",
];

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [workplace, setWorkplace] = useState("Remote");
  const [type, setType] = useState("Full-time");
  const [level, setLevel] = useState("Mid");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [deadline, setDeadline] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [posting, setPosting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCategory(CATEGORIES[0]);
    setCompany("");
    setLocation("");
    setWorkplace("Remote");
    setType("Full-time");
    setLevel("Mid");
    setSalaryMin("");
    setSalaryMax("");
    setSkills("");
    setDescription("");
    setRequirements("");
    setDeadline("");
    setContactEmail("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
      setError("Minimum salary cannot be greater than maximum salary.");
      return;
    }

    const jobData = {
      title: title.trim(),
      category,
      company: company.trim(),
      location: location.trim(),
      workplace,
      type,
      level,
      salary:
        salaryMin || salaryMax
          ? {
              min: salaryMin ? Number(salaryMin) : null,
              max: salaryMax ? Number(salaryMax) : null,
              currency: "USD",
            }
          : null,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: description.trim(),
      requirements: requirements.trim(),
      deadline: deadline || null,
      contactEmail: contactEmail.trim(),
    };

    console.log("job post:", jobData);

    setPosting(true);

    try {
      const result = await api("/jobs", {
        method: "POST",
        body: JSON.stringify(jobData),
      });

      console.log("job saved:", result);

      setSuccess(`"${jobData.title}" posted to the database!`);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to post job"
      );
    } finally {
      setPosting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-base-300 bg-base-100 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-base-content/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-semibold";

  return (
    <div>
      <h1 className="text-2xl font-bold">Post a Job</h1>
      <p className="mt-2 text-base-content/60">
        Create and publish a new job opening.
      </p>

      {error && (
        <div className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass}>Job Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Company *</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Nexora"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Location *</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote / New York"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Workplace *</label>
            <select
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
              className={inputClass}
            >
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Employment Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Experience Level *</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className={inputClass}
            >
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
              <option>Lead</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Application Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Min Salary (USD / year)</label>
            <input
              type="number"
              min={0}
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 120000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max Salary (USD / year)</label>
            <input
              type="number"
              min={0}
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g. 155000"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Skills (comma separated)</label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, TypeScript, Node.js"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Job Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Role overview, responsibilities, team…"
            required
            rows={5}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className={labelClass}>Requirements</label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Must-have qualifications, nice-to-haves…"
            rows={4}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div>
          <label className={labelClass}>Contact Email *</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="hiring@company.com"
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={posting}
            className="btn btn-primary rounded-xl px-8 font-bold disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post Job"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-ghost rounded-xl border border-base-300 px-8 font-bold"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
