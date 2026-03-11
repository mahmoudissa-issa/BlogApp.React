import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { usersApi } from "../../api/usersApi";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types/user";

/* ── Thunks ── */

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await usersApi.getAll();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch users");
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (req: CreateUserRequest, thunkAPI) => {
    try {
      return await usersApi.create(req);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create user");
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (req: UpdateUserRequest, thunkAPI) => {
    try {
      return await usersApi.update(req);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update user");
    }
  },
);

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      await usersApi.delete(id);
      return id;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete user");
    }
  },
);

/* ── Slice ── */

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* fetch all */
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* create */
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.users.push(action.payload);
    });

    /* update — merge to preserve any extra fields */
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...action.payload };
    });

    /* delete */
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    });
  },
});

export default userSlice.reducer;
