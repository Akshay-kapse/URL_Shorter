"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // ✅ import toast

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required"); // ❌ alert → ✅ toast
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

        toast.success(data.message || "Login successful ✅"); 
        setEmail("");
        setPassword("");
        router.push("/");
      } else {
        toast.error(data.error || "Invalid credentials ❌"); 
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Something went wrong. Try again ⚠️"); 
        }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0C67A0] font-sans">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
        <form onSubmit={handleLogin}>
          <div className="text-center mb-6">
            <div className="text-2xl font-semibold">
              Bit<span className="text-blue-500 font-bold">Links</span>
            </div>
          </div>
          <h2 className="mb-5 text-xl font-semibold text-center">Login</h2>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm mb-1 block">Email</label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password with toggle */}
          <label className="text-sm mb-1 block">Password</label>
          <div className="relative mb-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Forgot Password */}
          <div className="mb-4 text-right">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#033452] text-white p-2 rounded hover:bg-[#02223f]"
          >
            Login
          </button>

          {/* Sign Up */}
          <p className="mt-4 text-center text-sm">
            New User?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up Now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
