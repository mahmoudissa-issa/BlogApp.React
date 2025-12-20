import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { Tag } from "../types/tag";


export const tagsAPI={

    // Add tag API methods here in the future
    async getAll():Promise<Tag[]>{  
        const res= await axiosInstance.get(API_ENDPOINTS.TAGS.GET_ALL);
        return res.data.result;
    }
};