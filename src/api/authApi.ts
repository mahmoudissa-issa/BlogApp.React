import type { Register } from "react-router-dom";
import { axiosInstance } from "../services/axiosInstance";
import type { AuthResponse } from "../types/auth";
import type { APIResponse } from "../types/api";

export interface LoginDto {email:string;password:string;}
export interface RegisterDto  {userName:string;email:string;password:string;confirmPassword:string;fullName?:string;}
export interface ChangePasswordDto {currentPassword:string;newPassword:string;confirmPassword:string;}

export const authAPI ={
    login:async (dto:LoginDto):Promise<AuthResponse> =>
    {
        var res=await axiosInstance.post("/api/auth/login", dto);
       return res.data.result;
    },
    register:async (dto:RegisterDto):Promise<AuthResponse> =>
    {
        var res=await axiosInstance.post("/api/auth/register", dto);
        return res.data.result;
    }
}