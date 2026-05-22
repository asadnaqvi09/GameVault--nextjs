"use client";

import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AuthPage() {
  const router = useRouter();
  const { isLoading, errors, clearErrors, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);

  const handleTabSwitch = () => {
    clearErrors();
    setIsLogin((p) => !p);
    setUsername("");
    setEmail("");
    setPassword("");
    setTogglePassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await login({ email, password });
      if (result && !result.error) {
        router.push("/");
      }
    } else {
      const result = await register({ userName: username, email, password });
      if (result && !result.error) {
        router.push("/");
      }
    }
  };

  const errorMessage = errors
    ? Array.isArray(errors.errors)
      ? errors.errors.map((e) => e.message).join(" · ")
      : errors.message || "An unexpected error occurred."
    : null;

  if (showReset) {
    return <ResetPasswordForm onBack={() => setShowReset(false)} />;
  }

  return (
    <section className="min-h-[calc(100vh-88px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200 mb-8 self-start group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
            {isLogin ? "Welcome Back!" : "Create an Account!"}
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            {isLogin ? "Please enter your credentials to access your profile." : "Fill in your details below to secure your new account."}
          </p>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden flex flex-col gap-1.5"
                >
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    disabled={isLoading}
                    placeholder="johndoe"
                    className="w-full border border-gray-200 py-3 px-5 rounded-full outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50/50 focus:bg-white text-[15px] text-gray-900 disabled:opacity-60"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full border border-gray-200 py-3 px-5 rounded-full outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50/50 focus:bg-white text-[15px] text-gray-900 disabled:opacity-60"
              />
            </div>
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type={togglePassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 py-3 pl-5 pr-14 rounded-full outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50/50 focus:bg-white text-[15px] text-gray-900 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setTogglePassword(!togglePassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors focus:outline-none"
                  tabIndex="-1"
                >
                  {togglePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="flex justify-end items-center text-sm px-1 my-1">
                <button
                  type="button"
                  onClick={() => setShowReset(true)}
                  className="text-indigo-500 hover:text-indigo-700 transition-colors font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}
            <AnimatePresence mode="popLayout">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 text-sm font-medium px-4"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-full font-bold shadow-lg shadow-indigo-600/10 hover:bg-indigo-700 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[15px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isLogin ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                isLogin ? "Sign In" : "Get Started"
              )}
            </button>
          </form>
        </div>
        <div className="w-full md:w-[35%] bg-gradient-to-br from-indigo-600 to-indigo-900 text-white p-8 sm:p-12 flex flex-col justify-center items-center text-center gap-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
          <motion.div
            key={isLogin ? "login-side" : "register-side"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-4 relative z-10"
          >
            <h2 className="text-3xl font-black tracking-tight">
              {isLogin ? "New Here?" : "Welcome Back!"}
            </h2>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-xs">
              {isLogin
                ? "Registering allows you to securely track orders, build game wishlists, and view purchase histories instantly."
                : "Log back into your space to view personalized deals and access saved vault keys seamlessly."}
            </p>
            <button
              onClick={handleTabSwitch}
              className="mt-4 bg-white/10 hover:bg-white text-white hover:text-indigo-900 border border-white/20 hover:border-white px-10 py-3 rounded-full font-bold transition-all duration-200 active:scale-[0.97] shadow-sm backdrop-blur-sm"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}