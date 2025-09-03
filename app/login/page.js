// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       alert("All fields are required");
//       return;
//     }

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert(data.message || "Login successful");
//         setEmail("");
//         setPassword("");
//         router.push("/"); // redirect to admin page
//       } else {
//         alert(data.error || "Invalid credentials");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       alert("Something went wrong. Try again.");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-[#0C67A0] font-sans">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96">
//         <form onSubmit={handleLogin}>
//           <div className="text-center mb-6">
//             <div className="text-2xl font-semibold">
//               Bit<span className="text-blue-500 font-bold">Links</span>
//             </div>
//           </div>
//           <h2 className="mb-5 text-xl font-semibold text-center">Login</h2>

//           {/* Email */}
//           <div className="mb-4">
//             <label className="text-sm mb-1 block">Email</label>
//             <input
//               className="w-full p-2 border border-gray-300 rounded"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password with toggle */}
//           <div className="mb-4 relative">
//             <label className="text-sm mb-1 block">Password</label>
//             <input
//               className="w-full p-2 border border-gray-300 rounded pr-10"
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               required
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute top-9 right-3 text-gray-500 cursor-pointer"
//             >
//               {showPassword ? (
//                 <svg xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none" viewBox="0 0 24 24"
//                   stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-.69.07-1.36.203-2M6.29 6.29a9.956 9.956 0 00-1.9 2.665M9 9a3 3 0 104.243 4.243M15 15l3.536 3.536M3 3l18 18" />
//                 </svg>
//               ) : (
//                 <svg xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none" viewBox="0 0 24 24"
//                   stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M15 12a3 3 0 11-6 0 3 0 016 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                     d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                 </svg>
//               )}
//             </span>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="w-full bg-[#033452] text-white p-2 rounded hover:bg-[#02223f]"
//           >
//             Login
//           </button>

//           {/* Sign Up */}
//           <p className="mt-4 text-center text-sm">
//             New User?{" "}
//             <a href="/signup" className="text-blue-500 hover:underline">
//               Sign Up Now
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
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

      if (res.ok && data.token) {
        const user = { email: data.user.email, id: data.user._id }; // store userId
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("user_email", data.user.email); // optional, already doing
        localStorage.setItem("user_id", data.user.id); // store userId separately
        localStorage.setItem("admin_token", data.token);
        console.log(localStorage.getItem("user_id")); // should print actual MongoDB ObjectId


        alert(data.message || "Login successful");
        setEmail("");
        setPassword("");
        router.push("/");
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
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
          <div className="mb-2 relative">
            <label className="text-sm mb-1 block">Password</label>
            <input
              className="w-full p-2 border border-gray-300 rounded pr-10"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? (
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
                    d="M15 12a3 3 0 11-6 0 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
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
