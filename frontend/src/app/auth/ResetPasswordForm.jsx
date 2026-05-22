"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

export default function ResetPasswordForm({ onBack }) {
  const { isLoading, errors, message, clearErrors, clearMessage, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleBackToLogin = () => {
    if (clearErrors) clearErrors();
    if (clearMessage) clearMessage();
    onBack();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanKey = recoveryKey.trim();
    await resetPassword({ 
      email: email.trim(), 
      recoveryKey: cleanKey, 
      newPassword 
    });
  };

  const errorMessage = errors
    ? Array.isArray(errors.errors)
      ? errors.errors.map((e) => e.message).join(" · ")
      : errors.message || "Something went wrong. Please check your credentials."
    : null;

  return (
    <section className="min-h-[calc(100vh-88px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden p-8 sm:p-10 flex flex-col justify-center">
        <button
          type="button"
          onClick={handleBackToLogin}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors duration-200 mb-6 self-start group focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to login
        </button>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Enter your email and the recovery key that was assigned to your account during your registration phase.
        </p>
        <AnimatePresence mode="popLayout">
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-700 text-sm font-medium mb-6"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <p>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
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
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
              Recovery Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={recoveryKey}
              onChange={(e) => setRecoveryKey(e.target.value)}
              required
              disabled={isLoading}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full border border-gray-200 py-3 px-5 rounded-full outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50/50 focus:bg-white text-[15px] text-gray-900 placeholder:text-gray-300 font-mono tracking-widest uppercase disabled:opacity-60"
            />
          </div>
          <div className="flex flex-col gap-1.5 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full border border-gray-200 py-3 pl-5 pr-14 rounded-full outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all bg-gray-50/50 focus:bg-white text-[15px] text-gray-900 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors focus:outline-none"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
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
                Resetting…
              </>
            ) : (
              "Reset Password"
            )}
          </button>

        </form>
      </div>
    </section>
  );
}