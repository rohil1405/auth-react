import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<{ role: string; user: User }>) => {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.user = action.payload.user;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.user = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
