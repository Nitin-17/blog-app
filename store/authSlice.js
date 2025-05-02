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
  },
});

export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
