import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { CreateCommentRequest,Comment} from "../types/post";


export const commentApi={

    async getByPostId(postId:number):Promise<Comment[]>{
        const res= await axiosInstance.get(API_ENDPOINTS.COMMENTS.GET_BY_POST(postId));
        return res.data.result;
    },
    
    async create(comment:CreateCommentRequest):Promise<Comment>{
        const res= await axiosInstance.post(API_ENDPOINTS.COMMENTS.CREATE, comment);
        return res.data.result;
    }
}