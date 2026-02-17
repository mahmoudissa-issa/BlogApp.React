import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { ChangePasswordRequest } from "../../types/profile";
import { profileApi } from "../../api/profileApi";
import type { User } from "../../types/user";


interface ProfileState {
    passwordLoading: boolean;
    profileLoading: boolean;
    avatarUploading: boolean;
    profileInfo: User | null;
}

// Update Profile Info

export const UpdateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (data: {fullName: string}, thunkAPI) => {
        try {
                const response = await profileApi.UpdateProfile(data);
                return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to update profile');
        }

    }
);

// Upload Avatar
export const UploadAvatar = createAsyncThunk(
    "profile/uploadAvatar",
    async (file: File, thunkAPI) => {
        try {
            const response = await profileApi.uploadAvatar(file);
            return response; // returns the new avatar URL
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to upload avatar');
        }
    }
);


// Get Profile Info
export const GetProfileInfo = createAsyncThunk(
    "profile/getProfileInfo",
    async (_, thunkAPI) => {
        try {
            const response = await profileApi.getProfileINfo();
            // console.log("Profile Info Response:", response); // Debug log
            return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to fetch profile info');
        }

    }
);

// Change Password
export const ChangePassword = createAsyncThunk(
    "profile/changePassword",
    async (data: ChangePasswordRequest, thunkAPI) => {
        try {
            const response = await profileApi.changePassword(data);
            return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to change password');
        }
    }
);

//------------
 const initialState:ProfileState={
    passwordLoading:false,
    profileLoading:false,
    avatarUploading:false,
    profileInfo:null,

};

export const profileSlice=createSlice({
    name:'profile',
    initialState,
    reducers:{
    clearPassworldStatus:(state) =>{
        state.passwordLoading=false;
    },
    clearProfileInfo:(state) =>{
        state.profileInfo=null;
        state.profileLoading=false;
        state.avatarUploading=false;
        }
},
    extraReducers:(builder)=>{


        // Get Profile Info
        builder.addCase(GetProfileInfo.pending,(state)=>{
            state.profileLoading = true;
            state.profileInfo = null;  
        });
        builder.addCase(GetProfileInfo.fulfilled,(state, action)=>{
            state.profileLoading = false;
            state.profileInfo = action.payload;
        });
        builder.addCase(GetProfileInfo.rejected,(state)=>{
            state.profileLoading = false;
            state.profileInfo = null;

        });


        // Change Password
        builder.addCase(ChangePassword.pending,(state)=>{
            state.passwordLoading=true;
        });

        builder.addCase(ChangePassword.fulfilled,(state)=>{
            state.passwordLoading=false;
        });

        builder.addCase(ChangePassword.rejected,(state)=>{
            state.passwordLoading=false;

        });

        // Upload Avatar
        builder.addCase(UploadAvatar.pending,(state)=>{
            state.avatarUploading=true;
        });
        builder.addCase(UploadAvatar.fulfilled,(state, action)=>{
            state.avatarUploading=false;
            if(state.profileInfo){
                state.profileInfo.avatarUrl = action.payload;
            }
        });
        builder.addCase(UploadAvatar.rejected,(state)=>{
            state.avatarUploading=false;
        });
    }
});


export const {clearPassworldStatus, clearProfileInfo}=profileSlice.actions;
export default profileSlice.reducer;
