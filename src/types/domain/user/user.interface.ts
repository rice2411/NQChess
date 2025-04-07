export interface IUser {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
}
