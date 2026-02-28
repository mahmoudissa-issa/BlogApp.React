
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { AuthResponse } from "../types/auth";


export interface LoginDto {email:string;password:string;}
export interface RegisterDto  {userName:string;email:string;password:string;confirmPassword:string;fullName?:string;roleName?:string;}
export interface ChangePasswordDto {currentPassword:string;newPassword:string;confirmPassword:string;}
export interface ForgotPasswordDto {email:string;}
export interface ResetPasswordDto {token:string;email:string;newPassword:string;confirmPassword:string;}
export interface ResendVerificationDto {email:string;}

export const authAPI ={
    login:async (dto:LoginDto):Promise<AuthResponse> =>
    {
        const res=await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, dto);
       return res.data.result;
    },
    register:async (dto:RegisterDto):Promise<AuthResponse> =>
    {
        const res=await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, dto);
        return res.data.result;
    },
    forgotPassword:async (dto:ForgotPasswordDto):Promise<void> =>
    {
        await axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, dto);
    },
    resetPassword:async (dto:ResetPasswordDto):Promise<void> =>
    {
        await axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, dto);
    },
    verifyEmail:async (token:string):Promise<AuthResponse> =>
    {
        const res=await axiosInstance.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL(token));
        return res.data.result;
    },
    resendVerification:async (dto:ResendVerificationDto):Promise<{message:string}> =>
    {
        const res=await axiosInstance.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, dto);
        return res.data;
    },
}