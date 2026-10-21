import { useState, useEffect, useRef, type ChangeEvent, type DragEvent } from "react";
import {
  FileText,
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Calendar,
  ShieldCheck,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

interface ResumeData {
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  atsScore: number;
  fileUrl?: string;
}

const DEFAULT_RESUME: ResumeData = {
  fileName: "Resume_Developer_FullStack.pdf",
  fileSize: "284 KB",
  fileType: "application/pdf",
  uploadedAt: "Oct 18, 2026",
  atsScore: 92,
};

const MyResume = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [resume, setResume] = useState<ResumeData | null>(() => {
    try {
      const saved = localStorage.getItem("devhire_candidate_resume");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_RESUME;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resume) {
      try {
        localStorage.setItem("devhire_candidate_resume", JSON.stringify(resume));
      } catch (err) {
        // If fileUrl exceeds localStorage quota, save metadata without large fileUrl
        const { fileUrl, ...rest } = resume;
        localStorage.setItem("devhire_candidate_resume", JSON.stringify(rest));
      }
    } else {
      localStorage.removeItem("devhire_candidate_resume");
    }
  }, [resume]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProcessFile = (file: File) => {
    const validExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      alert("Invalid file format. Please upload a PDF or DOCX document.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert("File size exceeds 8MB limit. Please upload a smaller file.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    // Read file as Data URL or Object URL for instant in-page rendering
    const objectUrl = URL.createObjectURL(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              setUploadProgress(0);
              const sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
              setResume({
                fileName: file.name,
                fileSize: sizeStr,
                fileType: file.type || (fileExt === ".pdf" ? "application/pdf" : "application/octet-stream"),
                uploadedAt: new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }),
                atsScore: Math.floor(Math.random() * 10) + 90,
                fileUrl: dataUrl || objectUrl,
              });
              showToast("Resume uploaded successfully! Preview is displayed below. 🎉");
            }, 300);
            return 100;
          }
          return prev + 25;
        });
      }, 120);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDownload = () => {
    if (!resume) return;
    const element = document.createElement("a");
    if (resume.fileUrl) {
      element.href = resume.fileUrl;
    } else {
      const file = new Blob(
        [
          `Candidate Resume: ${user?.name || "Developer"}\nEmail: ${
            user?.email || "dev@devhire.com"
          }\nPosition: Senior Software Engineer\nPlatform: DevHire.`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
    }
    element.download = resume.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast(`Downloading "${resume.fileName}"...`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your current resume?")) {
      setResume(null);
      showToast("Resume deleted.");
    }
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
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
            My Resume
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            Upload, view, and inspect your developer resume right here on your dashboard.
          </p>
        </div>

        {resume && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary btn-sm rounded-xl font-bold gap-2 self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Replace Resume
          </button>
        )}
      </div>

      {/* Upload Drag & Drop Box */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-base-300 bg-base-100 hover:border-primary/40 hover:bg-base-200/30"
        }`}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-3">
          <Upload className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-base-content">
          {isDragging
            ? "Drop your resume file here"
            : resume
            ? "Click or drag to upload / replace your resume"
            : "Upload your resume (PDF or DOCX)"}
        </h3>
        <p className="mt-1 text-xs text-base-content/60">
          Supported file formats: PDF, DOCX (Max size: 8MB)
        </p>

        {isUploading && (
          <div className="max-w-xs mx-auto mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-primary">
              <span>Uploading & Parsing Document...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Active Resume Card (if present) */}
      {resume && (
        <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-base-content">
                    {resume.fileName}
                  </h3>
                  <span className="badge badge-success badge-soft font-bold text-xs">
                    Active Resume
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/60 mt-1">
                  <span className="flex items-center gap-1 font-medium">
                    <HardDrive className="w-3.5 h-3.5" />
                    {resume.fileSize}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Uploaded on {resume.uploadedAt}
                  </span>
                </div>
              </div>
            </div>

            {/* ATS Score Meter */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/60 border border-base-300 self-start md:self-auto">
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                  ATS Score
                </p>
                <p className="text-xl font-black text-primary leading-none mt-0.5">
                  {resume.atsScore}%
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-base-200">
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-sm btn-primary rounded-xl font-bold gap-2 text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Resume
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-sm btn-ghost text-error/80 hover:text-error hover:bg-error/10 rounded-xl font-bold gap-2 text-xs ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Embedded Resume In-Page Viewer */}
      {resume && (
        <div className="rounded-3xl border border-base-300 bg-base-100 overflow-hidden shadow-sm space-y-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-base-200 bg-base-200/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-base-content">
                  Resume Document Preview
                </h3>
                <p className="text-[11px] text-base-content/60">
                  {resume.fileName} • Showing active document
                </p>
              </div>
            </div>

            {resume.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-xs btn-ghost gap-1.5 font-bold text-xs text-primary hover:bg-primary/10 rounded-lg"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Fullscreen
              </a>
            )}
          </div>

          <div className="p-4 sm:p-6 bg-base-200/20">
            {resume.fileUrl && (resume.fileType?.includes("pdf") || resume.fileName.toLowerCase().endsWith(".pdf")) ? (
              <iframe
                src={resume.fileUrl}
                className="w-full h-[650px] sm:h-[800px] rounded-2xl border border-base-300 shadow-sm bg-white"
                title="Candidate Resume Preview"
              />
            ) : (
              /* High-fidelity Candidate Resume Sheet View */
              <div className="max-w-3xl mx-auto rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-10 shadow-sm font-sans space-y-6">
                <div className="text-center border-b border-base-300 pb-5">
                  <h2 className="text-2xl font-black text-base-content tracking-tight">
                    {user?.name || "Developer Name"}
                  </h2>
                  <p className="text-sm font-bold text-primary mt-1">
                    Senior Software & Full Stack Engineer
                  </p>
                  <p className="text-xs text-base-content/65 mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                    <span>{user?.email || "candidate@devhire.com"}</span>
                    <span>•</span>
                    <span>github.com/{user?.name?.toLowerCase().replace(/\s+/g, "") || "developer"}</span>
                    <span>•</span>
                    <span>Remote / Global</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70 border-b border-base-300 pb-1.5 mb-2.5">
                    Professional Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                    Results-oriented Full Stack Engineer specializing in scalable React and Node.js microservices. Proven track record of architecting performant web applications, optimizing database queries, and collaborating in high-velocity agile sprints.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70 border-b border-base-300 pb-1.5 mb-2.5">
                    Core Technical Competencies
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-base-content/80">
                    <p>
                      <strong>Frontend:</strong> React 19, TypeScript, Next.js, Tailwind CSS, Redux
                    </p>
                    <p>
                      <strong>Backend:</strong> Node.js, Express, REST APIs, Python, Go
                    </p>
                    <p>
                      <strong>Databases:</strong> PostgreSQL, MongoDB, Redis, Prisma
                    </p>
                    <p>
                      <strong>DevOps & Cloud:</strong> Docker, Kubernetes, AWS, CI/CD, Git
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70 border-b border-base-300 pb-1.5 mb-2.5">
                    Work Experience Highlights
                  </h4>
                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <div className="flex justify-between font-bold text-base-content">
                        <span>Senior Frontend Engineer — MetaScale Tech</span>
                        <span className="text-xs text-base-content/50 font-normal">2024 – Present</span>
                      </div>
                      <p className="text-xs text-base-content/70 mt-0.5">
                        Led migration to Next.js reducing page load latency by 42%. Architected scalable UI components adopted across 15+ microfrontends.
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between font-bold text-base-content">
                        <span>Full Stack Developer — DevSprint Labs</span>
                        <span className="text-xs text-base-content/50 font-normal">2022 – 2024</span>
                      </div>
                      <p className="text-xs text-base-content/70 mt-0.5">
                        Designed WebSocket APIs and PostgreSQL data pipelines handling 2M+ daily requests. Integrated secure payment processing with Stripe.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-base-content/70 border-b border-base-300 pb-1.5 mb-2.5">
                    Education & Credentials
                  </h4>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <div>
                      <p className="font-bold text-base-content">B.S. in Computer Science</p>
                      <p className="text-xs text-base-content/60">University of California, Berkeley • GPA: 3.85</p>
                    </div>
                    <span className="text-xs text-base-content/50">Graduated 2022</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Developer Resume Recommendations / ATS Tips */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-warning/15 text-warning flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-base-content">
              ATS Optimization Checklist for Developers
            </h3>
            <p className="text-xs text-base-content/60">
              Increase your interview callback rate with these proven formatting standards.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>Quantify Engineering Impact</span>
            </div>
            <p className="text-base-content/70 pl-6">
              Instead of "Built API endpoints", write "Engineered microservice reducing latency by 45% for 2M daily requests".
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>Keyword Tech Stacks</span>
            </div>
            <p className="text-base-content/70 pl-6">
              List specific tools and frameworks: React 19, TypeScript, Node.js, PostgreSQL, Docker, AWS.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>Single Column Clean Layout</span>
            </div>
            <p className="text-base-content/70 pl-6">
              Modern ATS scanners parse single-column text resumes better than complex multi-column graphics.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-base-200/50 border border-base-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-success">
              <CheckCircle2 className="w-4 h-4" />
              <span>GitHub & Live Demo Links</span>
            </div>
            <p className="text-base-content/70 pl-6">
              Recruiters prioritize candidates with clickable links to production apps or open source code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyResume;
