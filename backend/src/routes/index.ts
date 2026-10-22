import { Router } from "express";

import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import jobRoutes from "../modules/job/job.route";
import applicationRoutes from "../modules/application/application.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);

export default router;