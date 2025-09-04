import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { withCors, handleOptions } from "@/lib/cors"; // import central CORS helper

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req) {
  try {
    await connectDB();
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return withCors(
        NextResponse.json({ message: "Email and password required" }, { status: 400 })
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, resetCode: null, resetCodeExpires: null },
      { new: true }
    );

    if (!updatedUser) {
      return withCors(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    return withCors(
      NextResponse.json({ success: true, message: "Password reset successful" })
    );
  } catch (err) {
    console.error("ResetPassword error:", err);
    return withCors(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}
