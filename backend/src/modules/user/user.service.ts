import { User } from "./user.model";

const getAllUsers = async () => {
  return User.find().select("-password");
};

const getUserById = async (id: string) => {
  return User.findById(id).select("-password");
};

const updateUser = async (
  id: string,
  data: Record<string, unknown>
) => {
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