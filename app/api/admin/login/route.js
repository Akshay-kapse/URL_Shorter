import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          username: user.username
        }
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}