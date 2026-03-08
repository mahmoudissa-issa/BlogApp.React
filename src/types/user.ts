import type { Role } from './auth';

export interface User {
  id: number;
  userName: string;
  email: string;
  fullName?: string | null;
  roleName: Role;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface CreateUserRequest {
  userName: string;
  email: string;
  fullName: string;
  password: string;
  roleId: number;
  avatar?: File | null;
}

export interface UpdateUserRequest {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  password?: string;
  roleId: number;
  avatar?: File | null;
}
