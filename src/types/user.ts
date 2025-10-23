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
