import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tagsAPI } from "../../api/tagsApi";
import type { Tag } from "../../types/tag";

/* ── Thunks ── */

export const fetchTags = createAsyncThunk("tags/fetchAll", async (_, thunkAPI) => {
  try {
    return await tagsAPI.getAll();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch tags");
  }
});

export const createTag = createAsyncThunk(
  "tags/create",
  async (name: string, thunkAPI) => {
    try {
      return await tagsAPI.create(name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create tag");
    }
  },
);

export const updateTag = createAsyncThunk(
  "tags/update",
  async (tag: { tagId: number; tagName: string }, thunkAPI) => {
    try {
      return await tagsAPI.update(tag);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update tag");
    }
  },
);

export const deleteTag = createAsyncThunk<number, number, { rejectValue: string }>(
  "tags/delete",
  async (id, thunkAPI) => {
    try {
      await tagsAPI.remove(id);
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete tag");
    }
  },
);

/* ── Slice ── */

interface TagState {
  tags: Tag[];
  currentTag?: Tag;
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  tags: [],
  loading: false,
  error: null,
};

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clearCurrentTag(state) {
      state.currentTag = undefined;
    },
  },
  extraReducers: (builder) => {
    /* fetch all */
    builder.addCase(fetchTags.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action.payload;
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* create */
    builder.addCase(createTag.fulfilled, (state, action) => {
      state.tags.push(action.payload);
    });

    /* update */
    builder.addCase(updateTag.fulfilled, (state, action) => {
      const idx = state.tags.findIndex((t) => t.tagId === action.payload.tagId);
      if (idx !== -1) state.tags[idx] = action.payload;
    });

    /* delete */
    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.tags = state.tags.filter((t) => t.tagId !== action.payload);
    });
  },
});

export const { clearCurrentTag } = tagSlice.actions;
export default tagSlice.reducer;