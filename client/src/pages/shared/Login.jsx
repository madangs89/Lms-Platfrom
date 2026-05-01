import LoginPage from "@/components/login-form";
import React from "react";
import { useSelector } from "react-redux";

const Login = () => {
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];
  return (
    <div
      style={{ background: colors.background }}
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
    >
      <LoginPage />
    </div>
  );
};

export default Login;
