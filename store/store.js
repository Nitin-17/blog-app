import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import postsReducer from "./postsSlice";
import authReducer from "./authSlice";

// Configuration for persisting the auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["auth"], // Only persist the `auth` key from the state
};

const postsPersistConfig = {
  key: "posts",
  storage,
  whitelist: ["posts"], // Only persist the `posts` key from the state
};

// Wrap the authReducer with persistReducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPostsReducer = persistReducer(postsPersistConfig, postsReducer);

const store = configureStore({
  reducer: {
    posts: persistedPostsReducer,
    user: persistedAuthReducer,
  },
});

export const persistor = persistStore(store); // Create the persistor instance
export default store;
