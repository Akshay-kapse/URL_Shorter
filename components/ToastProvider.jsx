"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"   // ✅ changed from top-right to top-center
      reverseOrder={false}
      toastOptions={{
        duration: 3000,       // default time (can adjust)
        style: {
          fontSize: "14px",
          borderRadius: "10px",
          padding: "12px 16px",
        },
      }}
    />
  );
}