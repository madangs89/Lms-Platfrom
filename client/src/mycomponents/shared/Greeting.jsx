import React from "react";
import { useSelector } from "react-redux";

const Greeting = ({ name, isAdmin }) => {
  const theme = useSelector((state) => state.theme);
  let colors = theme[theme.currentTheme];
  const isDark = theme.currentTheme === "dark";

  return (
    <div className="flex flex-col mt-3">
      <h1
        className="font-bold text-2xl"
        style={{
          color: colors.textPrimary,
        }}
      >
        Welcome Back, {name}!👋
      </h1>

      <p
        className="text-sm mt-1"
        style={{
          color: colors.textSecondary,
        }}
      >
        {isAdmin
          ? "Here's what's happening with your courses and students today."
          : "Here's what's happening with your courses today."}
      </p>
    </div>
  );
};

export default Greeting;
