import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please fill required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const token = generateToken(user._id);

    return NextResponse.json(
      {
        message: "Login successful",
        token: token,
        user: { id: user._id, username: user.username, email: user.email },
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}