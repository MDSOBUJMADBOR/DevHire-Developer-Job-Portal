
import { Job } from "./job.model";
import type { ICreateJob } from "./job.interface";
import { Role } from "../../constants/role";

const createJob = async (
  data: ICreateJob,
  userId: string
) => {
  return Job.create({
    title: data.title,
    category: data.category,
    company: data.company,
    location: data.location,
    workplace: data.workplace,
    type: data.type,
    level: data.level,
    salary: data.salary ?? null,
    skills: data.skills ?? [],
    description: data.description,
    requirements: data.requirements ?? "",
    deadline: data.deadline || null,
    contactEmail: data.contactEmail,
    postedBy: userId,
    status: "pending",
    isActive: true,
  });
};

// Public listing: approved jobs only
const getAllJobs = async () => {
  return Job.find({
    status: "approved",
    isActive: true,
  }).sort({ createdAt: -1 });
};

// Recruiter/Employer: list all jobs posted by current user
const getMyJobs = async (userId: string) => {
  return Job.find({ postedBy: userId }).sort({ createdAt: -1 });
};

// Admin or public detail access should be controlled
// in the controller/service according to your policy.
const getJobById = async (id: string) => {
  return Job.findById(id);
};

const updateJob = async (
  id: string,
  data: Record<string, unknown>,
  userId: string,
  role: string
) => {
  const job = await Job.findById(id);

  if (!job) {
    return null;
  }

  const isAdmin = role === Role.ADMIN;
  const isOwner = job.postedBy.toString() === userId;

  if (!isAdmin && !isOwner) {
    throw new Error("Forbidden");
  }

  // Never allow clients to change ownership.
  delete data.postedBy;

  if (!isAdmin) {
    // Only admins can change these fields.
    delete data.status;
    delete data.isActive;
  }

  return Job.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

const deleteJob = async (
  id: string,
  userId: string,
  role: string
) => {
  const job = await Job.findById(id);

  if (!job) {
    return null;
  }

  const isAdmin = role === Role.ADMIN;
  const isOwner = job.postedBy.toString() === userId;

  if (!isAdmin && !isOwner) {
    throw new Error("Forbidden");
  }

  return Job.findByIdAndDelete(id);
};

export const jobService = {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
};
