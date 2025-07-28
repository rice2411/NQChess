export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export interface IUser {
  id: string;
  username: string;
  fullName: string;
  role: EUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  role: EUserRole;
}

export interface UpdateUserRequest {
  username?: string;
  fullName?: string;
  role?: EUserRole;
}
