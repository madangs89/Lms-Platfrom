import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dark: {
    background: "#0B0F0E",
    surface: "#121817",
    card: "#1A2220",

    textPrimary: "#ffffff",
    textSecondary: "#A3B3AD",
    textMuted: "#6B7C75",

    primary: "#22C55E",
    primaryHover: "#16A34A",
    primarySoft: "#163D2B",

    border: "#24312D",
    divider: "#1F2A27",

    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    inputBg: "#121817",
    inputBorder: "#2A3A35",
    inputText: "#E6F4EA",

    shadow: "rgba(0,0,0,0.4)",
  },

  light: {
    background: "#F8FAF9",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    textPrimary: "#0F172A",
    textSecondary: "#475569",
    textMuted: "#94A3B8",

    primary: "#16A34A",
    primaryHover: "#15803D",
    primarySoft: "#DCFCE7",

    border: "#E2E8F0",
    divider: "#EEF2F7",

    success: "#16A34A",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",

    inputBg: "#FFFFFF",
    inputBorder: "#D1D5DB",
    inputText: "#0F172A",

    shadow: "rgba(0,0,0,0.05)",
  },

  currentTheme: "light",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.currentTheme =
        state.currentTheme === "light" ? "dark" : "light";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;