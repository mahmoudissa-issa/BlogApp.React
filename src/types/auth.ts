import z from "zod";

export type Role='Reader' | 'Author' | 'Admin';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthResponse {
    userId:number;
    userName:string;
    email:string;
    role:Role;
    token:string;
}

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginFormData = z.infer<typeof loginSchema>; 

export const registerSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters long'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;