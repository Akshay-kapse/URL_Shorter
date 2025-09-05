"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please restart the process.");
      router.push("/forgot-password");
      return;
    }

    if (!code.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    if (code.trim().length !== 6) {
      toast.error("Verification code must be 6 digits.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/verify-code`,
        { email: email.trim(), code: code.trim() }
      );

      if (res.data.success) {
        toast.success("Code verified successfully!");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(res.data.message || "Invalid code");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email is missing. Please restart the process.");
      return;
    }

    setResending(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/forgotpassword`,
        { email }
      );
      toast.success("New verification code sent! 📧");
    } catch (error) {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
      >
        {/* Logo/Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">📧</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Url<span className="text-gray-900">Shorter</span>
          </h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Verify Your Code
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            We've sent a 6-digit verification code to:
          </p>
          <p className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
            {email}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label 
              htmlFor="code"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              placeholder="000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-center text-2xl font-mono tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
              required
              maxLength={6}
              pattern="[0-9]{6}"
              aria-describedby="code-help"
            />
            <p id="code-help" className="text-xs text-gray-500 mt-1 text-center">
              Enter the 6-digit code from your email
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
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Code</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200 space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResendCode}
              disabled={resending || loading}
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
          <div>
            <Link
              href="/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition-colors"
            >
              ← Back to Email Entry
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
