import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { axiosInstance } from "../services/axiosInstance";
import type { User, CreateUserRequest, UpdateUserRequest } from "../types/user";

export const usersApi = {
  async getAll(): Promise<User[]> {
    const res = await axiosInstance.get(API_ENDPOINTS.USERS.GET_ALL);
    return res.data.result;
  },

  async getById(id: number): Promise<User> {
    const res = await axiosInstance.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
    return res.data.result;
  },

  async create(req: CreateUserRequest): Promise<User> {
    const formData = new FormData();
    formData.append("UserName", req.userName);
    formData.append("Email", req.email);
    formData.append("FullName", req.fullName);
    formData.append("Password", req.password);
    formData.append("RoleId", req.roleId.toString());
    if (req.avatar) formData.append("Avatar", req.avatar);

    const res = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.result;
  },

  async update(req: UpdateUserRequest): Promise<User> {
    const formData = new FormData();
    formData.append("UserId", req.userId.toString());
    formData.append("UserName", req.userName);
    formData.append("Email", req.email);
    formData.append("FullName", req.fullName);
    formData.append("RoleId", req.roleId.toString());
    if (req.password) formData.append("Password", req.password);
    if (req.avatar) formData.append("Avatar", req.avatar);

    const res = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.result;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};
