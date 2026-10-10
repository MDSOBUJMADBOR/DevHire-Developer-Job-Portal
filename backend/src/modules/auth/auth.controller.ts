import { Request, Response } from "express";
import { authService } from "./auth.service";
import { validateRegister } from "./auth.validation";
import { successResponse } from "../../utils/response";

const register = async (
  req: Request,
  res: Response
) => {
  validateRegister(req.body);

  const result = await authService.register(
    req.body
  );

  return successResponse(
    res,
    201,
    "Registration successful",
    result
  );
};

const login = async (
  req: Request,
  res: Response
) => {
  const result = await authService.login(
    req.body
  );

  return successResponse(
    res,
    200,
    "Login successful",
    result
  );
};

export const authController = {
  register,
  login,
};