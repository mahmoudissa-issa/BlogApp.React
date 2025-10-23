import { axiosInstance } from "../services/axiosInstance";
import type { CreatePostRequest, Post, UpdatePostRequest } from "../types/post";


export const postApi={
  async getAll():Promise<Post[]>{
    const res= await axiosInstance.get("/api/posts");
    return res.data.result;
  },
  async getById(id:number):Promise<Post>{
    const res= await axiosInstance.get(`/api/posts/${id}`);
    return res.data.result;
  },

  async create(post:CreatePostRequest):Promise<Post>{
    const formData=new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("authorId", post.authorId.toString());
    formData.append("categoryId", post.categoryId.toString());
    post.tagIds.forEach(tagId=> formData.append("tagIds", tagId.toString()));
    if(post.postImage) formData.append("postImage", post.postImage);
    const res= await axiosInstance.post("/api/posts", formData,{headers:{"Content-Type":"multipart/form-data"}});
    return res.data.result;
  },

  async update(post:UpdatePostRequest):Promise<Post>{
    const formData=new FormData();
    formData.append("id", post.id.toString());
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("authorId", post.authorId.toString());
    formData.append("categoryId", post.categoryId.toString());
    post.tagIds.forEach(tagId=> formData.append("tagIds", tagId.toString()));
    if(post.postImage) formData.append("postImage", post.postImage);
    const res= await axiosInstance.put("/api/posts", formData,{headers:{"Content-Type":"multipart/form-data"}});
    return res.data.result;
  },
  async delete(id:number):Promise<string>{
    const res=await axiosInstance.delete(`/api/posts/${id}`);
    return res.data.result;
  }

}