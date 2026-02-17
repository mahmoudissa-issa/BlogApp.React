import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import postReducer from "../features/posts/postSlice";
import tagReducer from "../features/tags/tagSlice";
import postDetailReducer from "../features/postDetails/postDetailSlice";
import profileReducer from "../features/profile/profileSlice";
export const store = configureStore({
  reducer: {
    auth:authReducer,
    post:postReducer,
    tags:tagReducer,
    postDetail:postDetailReducer,
    profile:profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
