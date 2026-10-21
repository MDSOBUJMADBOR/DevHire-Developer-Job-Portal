import { Request, Response } from "express";
import { jobService } from "./job.service";
import { validateCreateJob } from "./job.validation";
import { successResponse } from "../../utils/response";

const createJob = async (req: Request, res: Response) => {
  validateCreateJob(req.body);

  const job = await jobService.createJob(
    req.body,
    req.user!.userId
  );

  return successResponse(res, 201, "Job posted successfully", job);
};

const getAllJobs = async (req: Request, res: Response) => {
  const jobs = await jobService.getAllJobs();

  return successResponse(
    res,
    200,
    "Jobs retrieved successfully",
    jobs
  );
};

const getAllJobsAdmin = async (req: Request, res: Response) => {
  const jobs = await jobService.getAllJobsAdmin();

  return successResponse(
    res,
    200,
    "All jobs retrieved successfully for admin",
    jobs
  );
};

const getMyJobs = async (req: Request, res: Response) => {
  const jobs = await jobService.getMyJobs(req.user!.userId);

  return successResponse(
    res,
    200,
    "My jobs retrieved successfully",
    jobs
  );
};

const getJobById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const job = await jobService.getJobById(id);

  return successResponse(
    res,
    200,
    "Job retrieved successfully",
    job
  );
};

const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const job = await jobService.updateJob(
    id,
    req.body,
    req.user!.userId,
    req.user!.role
  );

  return successResponse(res, 200, "Job updated successfully", job);
};

const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  await jobService.deleteJob(
    id,
    req.user!.userId,
    req.user!.role
  );

  return successResponse(res, 200, "Job deleted successfully");
};

export const jobController = {
  createJob,
  getAllJobs,
  getAllJobsAdmin,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
};
