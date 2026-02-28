import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "../../types/auth";
import {
  authAPI,
  type LoginDto,
  type RegisterDto,
  type ForgotPasswordDto,
  type ResetPasswordDto,
  type ResendVerificationDto,
} from "../../api/authApi";
import { toast } from "react-toastify";

// ── Types ──────────────────────────────────────────────

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: "idle" | "loading" | "error";
  error?: string;
  registeredEmail?: string;
}

// ── Helpers ────────────────────────────────────────────

const loadJSON = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const mapToUser = (res: AuthResponse): AuthUser => ({
  id: res.userId.toString(),
  username: res.userName,
  email: res.email,
  role: res.role,
  avatarUrl: res.avatarUrl,
});

/** Persist credentials to localStorage and mutate state. */
const setCredentials = (state: AuthState, res: AuthResponse) => {
  const user = mapToUser(res);
  state.user = user;
  state.token = res.token;
  state.status = "idle";
  localStorage.setItem("token", res.token);
  localStorage.setItem("user", JSON.stringify(user));
};

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === "object" && "message" in err) {
    return (err as { message: string }).message || fallback;
  }
  return fallback;
};

// ── Initial State ──────────────────────────────────────

const initialState: AuthState = {
  user: loadJSON<AuthUser>("user"),
  token: localStorage.getItem("token"),
  status: "idle",
};

// ── Thunks ─────────────────────────────────────────────

export const login = createAsyncThunk(
  "auth/login",
  async (dto: LoginDto, { rejectWithValue }) => {
    try {
      return await authAPI.login(dto);
    } catch (err) {
      const msg = getErrorMessage(err, "Login failed");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const registers = createAsyncThunk(
  "auth/register",
  async (dto: RegisterDto, { rejectWithValue }) => {
    try {
      await authAPI.register(dto);
      return dto.email;
    } catch (err) {
      const msg = getErrorMessage(err, "Registration failed");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token: string, { rejectWithValue }) => {
    try {
      return await authAPI.verifyEmail(token);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Email verification failed"));
    }
  },
);

export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (dto: ResendVerificationDto, { rejectWithValue }) => {
    try {
      await authAPI.resendVerification(dto);
      toast.success("Verification email sent! Please check your inbox");
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to resend verification email");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (dto: ForgotPasswordDto, { rejectWithValue }) => {
    try {
      await authAPI.forgotPassword(dto);
      toast.success("Password reset link sent to your email");
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to send reset link");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (dto: ResetPasswordDto, { rejectWithValue }) => {
    try {
      await authAPI.resetPassword(dto);
      toast.success("Password reset successfully");
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to reset password");
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// ── Slice ──────────────────────────────────────────────

const setPending = (state: AuthState) => {
  state.status = "loading";
  state.error = undefined;
};

const setRejected = (state: AuthState, action: PayloadAction<unknown>) => {
  state.status = "error";
  state.error = action.payload as string;
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.avatarUrl = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    clearRegisteredEmail(state) {
      state.registeredEmail = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, setPending)
      .addCase(login.fulfilled, (state, { payload }) => setCredentials(state, payload))
      .addCase(login.rejected, setRejected)
      // Register
      .addCase(registers.pending, setPending)
      .addCase(registers.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.registeredEmail = payload;
      })
      .addCase(registers.rejected, setRejected)
      // Verify Email
      .addCase(verifyEmail.pending, setPending)
      .addCase(verifyEmail.fulfilled, (state, { payload }) => setCredentials(state, payload))
      .addCase(verifyEmail.rejected, setRejected)
      // Resend Verification
      .addCase(resendVerification.pending, setPending)
      .addCase(resendVerification.fulfilled, (state) => { state.status = "idle"; })
      .addCase(resendVerification.rejected, setRejected);
  },
});

export const { logout, updateAvatar, clearRegisteredEmail } = slice.actions;
export default slice.reducer;
