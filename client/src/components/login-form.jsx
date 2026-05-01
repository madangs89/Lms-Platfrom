"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/redux/slices/theme.slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Moon, Sun, User, Lock } from "lucide-react";
import { Spinner } from "./ui/spinner";
import axios from "axios";
import { login } from "@/redux/slices/auth.slice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme);
  const c = theme[theme.currentTheme]; // shorthand for colors
  const isDark = theme.currentTheme === "dark";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return toast.error("All fields are required.");

    try {
      setLoading(true);
      const data = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        form,
        {
          withCredentials: true,
        },
      );
      if (data.data.success) {
        const { user, token } = data.data;
        toast.success("Login successful!");
        dispatch(login(user));
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during login.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen items-center justify-center flex flex-col"
      style={{ background: c.background, color: c.textPrimary }}
    >
      {/* ── MAIN ── */}
      <main className="flex  items-center justify-center relative mt-12 md:mt-0  px-6 pb-10">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-2 px-4 py-2 rounded-full absolute right-7 md:top-6 top-3 text-sm font-medium transition-all"
          style={{
            background: c.card,
            border: `1.5px solid ${c.border}`,
            color: c.textSecondary,
          }}
        >
          {isDark ? <Sun size={14} /> : <Moon size={14} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>

        <div
          className="flex w-full max-w-5xl rounded-2xl overflow-hidden"
          style={{
            background: c.card,
            border: `1px solid ${c.border}`,
            boxShadow: `0 8px 40px ${c.shadow}`,
          }}
        >
          {/* ── LEFT PANEL ── */}
          <div
            className="hidden md:flex flex-col justify-between p-12 w-[42%] flex-shrink-0"
            style={{ background: isDark ? c.surface : c.background }}
          >
            {/* Headline */}
            <div className="space-y-3">
              <h1
                className="text-5xl font-bold leading-[1.1]"
                style={{ color: c.textPrimary }}
              >
                Welcome
                <br />
                <span style={{ color: c.primary }}>back!</span>
              </h1>
              <p
                className="text-sm leading-relaxed"
                style={{ color: c.textSecondary }}
              >
                Sign in to continue your
                <br />
                learning journey
              </p>
            </div>

            {/* Illustration */}
            <div className="relative flex items-center justify-center my-8 h-44">
              {/* Glow circle */}
              <div
                className="absolute w-36 h-36 rounded-full"
                style={{ background: c.illustrationCircle }}
              />
              {/* Dot grid */}
              <div className="absolute left-2 bottom-4 grid grid-cols-4 gap-1 opacity-30">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="block w-1.5 h-1.5 rounded-full"
                    style={{ background: c.primary }}
                  />
                ))}
              </div>
              {/* Books + graduation cap emoji illustration */}
              <span
                className="relative z-10 text-8xl select-none"
                style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.18))" }}
              >
                🎓
              </span>
            </div>

            {/* Quote */}
            <div
              className="rounded-xl p-5"
              style={{
                background: c.card,
                border: `1px solid ${c.border}`,
              }}
            >
              <span
                className="text-2xl leading-none font-serif"
                style={{ color: c.primary }}
              >
                "
              </span>
              <p
                className="text-sm leading-relaxed mt-1"
                style={{ color: c.textSecondary }}
              >
                Education is the most powerful weapon which you can use to
                change the world.
              </p>
              <p
                className="mt-2 text-sm font-semibold"
                style={{ color: c.primary }}
              >
                – Nelson Mandela
              </p>
            </div>
          </div>

          {/* ── RIGHT PANEL (Form) ── */}
          <div className="flex flex-col justify-center flex-1 p-10">
            <h2
              className="text-2xl font-bold mb-1"
              style={{ color: c.textPrimary }}
            >
              Login
            </h2>
            <p className="text-sm mb-7" style={{ color: c.textSecondary }}>
              Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email / USN */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: c.textPrimary }}
                >
                  Email
                </Label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: c.textMuted }}
                  />
                  <Input
                    name="email"
                    placeholder="Enter your email or USN"
                    value={form.email}
                    onChange={handleChange}
                    className="pl-10 h-11 rounded-lg text-sm"
                    style={{
                      background: c.inputBg,
                      borderColor: c.inputBorder,
                      color: c.inputText,
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  className="text-sm font-semibold"
                  style={{ color: c.textPrimary }}
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: c.textMuted }}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-11 rounded-lg text-sm"
                    style={{
                      background: c.inputBg,
                      borderColor: c.inputBorder,
                      color: c.inputText,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: c.textMuted }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={remember}
                    onCheckedChange={setRemember}
                    style={{ accentColor: c.primary }}
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm cursor-pointer"
                    style={{ color: c.textSecondary }}
                  >
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium hover:underline"
                  style={{ color: c.primary }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-sm font-semibold rounded-lg"
                style={{
                  background: c.primary,
                  color: "#fff",
                  border: "none",
                }}
              >
                {loading ? <Spinner /> : "Login"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: c.border }} />
                <span className="text-xs" style={{ color: c.textMuted }}>
                  or continue with
                </span>
                <div className="flex-1 h-px" style={{ background: c.border }} />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-sm font-medium rounded-lg flex items-center gap-2"
                  style={{
                    background: c.socialBg,
                    borderColor: c.socialBorder,
                    color: c.textPrimary,
                  }}
                >
                  {/* Google SVG */}
                  <svg width="17" height="17" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-sm font-medium rounded-lg flex items-center gap-2"
                  style={{
                    background: c.socialBg,
                    borderColor: c.socialBorder,
                    color: c.textPrimary,
                  }}
                >
                  {/* Microsoft SVG */}
                  <svg width="16" height="16" viewBox="0 0 21 21">
                    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                  </svg>
                  Microsoft
                </Button>
              </div>

              {/* Sign up */}
              <p
                className="text-center text-sm"
                style={{ color: c.textSecondary }}
              >
                No account?{" "}
                <span className="font-medium" style={{ color: c.primary }}>
                  Contact your administrator.
                </span>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
