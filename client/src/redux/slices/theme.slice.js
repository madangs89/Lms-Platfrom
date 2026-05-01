import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dark: {
    backgroundColor: "#000",
    color: "#fff",
    secondaryColor: "#333",
  },
  light: {
    backgroundColor: "#fff",
    color: "#000",
    secondaryColor: "#999",
  },
  currentTheme: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
const themeReducer = themeSlice.reducer;
export default themeReducer;
