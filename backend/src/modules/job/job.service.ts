import { Job } from "./job.model";
import { ICreateJob } from "./job.interface";
import { Role } from "../../constants/role";

const createJob = async (data: ICreateJob, userId: string) => {
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
  });
};

const getAllJobs = async () => {
  return Job.find().sort({ createdAt: -1 });
};

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

  if (role !== Role.ADMIN && job.postedBy !== userId) {
    throw new Error("Forbidden");
  }

  // Only admins can change approval status
  if (role !== Role.ADMIN) {
    delete data.status;
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

  if (role !== Role.ADMIN && job.postedBy !== userId) {
    throw new Error("Forbidden");
  }

  return Job.findByIdAndDelete(id);
};

export const jobService = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};
