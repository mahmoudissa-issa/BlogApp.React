import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { APIResponse } from "../types/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 10000, //  ADD: 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

//  Request Interceptor - Add token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ⭐ Response Interceptor - Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // If your API wraps data in APIResponse format
    const data = response.data as APIResponse<any>;
    
    // Check if API indicates failure
    if (data && !data.isSuccess) {
      return Promise.reject({
        message: data.result || 'An error occurred',
        statusCode: data.statusCode,
        errorCode: data.errorCode
      });
    }
    
    return response;
  },
  (error: AxiosError<APIResponse<any>>) => {
    //  Handle 401 - Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login
    }

    //  Handle other HTTP errors
    const errorMessage = error.response?.data?.result 

      || error.message 
      || 'An unexpected error occurred';

    return Promise.reject({
      message: errorMessage,
      statusCode: error.response?.status,
      errorCode: error.response?.data?.errorCode,
      data: error.response?.data
    });
  }
);