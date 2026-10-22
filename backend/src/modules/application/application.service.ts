import { Application } from "./application.model";
import { ICreateApplicationInput } from "./application.interface";
import { Role } from "../../constants/role";

const createApplication = async (
  data: ICreateApplicationInput,
  userId: string
) => {
  // If jobId exists, check if user already applied to this specific job
  if (data.jobId) {
    const existing = await Application.findOne({
      jobId: data.jobId,
      candidateId: userId,
    });
    if (existing) {
      throw new Error("You have already applied for this job.");
    }
  }

  const application = await Application.create({
    jobId: data.jobId || null,
    candidateId: userId,
    jobTitle: data.jobTitle,
    company: data.company,
    location: data.location,
    salary: data.salary || "Negotiable",
    type: data.type || "Full-time",
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    resumeUrl: data.resumeUrl || "",
    portfolioUrl: data.portfolioUrl || "",
    githubUrl: data.githubUrl || "",
    coverNote: data.coverNote || "",
    experience: data.experience || "",
    status: "applied",
  });

  return application;
};

const getMyApplications = async (userId: string) => {
  return Application.find({ candidateId: userId }).sort({ createdAt: -1 });
};

const getAllApplications = async () => {
  return Application.find().sort({ createdAt: -1 });
};

const getApplicationById = async (id: string, userId: string, role?: string) => {
  const application = await Application.findById(id);
  if (!application) return null;

  const isAdmin = (role || "").toUpperCase() === Role.ADMIN;
  const isOwner = application.candidateId === userId;

  if (!isAdmin && !isOwner) {
    throw new Error("Forbidden");
  }

  return application;
};

const withdrawApplication = async (
  id: string,
  userId: string,
  role?: string
) => {
  const application = await Application.findById(id);
  if (!application) {
    return null;
  }

  const isAdmin = (role || "").toUpperCase() === Role.ADMIN;
  const isOwner = application.candidateId === userId;

  if (!isAdmin && !isOwner) {
    throw new Error("Forbidden");
  }

  return Application.findByIdAndDelete(id);
};

export const applicationService = {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  withdrawApplication,
};
