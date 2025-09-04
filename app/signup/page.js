"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // ✅ import toast

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("All fields are required ❌"); // ❌ replaced alert
      return;
    }

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
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#0C67A0] font-sans">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 sm:w-96">
        <form onSubmit={handleRegister}>
          <div className="text-center mb-6">
            <div className="text-2xl font-semibold">
              Bit<span className="font-bold text-blue-500">Links</span>
            </div>
          </div>

          <h2 className="mb-5 text-xl font-semibold text-center">
            Registration
          </h2>

          {/* Email */}
          <label className="mb-1 text-sm block">Email</label>
          <input
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          {/* Username */}
          <label className="mb-1 text-sm block">Username</label>
          <input
            className="w-full p-2 mb-3 border border-gray-300 rounded"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          {/* Password with toggle */}
          <label className="mb-1 text-sm block">Password</label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border mb-3 border-gray-300 rounded" // pr-12 reserves space for the icon
              required
            />

            {/* Accessible button, vertically centered */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-5 right-3 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            >
              <span className="leading-none">{showPassword ? "🙈" : "👁️"}</span>
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 p-2 bg-[#033452] text-white rounded hover:bg-[#02223f]"
          >
            Register
          </button>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login Now
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
