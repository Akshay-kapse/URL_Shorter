"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || ""; // From query params

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please restart the process.");
      router.push("/forgot-password");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/verify-code`, {
        email: email.trim(),
        code: code.trim(),
      });

      if (res.data.message === "Code verified successfully") {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0C67A0]">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          BitLinks
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 text-center mb-4">
          Verify Code
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          A verification code has been sent to your email:
        </p>
        <p className="text-center font-semibold text-gray-700 mb-6">{email}</p>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter your code"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
