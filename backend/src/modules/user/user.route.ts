import { Router } from "express";
import { userController } from "./user.controller";
import { catchAsync } from "../../utils/catchAsync";

const router = Router();

router.get(
  "/",
  catchAsync(userController.getAllUsers)
);

router.get(
  "/:id",
  catchAsync(userController.getUserById)
);

router.patch(
  "/:id",
  catchAsync(userController.updateUser)
);

router.delete(
  "/:id",
  catchAsync(userController.deleteUser)
);

export default router;