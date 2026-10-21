import { useState, useEffect, type FormEvent } from "react";
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  Award,
  CheckCircle2,
} from "lucide-react";

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade?: string;
  activities?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
}

const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: "edu-1",
    degree: "Bachelor of Science in Computer Science",
    institution: "University of California, Berkeley",
    fieldOfStudy: "Software Engineering & Distributed Systems",
    startYear: "2018",
    endYear: "2022",
    grade: "GPA: 3.85 / 4.0",
    activities:
      "Dean's Honor List, President of Open Source Club, Teaching Assistant for Data Structures and Algorithms.",
  },
  {
    id: "edu-2",
    degree: "High School Diploma (Advanced Science Track)",
    institution: "Oakland Technical Academy",
    fieldOfStudy: "Computer Science & Mathematics",
    startYear: "2014",
    endYear: "2018",
    grade: "Honor Roll",
    activities: "Robotics Team Captain, Math Olympiad Regional Winner.",
  },
];

const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "cert-1",
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    issueDate: "Mar 2024",
    credentialId: "AWS-SAA-8392019",
  },
  {
    id: "cert-2",
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    issueDate: "Nov 2023",
    credentialId: "META-FED-55291",
  },
];

const Education = () => {
  const [educationList, setEducationList] = useState<EducationItem[]>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_education");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EDUCATION;
  });

  const [certifications, setCertifications] = useState<CertificationItem[]>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_certifications");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CERTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<"education" | "certifications">("education");
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Education Form state
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [grade, setGrade] = useState("");
  const [activities, setActivities] = useState("");

  // Certification Form state
  const [certName, setCertName] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certId, setCertId] = useState("");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(
      "devhire_candidate_education",
      JSON.stringify(educationList)
    );
  }, [educationList]);

  useEffect(() => {
    localStorage.setItem(
      "devhire_candidate_certifications",
      JSON.stringify(certifications)
    );
  }, [certifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddEdu = () => {
    setEditingEduId(null);
    setDegree("");
    setInstitution("");
    setFieldOfStudy("");
    setStartYear("");
    setEndYear("");
    setGrade("");
    setActivities("");
    setEduModalOpen(true);
  };

  const openEditEdu = (item: EducationItem) => {
    setEditingEduId(item.id);
    setDegree(item.degree);
    setInstitution(item.institution);
    setFieldOfStudy(item.fieldOfStudy);
    setStartYear(item.startYear);
    setEndYear(item.endYear);
    setGrade(item.grade || "");
    setActivities(item.activities || "");
    setEduModalOpen(true);
  };

  const handleDeleteEdu = (id: string, name: string) => {
    if (window.confirm(`Delete education record for "${name}"?`)) {
      setEducationList((prev) => prev.filter((e) => e.id !== id));
      showToast(`Removed education record.`);
    }
  };

  const handleSaveEdu = (e: FormEvent) => {
    e.preventDefault();
    if (!degree.trim() || !institution.trim()) return;

    if (editingEduId) {
      setEducationList((prev) =>
        prev.map((item) =>
          item.id === editingEduId
            ? {
                ...item,
                degree: degree.trim(),
                institution: institution.trim(),
                fieldOfStudy: fieldOfStudy.trim(),
                startYear: startYear.trim(),
                endYear: endYear.trim(),
                grade: grade.trim(),
                activities: activities.trim(),
              }
            : item
        )
      );
      showToast(`Updated education details.`);
    } else {
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        degree: degree.trim(),
        institution: institution.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        startYear: startYear.trim(),
        endYear: endYear.trim(),
        grade: grade.trim(),
        activities: activities.trim(),
      };
      setEducationList((prev) => [newItem, ...prev]);
      showToast(`Added ${degree.trim()}`);
    }

    setEduModalOpen(false);
  };

  const openAddCert = () => {
    setEditingCertId(null);
    setCertName("");
    setCertIssuer("");
    setCertDate("");
    setCertId("");
    setCertModalOpen(true);
  };

  const openEditCert = (cert: CertificationItem) => {
    setEditingCertId(cert.id);
    setCertName(cert.name);
    setCertIssuer(cert.issuer);
    setCertDate(cert.issueDate);
    setCertId(cert.credentialId || "");
    setCertModalOpen(true);
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm("Delete this certification?")) {
      setCertifications((prev) => prev.filter((c) => c.id !== id));
      showToast("Removed certification.");
    }
  };

  const handleSaveCert = (e: FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certIssuer.trim()) return;

    if (editingCertId) {
      setCertifications((prev) =>
        prev.map((c) =>
          c.id === editingCertId
            ? {
                ...c,
                name: certName.trim(),
                issuer: certIssuer.trim(),
                issueDate: certDate.trim(),
                credentialId: certId.trim(),
              }
            : c
        )
      );
      showToast("Updated certification.");
    } else {
      const newCert: CertificationItem = {
        id: `cert-${Date.now()}`,
        name: certName.trim(),
        issuer: certIssuer.trim(),
        issueDate: certDate.trim(),
        credentialId: certId.trim(),
      };
      setCertifications((prev) => [newCert, ...prev]);
      showToast(`Added ${certName.trim()}`);
    }

    setCertModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
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
              Education & Certifications
            </h1>
            <span className="badge badge-primary badge-soft font-bold text-xs px-2.5 py-1">
              {educationList.length + certifications.length} Records
            </span>
          </div>
          <p className="mt-1 text-sm text-base-content/60">
            Showcase your academic qualifications, university degrees, and verified technical certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {activeTab === "education" ? (
            <button
              type="button"
              onClick={openAddEdu}
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Degree
            </button>
          ) : (
            <button
              type="button"
              onClick={openAddCert}
              className="btn btn-primary btn-sm rounded-xl font-bold gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-base-300 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("education")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "education"
              ? "bg-primary text-primary-content shadow-xs"
              : "text-base-content/70 hover:bg-base-200"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Degrees ({educationList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("certifications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "certifications"
              ? "bg-primary text-primary-content shadow-xs"
              : "text-base-content/70 hover:bg-base-200"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certifications ({certifications.length})</span>
        </button>
      </div>

      {/* Education Tab Content */}
      {activeTab === "education" && (
        <div>
          {educationList.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100/50">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-base-content">
                No educational history recorded
              </h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
                Add your universities, colleges, or coding bootcamps.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={openAddEdu}
                  className="btn btn-primary btn-sm rounded-xl font-bold"
                >
                  Add Your Degree
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {educationList.map((edu) => (
                <div
                  key={edu.id}
                  className="p-5 sm:p-6 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-sm transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-lg shrink-0 border border-primary/20">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base sm:text-lg text-base-content">
                          {edu.degree}
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-base-content/65 mt-1">
                          <span className="flex items-center gap-1 font-bold text-base-content/85">
                            <Building2 className="w-3.5 h-3.5 text-base-content/40" />
                            {edu.institution}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-base-content/70">
                            {edu.fieldOfStudy}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <Calendar className="w-3.5 h-3.5" />
                            {edu.startYear} – {edu.endYear}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => openEditEdu(edu)}
                        className="btn btn-xs btn-ghost border border-base-300 rounded-xl gap-1 font-bold hover:bg-base-200"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEdu(edu.id, edu.degree)}
                        className="btn btn-xs btn-ghost text-error/80 hover:text-error hover:bg-error/10 rounded-xl p-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {edu.grade && (
                    <div className="sm:pl-16">
                      <span className="badge badge-sm badge-success badge-soft font-bold text-xs">
                        {edu.grade}
                      </span>
                    </div>
                  )}

                  {edu.activities && (
                    <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed sm:pl-16">
                      {edu.activities}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certifications Tab Content */}
      {activeTab === "certifications" && (
        <div>
          {certifications.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-base-300 bg-base-100/50">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-base-200 flex items-center justify-center text-base-content/40 mb-3">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-base-content">
                No certifications added
              </h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto mt-1">
                Add AWS, GCP, Azure, or industry developer certifications.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={openAddCert}
                  className="btn btn-primary btn-sm rounded-xl font-bold"
                >
                  Add Certification
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-3xl border border-base-300 bg-base-100 hover:border-primary/40 hover:shadow-sm transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditCert(cert)}
                          className="btn btn-xs btn-ghost text-base-content/70 hover:text-base-content p-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCert(cert.id)}
                          className="btn btn-xs btn-ghost text-error/70 hover:text-error p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-base-content">
                        {cert.name}
                      </h4>
                      <p className="text-xs font-semibold text-primary mt-0.5">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-base-content/60 pt-2 border-t border-base-200">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Issued {cert.issueDate}
                    </span>
                    {cert.credentialId && (
                      <span className="font-mono text-[11px] font-semibold text-base-content/50">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Education Modal */}
      {eduModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Academic History
                </span>
                <h3 className="text-xl font-black mt-0.5">
                  {editingEduId ? "Edit Degree" : "Add Degree"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEduModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Degree / Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Institution / University *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University, MIT, CodeSmith"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Field of Study
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineering, Informatics"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Start Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2018"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-base-content/80">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2022"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  GPA / Grade / Honors (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3.8 / 4.0 or Magna Cum Laude"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Relevant Coursework & Achievements
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Algorithms & Complexity, Operating Systems, Cloud Architecture..."
                  value={activities}
                  onChange={(e) => setActivities(e.target.value)}
                  className="textarea textarea-bordered w-full rounded-xl mt-1 text-xs sm:text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEduModalOpen(false)}
                  className="btn btn-sm btn-ghost rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary rounded-xl font-bold px-5"
                >
                  Save Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Certification Modal */}
      {certModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl border border-base-300 max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Professional License
                </span>
                <h3 className="text-xl font-black mt-0.5">
                  {editingCertId ? "Edit Certification" : "Add Certification"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCertModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Certification Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services, Google Cloud, Meta"
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Issue Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mar 2024"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-base-content/80">
                  Credential ID or Verification URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS-SAA-8392019"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-xl mt-1 text-xs sm:text-sm font-semibold focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCertModalOpen(false)}
                  className="btn btn-sm btn-ghost rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary rounded-xl font-bold px-5"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;
