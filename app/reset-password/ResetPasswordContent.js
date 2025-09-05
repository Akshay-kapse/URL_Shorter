"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("⚠️ Email is missing. Please restart the process.");
      router.push("/forgot-password");
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("⚠️ Both password fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("⚠️ Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/reset-password`,
        { email, newPassword: password }
      );

      toast.success(res.data.message || "✅ Password reset successful!");
      router.push("/login");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error(error.response?.data?.message || "⚠️ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
      >
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔐</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Url<span className="text-gray-900">Shorter</span>
          </h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Reset Your Password
          </h3>
          <p className="text-gray-600 text-sm">
            Create a new secure password for your account
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          {/* Email (readonly) */}
          <div>
            <label 
              htmlFor="email"
              className="block text-gray-700 mb-2 text-sm font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email || ""}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          {/* New Password */}
          <div>
            <label 
              htmlFor="password"
              className="block text-gray-700 mb-2 text-sm font-semibold"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
                required
                minLength={6}
                aria-describedby="password-help"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg p-1 rounded-md hover:bg-gray-100 transition-colors"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p id="password-help" className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label 
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2 text-sm font-semibold"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
                required
                aria-describedby="confirm-password-help"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg p-1 rounded-md hover:bg-gray-100 transition-colors"
                disabled={loading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p id="confirm-password-help" className="text-xs text-gray-500 mt-1">
              Re-enter your new password
            </p>
          </div>

          {/* Password mismatch warning */}
          {confirmPassword && password !== confirmPassword && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <span>⚠️</span>
              <span>Passwords do not match</span>
            </motion.div>
          )}

          {/* Submit button */}
          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200">
          <Link
            href="/login"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
