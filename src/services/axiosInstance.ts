import axios, { AxiosError } from "axios";
import type { APIResponse } from "../types/api";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

axiosInstance.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token) config.headers.Authorization=`Bearer ${token}`;
    return config;

});

axiosInstance.interceptors.response.use(
 (response) =>{
    const data=response.data as APIResponse<any>;
    if(!data.isSuccess){
        return Promise.reject({
            message:data.result || 'An error occurred',
            statusCode:data.statusCode,
            errorCode:data.errorCode
        });
    }
    return response;
},
  (error:AxiosError)=>{
    return Promise.reject(error.response?.data || {message:error.message} );
  }
);