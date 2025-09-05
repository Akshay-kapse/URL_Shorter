"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo/Heading */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Url<span className="text-gray-900">Shorten</span>
        </h2>

        <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">
          Verify Code
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          A verification code has been sent to:
        </p>
        <p className="text-center font-medium text-blue-600 mb-6">{email}</p>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn’t get the code?{" "}
            <a
              href="/forgot-password"
              className="text-blue-600 font-medium hover:underline"
            >
              Resend
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
