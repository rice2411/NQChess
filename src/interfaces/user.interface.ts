export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export interface IUser {
  id: string;
  username: string;
  role: EUserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: EUserRole;
}

export interface UpdateUserRequest {
  username?: string;
  role?: EUserRole;
}
