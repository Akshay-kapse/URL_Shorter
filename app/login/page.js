"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required ❌");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        const user = data.data.user;
        const token = data.data.token;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_email", user.email);
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("admin_token", token);

        toast.success(data.message || "Login successful 🎉");
        setEmail("");
        setPassword("");
        router.push("/");
      } else {
        toast.error(data.error || "Invalid credentials ❌");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong ⚠️");
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
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🔗</span>
          </div>
          <h2 className="text-3xl font-extrabold text-blue-600 mb-2">
            Url<span className="text-gray-900">Shorter</span>
          </h2>
          <p className="text-gray-600">Welcome back! Please sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              required
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-gray-500 mt-1">
              Enter the email address associated with your account
            </p>
          </div>

          {/* Password */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={loading}
                required
                aria-describedby="password-help"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer text-lg select-none p-1 rounded-md hover:bg-gray-100 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={loading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p id="password-help" className="text-xs text-gray-500 mt-1">
              Enter your account password
            </p>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
            >
              Forgot Password?
            </Link>
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
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </>
            )}
          </motion.button>

          {/* Signup link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
