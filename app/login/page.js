"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required ❌");
      return;
    }

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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4">
       <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Logo / Brand */}
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Url<span className="text-gray-900">Shorten</span>
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">
          Login to your account
        </h3>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 text-sm font-medium block text-gray-700">
              Email
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 text-sm font-medium block text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer text-lg select-none"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Login
          </button>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-600">
            New user?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up Now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
