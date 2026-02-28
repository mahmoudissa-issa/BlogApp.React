
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    LOGOUT: '/api/logout',
    FORGOT_PASSWORD: '/api/forgot-password',
    RESET_PASSWORD: '/api/reset-password',
    VERIFY_EMAIL: (token: string) => `/api/verify-email/${token}`,
    RESEND_VERIFICATION: '/api/resend-verification',
  },
  TAGS:{
    GET_ALL: '/api/tags',
    GET_BY_ID: (id: number) => `/api/tags/${id}`,
    CREATE: '/api/tags',
    UPDATE: '/api/tags',
    DELETE: (id: number) => `/api/tags/${id}`,
  },
  POSTS: {
    GET_ALL: '/api/posts',
    GET_BY_ID: (id: number) => `/api/posts/${id}`,
    CREATE: '/api/posts',
    UPDATE: '/api/posts',
    DELETE: (id: number) => `/api/posts/${id}`,
  },
  COMMENTS: {
    GET_BY_POST: (postId: number) => `/api/comment/${postId}`,
    CREATE: '/api/comment',
    UPDATE: '/api/comment',
    DELETE: (id: number) => `/api/comment/${id}`,
  },
  PROFILE:{
    CHANGE_PASSWORD:'/api/change-password',
    GET_PROFILE_INFO:`/api/profile`,
    UPDATE_PROFILE: `/api/update-profile`,
    UPLOAD_AVATAR: `/api/upload-avatar`
  }
};