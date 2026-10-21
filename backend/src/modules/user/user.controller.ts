import { Request, Response } from "express";
import { userService } from "./user.service";
import { successResponse } from "../../utils/response";

const getAllUsers = async (
  req: Request,
  res: Response
) => {
  const users = await userService.getAllUsers();

  return successResponse(
    res,
    200,
    "Users retrieved successfully",
    users
  );
};

const getUserById = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params as { id: string };
  const user = await userService.getUserById(id);

  return successResponse(
    res,
    200,
    "User retrieved successfully",
    user
  );
};

const updateUser = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params as { id: string };
  const user = await userService.updateUser(
    id,
    req.body
  );

  return successResponse(
    res,
    200,
    "User updated successfully",
    user
  );
};

const deleteUser = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params as { id: string };
  await userService.deleteUser(id);

  return successResponse(
    res,
    200,
    "User deleted successfully"
  );
};

export const userController = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};