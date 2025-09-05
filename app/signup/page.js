"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("All fields are required ❌");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "User registered successfully ✅");
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login");
      } else {
        toast.error(data.error || "Registration failed. Try again ❌");
      }
    } catch (err) {
      console.error("Register error:", err);
      toast.error("Something went wrong. Try again ⚠️");
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
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100"
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔗</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Url<span className="text-gray-900">Shorter</span>
          </h2>
          <p className="text-gray-600">Create your account to start shortening URLs</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          {/* Email */}
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
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
              We'll use this email for your account and notifications
            </p>
          </div>

          {/* Username */}
          <div>
            <label 
              htmlFor="username"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
              minLength={3}
              maxLength={20}
              aria-describedby="username-help"
            />
            <p id="username-help" className="text-xs text-gray-500 mt-1">
              Choose a unique username (3-20 characters)
            </p>
          </div>

          {/* Password with toggle */}
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
                aria-describedby="password-help"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg select-none p-1 rounded-md hover:bg-gray-100 transition-colors"
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p id="password-help" className="text-xs text-gray-500 mt-1">
              Must be at least 6 characters long
            </p>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-gray-200 mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
