"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/forgotpassword`,
        { email }
      );

      toast.success(res.data.message || "Reset code sent successfully 🎉");

      router.push(`/verify-code?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex justify-center items-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
      >
        {/* Logo/Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔑</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Url<span className="text-gray-900">Shorter</span>
          </h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Forgot Password?
          </h3>
          <p className="text-gray-600 text-sm">
            No worries! Enter your email and we'll send you a reset code
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-gray-500 mt-1">
              Enter the email address associated with your account
            </p>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Reset Code</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
