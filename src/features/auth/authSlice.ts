import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "../../types/auth";
import { authAPI, type LoginDto, type RegisterDto } from "../../api/authApi";
import { Nav } from "react-bootstrap";
import { Navigate } from "react-router-dom";

import { toast } from "react-toastify";

interface AuthState {
    user:AuthUser |null;
    token:string | null;
    status:"idle" | "loading" | "error";
    error?:string;
}

const initalState:AuthState={
    user:null,
    token:localStorage.getItem('token'),
    status:"idle",
}

const mapToUser=(res:AuthResponse):AuthUser =>({
    id:res.userId.toString(),
    username:res.userName,
    email:res.email,
    role:res.role
});

export const login=createAsyncThunk('auth/login',async (dto:LoginDto, thunkAPI)=>{
    try{
        return await authAPI.login(dto);

    }catch(err:any){
        toast.error(err.result || "Login failed");
        return thunkAPI.rejectWithValue(err.message || 'Login failed');
    }
});

export const registers=createAsyncThunk('auth/register',async (dto:RegisterDto, thunkAPI)=>{
    try{
        return await authAPI.register(dto);

    }catch(err:any){
          toast.error(err.result || "Registration failed");
        return thunkAPI.rejectWithValue(err.message || 'Registration failed');
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
          
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(login.pending,(state)=>{
            state.status='loading';
            state.error=undefined;
        }),
        builder.addCase(login.fulfilled,(state, action)=>{
            state.status='idle';
            state.user=mapToUser(action.payload);
            state.token=action.payload.token;
            localStorage.setItem('token', action.payload.token);
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
            
        }   ),
        builder.addCase(registers.rejected,(state, action)=>{
            state.status='error';
            state.error=action.payload as string;
        })
    }
 });

 export const {logout}=slice.actions;
 export default slice.reducer;
