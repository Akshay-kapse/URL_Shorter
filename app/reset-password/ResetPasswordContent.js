"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4">
     <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        {/* Branding */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Url<span className="text-gray-900">Shorten</span>
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">
          Reset Your Password
        </h3>

        <form onSubmit={handleReset} className="space-y-5">
          {/* Email (readonly) */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              value={email || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 mb-1 text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Password mismatch warning */}
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-500 -mt-3">
              Passwords do not match
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
