import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dark: {
    background: "#111714",
    surface: "#161b16",
    card: "#1c2220",

    textPrimary: "#f0f4f0",
    textSecondary: "#8fa398",
    textMuted: "#4b5e54",

    primary: "#3dba5c",
    primaryHover: "#34a350",
    primarySoft: "#1a3326",

    border: "#2a3630",
    divider: "#222d28",

    success: "#3dba5c",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    inputBg: "#1c2220",
    inputBorder: "#2e3d37",
    inputText: "#e8f0eb",
    inputPlaceholder: "#556860",

    socialBg: "#1c2220",
    socialBorder: "#2e3d37",

    shadow: "rgba(0,0,0,0.45)",
    illustrationCircle: "#1a2e20",
  },

  light: {
    background: "#f2f5f2",
    surface: "#ffffff",
    card: "#ffffff",

    textPrimary: "#141f18",
    textSecondary: "#5a7060",
    textMuted: "#97aaa0",

    primary: "#2a7a3f",
    primaryHover: "#236833",
    primarySoft: "#e4f4e9",

    border: "#dde8e1",
    divider: "#edf3ef",

    success: "#2a7a3f",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    inputBg: "#ffffff",
    inputBorder: "#cdd8d2",
    inputText: "#141f18",
    inputPlaceholder: "#97aaa0",

    socialBg: "#ffffff",
    socialBorder: "#dde8e1",

    shadow: "rgba(0,0,0,0.07)",
    illustrationCircle: "#e4f0e8",
  },

  currentTheme: localStorage.getItem("theme") || "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.currentTheme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
