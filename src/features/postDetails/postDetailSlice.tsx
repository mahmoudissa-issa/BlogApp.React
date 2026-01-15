import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateCommentRequest, Post,Comment} from "../../types/post";
import { postApi } from "../../api/postsApi";
import { commentApi } from "../../api/commentsApi";

interface PostDetailState {
  post: Post | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
  commentsLoading: boolean;
  commentsError: string | null;
}

const initialState: PostDetailState = {
  post: null,
  comments: [],
  loading: false,
  error: null,
  commentsLoading: false,
  commentsError: null,
};


//Fetch Post Detail By Id 
export const fetchPostDetail = createAsyncThunk(
  "postDetail/fetchPostDetail",
  async (postId: number, thunkAPI) => {
    try {
      const postDetail = postApi.getById(postId);
      return postDetail;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch post detail"
      );
    }
  }
);

// Fetch Comments For A Post 

export const fetchComments=createAsyncThunk("postDetail/fetchComments",async(postId:number,thunkAPI)=>{
    try{

        const comments=await commentApi.getByPostId(postId);
        return comments;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
        return thunkAPI.rejectWithValue(err.message || 'Failed to fetch comments');
    }
})  

//Add New Comment 

export const addComment=createAsyncThunk("postDetail/addComment",async(comment:CreateCommentRequest,thunkAPI)=>{ 
    try{
        const newComment=await commentApi.create(comment);
        return newComment;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
        return thunkAPI.rejectWithValue(err.message || 'Failed to add comment');
    
    }

})

const postDetailSlice=createSlice({
    name:"postDetail",
    initialState,
      reducers: {
    clearPostDetail: (state) => {
      state.post = null;
      state.comments = [];
      state.error = null;
      state.commentsError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Post Detail
    builder.addCase(fetchPostDetail.pending,(state) =>{
        state.loading=true;
        state.error=null;
    });
    builder.addCase(fetchPostDetail.fulfilled,(state,action:PayloadAction<Post>) =>{
        state.loading=false;
        state.post=action.payload;
    });
    builder.addCase(fetchPostDetail.rejected,(state,action) =>{
        state.loading=false;
        state.error=action.payload as string;
    });

    //Fetch Comments
    builder.addCase(fetchComments.pending,(state) =>{
        state.commentsLoading=true;
        state.commentsError=null;
    });
    builder.addCase(fetchComments.fulfilled,(state,action:PayloadAction<Comment[]>) =>{
        state.commentsLoading=false;
        state.comments=action.payload;
    });
    builder.addCase(fetchComments.rejected,(state,action) =>{
        state.commentsLoading=false;
        state.commentsError=action.payload as string;
    });

    //Add New Comment 
    builder.addCase(addComment.pending,(state) =>{
        state.commentsLoading=true;
        state.commentsError=null;
    }).addCase(addComment.fulfilled,(state,action:PayloadAction<Comment>) =>{
        state.commentsLoading=false;
        state.comments.push(action.payload);
    }).addCase(addComment.rejected,(state,action) =>{
        state.commentsLoading=false;
        state.commentsError=action.payload as string;
    });

  }});

  export const {clearPostDetail}=postDetailSlice.actions;
  export default postDetailSlice.reducer;
