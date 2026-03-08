import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commentApi } from "../../api/commentsApi";
import type { Comment, UpdateCommentRequest } from "../../types/post";

/* ── Thunks ── */

export const fetchAllComments = createAsyncThunk(
  "comments/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await commentApi.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch comments");
    }
  },
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async (req: UpdateCommentRequest, thunkAPI) => {
    try {
      return await commentApi.update(req.id, req.content);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update comment");
    }
  },
);

export const deleteComment = createAsyncThunk<number, number, { rejectValue: string }>(
  "comments/delete",
  async (id, thunkAPI) => {
    try {
      await commentApi.delete(id);
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete comment");
    }
  },
);

/* ── Slice ── */

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* fetch all */
    builder.addCase(fetchAllComments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllComments.fulfilled, (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    });
    builder.addCase(fetchAllComments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* update — only patch content so postTitle and other fields are never lost */
    builder.addCase(updateComment.fulfilled, (state, action) => {
      const idx = state.comments.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.comments[idx].content = action.payload.content;
      }
    });

    /* delete */
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
    });
  },
});

export default commentSlice.reducer;
