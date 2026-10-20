import { Router } from "express";
import { jobController } from "./job.controller";
import { catchAsync } from "../../utils/catchAsync";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "../../constants/role";

const router = Router();

router.get("/", catchAsync(jobController.getAllJobs));

router.get(
  "/my-jobs",
  authMiddleware,
  roleMiddleware(Role.EMPLOYER, Role.ADMIN),
  catchAsync(jobController.getMyJobs)
);

router.get("/:id", catchAsync(jobController.getJobById));

router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.EMPLOYER, Role.ADMIN),
  catchAsync(jobController.createJob)
);

router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.EMPLOYER, Role.ADMIN),
  catchAsync(jobController.updateJob)
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.EMPLOYER, Role.ADMIN),
  catchAsync(jobController.deleteJob)
);

export default router;
