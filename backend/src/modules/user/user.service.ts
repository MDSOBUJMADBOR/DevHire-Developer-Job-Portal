import { User } from "./user.model";
import { Role } from "../../constants/role";

const getAllUsers = async () => {
  return User.find().select("-password").sort({ createdAt: -1 });
};

const getUserById = async (id: string) => {
  return User.findById(id).select("-password");
};

const updateUser = async (
  id: string,
  data: Record<string, unknown>
) => {
  if (data.role && typeof data.role === "string") {
    const r = data.role.toUpperCase();
    if (r === "RECRUITER" || r === "EMPLOYER") {
      data.role = Role.EMPLOYER;
    } else if (r === "ADMIN") {
      data.role = Role.ADMIN;
    } else if (r === "CANDIDATE") {
      data.role = Role.CANDIDATE;
    }
  }

  return User.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};

const deleteUser = async (id: string) => {
  return User.findByIdAndDelete(id);
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};