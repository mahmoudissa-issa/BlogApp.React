import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { CreatePostRequest, Post, UpdatePostRequest } from "../types/post";


export const postApi={
  async getAll():Promise<Post[]>{
    const res= await axiosInstance.get(API_ENDPOINTS.POSTS.GET_ALL);
    return res.data.result;
  },
  async getByUser(userId: number): Promise<Post[]> {
    const res = await axiosInstance.get(API_ENDPOINTS.POSTS.GET_BY_USER(userId));
    return res.data.result;
  },
  async getById(id:number):Promise<Post>{
    const res= await axiosInstance.get(API_ENDPOINTS.POSTS.GET_BY_ID(id));
    return res.data.result;
  },

  async create(post:CreatePostRequest):Promise<Post>{
    const formData=new FormData();
    if(post.postImage) formData.append("PostImage", post.postImage);

    const params = new URLSearchParams();
    params.append("Title", post.title);
    params.append("Content", post.content);
    params.append("AuthorId", post.authorId.toString());
    params.append("CategoryId", post.categoryId.toString());
    post.tagNames.forEach(name => params.append("TagNames", name));

    const res= await axiosInstance.post(
      `${API_ENDPOINTS.POSTS.CREATE}?${params.toString()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.result;
  },

  async update(post:UpdatePostRequest):Promise<Post>{
    const formData=new FormData();
    if(post.postImage) formData.append("PostImage", post.postImage);

    const params = new URLSearchParams();
    params.append("Id", post.id.toString());
    params.append("Title", post.title);
    params.append("Content", post.content);
    params.append("AuthorId", post.authorId.toString());
    params.append("CategoryId", post.categoryId.toString());
    post.tagNames.forEach(name => params.append("TagNames", name));

    const res= await axiosInstance.put(
      `${API_ENDPOINTS.POSTS.UPDATE}?${params.toString()}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.result;
  },
  async delete(id:number):Promise<string>{
    const res=await axiosInstance.delete(`/api/posts/${id}`);
    return res.data.result;
  }

}