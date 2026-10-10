import { Router } from "express";
import { authController } from "./auth.controller";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.post(
  "/register",
  catchAsync(authController.register)
);

router.post(
  "/login",
  catchAsync(authController.login)
);

export default router;