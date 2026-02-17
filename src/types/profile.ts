
import z from "zod";

// Validation schema
export const profileSchema = z.object({
  userName: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email(),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export interface ChangePasswordRequest{
    currentPassword:string;
    newPassword:string;
    confirmNewPassword:string;
}

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, 'Current password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
    confirmNewPassword: z.string().min(6, 'Confirm password must be at least 6 characters long'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm password do not match',
    path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;