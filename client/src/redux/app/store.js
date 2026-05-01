import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import themeReducer from "../slices/theme.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
});
