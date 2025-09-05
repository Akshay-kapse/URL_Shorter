"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        {/* Logo/Heading */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Url<span className="text-gray-900">Shorten</span>
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email to reset your password
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Code"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Remember your password?{" "}
            <a
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
