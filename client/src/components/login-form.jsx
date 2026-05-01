"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/redux/slices/theme.slice";

import logimage from "./../assets/login.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const colors = theme[theme.currentTheme];

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div
      className="h-screen flex w-full mx-auto  relative items-center justify-center"
      style={{ background: colors.background }}
    >
      <nav className="flex absolute top-2 w-full max-w-5xl mx-auto justify-between md:px-0 px-3  items-center gap-2 text-lg font-semibold">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full"
            style={{ background: colors.primary }}
          />
          <span style={{ color: colors.textPrimary }}>EduLearn</span>
        </div>
        <button
          onClick={() => dispatch(toggleTheme())}
          className=" px-4 py-2 rounded-full text-sm"
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
          }}
        >
          {theme.currentTheme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </nav>

      <div className="flex w-full  justify-between max-w-5xl mx-auto px-2 mt-2">
        <div className="hidden md:flex flex-col justify-between gap-10">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight">
              Welcome <br />
              <span style={{ color: colors.primary }}>back!</span>
            </h1>
            <p style={{ color: colors.textSecondary }}>
              Sign in to continue your learning journey
            </p>
          </div>

          <img src={logimage} className="w-full max-w-xs" alt="" />

          {/* Quote */}
          <div
            className="p-6 rounded-xl max-w-sm"
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Education is the most powerful weapon which you can use to change
              the world.
            </p>
            <p
              className="mt-2 text-sm font-medium"
              style={{ color: colors.primary }}
            >
              — Nelson Mandela
            </p>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 relative">
          {/* Login Card */}
          <div
            className="w-full max-w-md p-8 rounded-2xl backdrop-blur-md"
            style={{
              background:
                theme.currentTheme === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : colors.card,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 20px 50px ${colors.shadow}`,
            }}
          >
            <h2 className="text-2xl font-semibold mb-2">Login</h2>
            <p className="text-sm mb-6" style={{ color: colors.textSecondary }}>
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm">Email or USN</label>
                <Input
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  style={{
                    background: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between text-sm">
                  <label>Password</label>
                  <span
                    className="cursor-pointer"
                    style={{ color: colors.primary }}
                  >
                    Forgot password?
                  </span>
                </div>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    background: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.inputText,
                  }}
                />
              </div>

              {/* Remember */}
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                <span style={{ color: colors.textSecondary }}>Remember me</span>
              </div>

              {/* Login Button */}
              <Button
                className="w-full"
                disabled={loading}
                style={{
                  background: colors.primary,
                  color: "#fff",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Divider */}
              <div className="text-center text-sm text-gray-400">
                or continue with
              </div>

              {/* Social */}
              <div className="flex gap-3">
                <Button variant="outline" className="w-full">
                  Google
                </Button>
              </div>

              {/* Signup */}
              <p className="text-center text-sm">
                Don’t have an account?{" "}
                <span
                  className="cursor-pointer"
                  style={{ color: colors.primary }}
                >
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
