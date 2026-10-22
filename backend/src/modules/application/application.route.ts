import { Router } from "express";
import { applicationController } from "./application.controller";
import { catchAsync } from "../../utils/catchAsync";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "../../constants/role";

const router = Router();

// Candidate retrieves their own submitted applications
router.get(
  "/my-applications",
  authMiddleware,
  catchAsync(applicationController.getMyApplications)
);

// Admin or Employer gets all applications
router.get(
  "/all",
  authMiddleware,
  roleMiddleware(Role.ADMIN, Role.EMPLOYER),
  catchAsync(applicationController.getAllApplications)
);

// Get single application
router.get(
  "/:id",
  authMiddleware,
  catchAsync(applicationController.getApplicationById)
);

// Submit new application (requires login)
router.post(
  "/",
  authMiddleware,
  catchAsync(applicationController.createApplication)
);

// Withdraw application
router.delete(
  "/:id",
  authMiddleware,
  catchAsync(applicationController.withdrawApplication)
);

export default router;
