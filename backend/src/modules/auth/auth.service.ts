import { User } from "../user/user.model";
import { hashPassword, comparePassword } from "../../utils/password";
import { createToken } from "../../utils/jwt";
import { Role } from "../../constants/role";
import { ILogin, IRegister } from "./auth.interface";

const register = async (data: IRegister) => {
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const password = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password,
    role: data.role || Role.CANDIDATE,
  });

  const token = createToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const login = async (data: ILogin) => {
  const user = await User.findOne({
    email: data.email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = createToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const authService = {
  register,
  login,
};