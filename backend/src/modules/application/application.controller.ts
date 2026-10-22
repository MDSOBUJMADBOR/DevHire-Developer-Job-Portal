import { Request, Response } from "express";
import { applicationService } from "./application.service";
import { successResponse, errorResponse } from "../../utils/response";

const createApplication = async (req: Request, res: Response) => {
  const { fullName, email, phone, jobTitle, company, location } = req.body;

  if (!fullName || !email || !phone || !jobTitle || !company || !location) {
    return errorResponse(
      res,
      400,
      "Full name, email, phone, job title, company, and location are required."
    );
  }

  const userId = req.user!.userId;
  const application = await applicationService.createApplication(
    req.body,
    userId
  );

  return successResponse(
    res,
    201,
    "Application submitted successfully",
    application
  );
};

const getMyApplications = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const applications = await applicationService.getMyApplications(userId);

  return successResponse(
    res,
    200,
    "My applications retrieved successfully",
    applications
  );
};

const getAllApplications = async (req: Request, res: Response) => {
  const applications = await applicationService.getAllApplications();

  return successResponse(
    res,
    200,
    "All applications retrieved successfully",
    applications
  );
};

const getApplicationById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user!.userId;
  const role = req.user!.role;

  const application = await applicationService.getApplicationById(
    id,
    userId,
    role
  );

  if (!application) {
    return errorResponse(res, 404, "Application not found");
  }

  return successResponse(
    res,
    200,
    "Application retrieved successfully",
    application
  );
};

const withdrawApplication = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const userId = req.user!.userId;
  const role = req.user!.role;

  const deleted = await applicationService.withdrawApplication(id, userId, role);

  if (!deleted) {
    return errorResponse(res, 404, "Application not found");
  }

  return successResponse(res, 200, "Application withdrawn successfully");
};

export const applicationController = {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  withdrawApplication,
};
