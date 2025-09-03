"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "User registered successfully");
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login");
      } else {
        alert(data.error || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong. Try again.");
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
            className="p-2 mb-3 border border-gray-300 rounded w-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          {/* Username */}
          <label className="mb-1 text-sm block">Username</label>
          <input
            className="p-2 mb-3 border border-gray-300 rounded w-full"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />

          {/* Password with toggle */}
          <label className="mb-1 text-sm block">Password</label>
          <div className="relative mb-3">
            <input
              className="p-2 pr-10 w-full border border-gray-300 rounded"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-2 text-gray-600"
            >
              {showPassword ? (
                // Eye Off SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.36.203-2M6.29 6.29a9.956 9.956 0 00-1.9 2.665M9 9a3 3 0 104.243 4.243M15 15l3.536 3.536M3 3l18 18"
                  />
                </svg>
              ) : (
                // Eye SVG
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full p-2 bg-[#033452] text-white rounded hover:bg-[#02223f]"
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
