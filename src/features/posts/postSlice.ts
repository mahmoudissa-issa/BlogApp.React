

// ----------------
// Thunks
// ----------------

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postApi } from "../../api/postsApi";
import type { CreatePostRequest, Post, UpdatePostRequest } from "../../types/post";

export const fetchPosts=createAsyncThunk("posts/fetchAll",async(_, thunkAPI)=>{
    try{
        const posts=await postApi.getAll();
        return posts;
    }catch(err:any){
        return thunkAPI.rejectWithValue(err.message || 'Failed to fetch posts');
    }
});

export const fetchPostById=createAsyncThunk("posts/fetchById",async(id:number,thunkAPI) =>{
    try{
        return await postApi.getById(id);

    }catch(err:any){
        return thunkAPI.rejectWithValue(err.message || 'Failed to fetch post');
    }
});

export const createPost=createAsyncThunk("posts/create",async(post:CreatePostRequest,thunkAPI) =>{
        try{

            return await postApi.create(post);
        }catch(err:any){
            return thunkAPI.rejectWithValue(err.message || 'Failed to create post');
        }
});

export const updatePost=createAsyncThunk("posts/update",async(post:UpdatePostRequest,thunkAPI) =>{
    try{        
        return await postApi.update(post);
    }catch(err:any){
        return thunkAPI.rejectWithValue(err.message || 'Failed to update post');
    }       
});


export const deletePost = createAsyncThunk<number, number, { rejectValue: string }>(
    "posts/delete",
    async (id: number, thunkAPI) => {
        try {
            await postApi.delete(id);
            return id;
        } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message || 'Failed to delete post');
        }
    }
);

//------------
// Slice
//------------

interface PostState {
    items:Post[];
    currentPost?:Post;
    loading:boolean;
    error?:string |null;

}

const initalState:PostState={
    items:[],
    loading:false,
    error:null
}

const postSlice=createSlice({
    name:'posts',
    initialState:initalState,
    reducers:{
        clearCurrentPost(state){
            state.currentPost=undefined;
        }
    },
    extraReducers(builder) {
        // Fetch all posts
        builder.addCase(fetchPosts.pending,(state) =>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchPosts.fulfilled,(state, action) =>{
            state.loading=false;
            state.items=action.payload;
        });
        builder.addCase(fetchPosts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });

        // Fetch post by ID
        builder.addCase(fetchPostById.pending,(state) =>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchPostById.fulfilled,(state, action) =>{
            state.loading=false;
            state.currentPost=action.payload;
        });
        builder.addCase(fetchPostById.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });

        // Create post
        builder.addCase(createPost.pending,(state) =>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(createPost.fulfilled,(state, action) =>{
            state.loading=false;
            state.items.push(action.payload);
        });
        builder.addCase(createPost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });

        // Update post
        builder.addCase(updatePost.pending,(state) =>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(updatePost.fulfilled,(state, action) =>{
            state.loading=false;
            const index=state.items.findIndex(p=>p.id===action.payload.id);
            state.items[index]=action.payload;
        });
        builder.addCase(updatePost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });

        // Delete post
        builder.addCase(deletePost.pending,(state) =>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(deletePost.fulfilled,(state, action) =>{
            state.loading=false;
            state.items=state.items.filter(p=>p.id!==action.payload);
        });
        builder.addCase(deletePost.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
    },

});
export const {clearCurrentPost}=postSlice.actions;
export default postSlice.reducer;