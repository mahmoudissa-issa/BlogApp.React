import z from "zod";
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

/* ── Zod schemas for User form validation ── */
export const createUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleId: z.number(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().optional(),
  password: z.string().optional().refine(
    (val) => !val || val.length >= 6,
    { message: "Password must be at least 6 characters" },
  ),
  roleId: z.number(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

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
