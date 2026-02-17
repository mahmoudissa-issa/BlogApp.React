
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { AuthResponse } from "../types/auth";


export interface LoginDto {email:string;password:string;}
export interface RegisterDto  {userName:string;email:string;password:string;confirmPassword:string;fullName?:string;roleName?:string;}
export interface ChangePasswordDto {currentPassword:string;newPassword:string;confirmPassword:string;}

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
    }
}