import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { Tag } from "../types/tag";


export const tagsAPI = {
  async getAll(): Promise<Tag[]> {
    const res = await axiosInstance.get(API_ENDPOINTS.TAGS.GET_ALL);
    return res.data.result;
  },

  async getById(id: number): Promise<Tag> {
    const res = await axiosInstance.get(API_ENDPOINTS.TAGS.GET_BY_ID(id));
    return res.data.result;
  },

  async create(name: string): Promise<Tag> {
    const res = await axiosInstance.post(API_ENDPOINTS.TAGS.CREATE, { name });
    return res.data.result ?? res.data;
  },

  async update(tag: { tagId: number; tagName: string }): Promise<Tag> {
    const res = await axiosInstance.put(API_ENDPOINTS.TAGS.UPDATE, tag);
    return res.data.result ?? res.data;
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.TAGS.DELETE(id));
  },
};