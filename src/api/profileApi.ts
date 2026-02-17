import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { ChangePasswordRequest } from "../types/profile";
import type { User } from "../types/user";

export const profileApi={

    UpdateProfile:async(data:{fullName:string}):Promise<string>=>{
        const res=await axiosInstance.put(API_ENDPOINTS.PROFILE.UPDATE_PROFILE, data);
        return res.data.result;
    },
    changePassword:async(dto:ChangePasswordRequest):Promise<string>=>{
        const res=await axiosInstance.put(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, dto);
        return res.data.result;
    },

    uploadAvatar:async(file:File):Promise<string>=>{
        const formData = new FormData();
        formData.append('file', file);
        const res = await axiosInstance.post(API_ENDPOINTS.PROFILE.UPLOAD_AVATAR, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.result;
    },

    getProfileINfo:async():Promise<User>=>{
        const res=await axiosInstance.get(API_ENDPOINTS.PROFILE.GET_PROFILE_INFO);
        return res.data.result;
    }
}