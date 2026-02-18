import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "../../types/auth";
import { authAPI, type LoginDto, type RegisterDto, type ForgotPasswordDto, type ResetPasswordDto } from "../../api/authApi";


import { toast } from "react-toastify";

interface AuthState {
    user:AuthUser |null;
    token:string | null;
    status:"idle" | "loading" | "error";
    error?:string;
}

const initalState:AuthState={
    user:localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    token:localStorage.getItem('token'),
    status:"idle",
}

const mapToUser=(res:AuthResponse):AuthUser =>({
    id:res.userId.toString(),
    username:res.userName,
    email:res.email,
    role:res.role,
    avatarUrl:res.avatarUrl,
});

export const login=createAsyncThunk('auth/login',async (dto:LoginDto, thunkAPI)=>{
    try{
        return await authAPI.login(dto);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
 
        toast.error(err.message || "Login failed");
        return thunkAPI.rejectWithValue(err.message || 'Login failed');
    }
});

export const registers=createAsyncThunk('auth/register',async (dto:RegisterDto, thunkAPI)=>{
    try{
        return await authAPI.register(dto);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
          toast.error(err.message || "Registration failed");
        return thunkAPI.rejectWithValue(err.message || 'Registration failed');
    }
});

export const forgotPassword=createAsyncThunk('auth/forgotPassword',async (dto:ForgotPasswordDto, thunkAPI)=>{
    try{
        await authAPI.forgotPassword(dto);
        toast.success("Password reset link sent to your email");
        return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
        toast.error(err.message || "Failed to send reset link");
        return thunkAPI.rejectWithValue(err.message || 'Failed to send reset link');
    }
});

export const resetPassword=createAsyncThunk('auth/resetPassword',async (dto:ResetPasswordDto, thunkAPI)=>{
    try{
        await authAPI.resetPassword(dto);
        toast.success("Password reset successfully");
        return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
        toast.error(err.message || "Failed to reset password");
        return thunkAPI.rejectWithValue(err.message || 'Failed to reset password');
    }
});

 const slice =createSlice({
    name:'auth',
    initialState:initalState,
    reducers:{
        logout(state){
            state.user=null;
            state.token=null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateAvatar(state, action) {
            if (state.user) {
                state.user.avatarUrl = action.payload;
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
    extraReducers:(builder)=>{
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        builder.addCase(login.pending,(state)=>{
            state.status='loading';
            state.error=undefined;
        }),
        builder.addCase(login.fulfilled,(state, action)=>{
            state.status='idle';
            state.user=mapToUser(action.payload);
            state.token=action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(mapToUser(action.payload)));
        }),
        builder.addCase(login.rejected,(state, action)=>{
            state.status='error';
            state.error=action.payload as string;
        }),

        builder.addCase(registers.pending,(state)=>{     
            state.status='loading';
            state.error=undefined;
        }),
        builder.addCase(registers.fulfilled,(state, action)=>{
            state.status='idle';    
            state.user=mapToUser(action.payload);
            state.token=action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(mapToUser(action.payload)));
        }   ),
        builder.addCase(registers.rejected,(state, action)=>{
            state.status='error';
            state.error=action.payload as string;
        })
    }
 });

 export const {logout, updateAvatar}=slice.actions;
 export default slice.reducer;
