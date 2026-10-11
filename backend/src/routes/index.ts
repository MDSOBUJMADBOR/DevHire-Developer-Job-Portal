import { Router } from "express";

import authRoutes from "../modules/auth/auth.route";
import userRoutes from "../modules/user/user.route";
import jobRoutes from "../modules/job/job.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);

export default router;