import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tagsAPI } from "../../api/tagsApi";
import type { Tag } from "../../types/tag";


export const fetchTags=createAsyncThunk("tags/fetchAll",async(_,thunkAPI) =>{
    try{
        const tags=await tagsAPI.getAll(); 
        return tags;
        
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }catch(err:any){
        return thunkAPI.rejectWithValue(err.message || 'Failed to fetch tags');
    }
});


interface TagState{    
    tags:Tag[];
    currentTag?:Tag;
    loading:boolean;
    error:string | null;

}

const initialState:TagState={    
    tags:[],
    loading:false,
    error:null
};


const tagSlice=createSlice({
    name:"tags",
    initialState,
    reducers:{
           clearCurrentTag(state){
            state.currentTag=undefined;
        }
    },
    extraReducers:(builder)=>{

        builder.addCase(fetchTags.pending,(state)=>{
            state.loading=true;
            state.error=null;
        });
        builder.addCase(fetchTags.fulfilled,(state,action)=>{
            state.loading=false;
            state.tags=action.payload;
        });
        builder.addCase(fetchTags.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload as string;
        });
    }

});

export const {clearCurrentTag}=tagSlice.actions;
export default tagSlice.reducer;