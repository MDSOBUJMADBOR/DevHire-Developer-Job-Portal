import { Role } from "../../constants/role";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  avatar?: string;
  isActive: boolean;
}