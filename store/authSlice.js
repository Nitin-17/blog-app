import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: {
    token: null,
    isAdmin: false,
    name: "",
    userId: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.auth.token = action.payload.token;
      state.auth.isAdmin = action.payload?.success;
      state.auth.name = action.payload?.name;
      state.auth.userId = action.payload?.userId;
    },
    logout(state) {
      state.auth = {
        token: null,
        isAdmin: false,
        name: "",
        userId: null,
      };
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
