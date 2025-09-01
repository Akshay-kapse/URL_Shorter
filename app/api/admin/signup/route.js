import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User"; 
import {connectDB} from "@/lib/mongodb";

// Zod schema validation
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { username, email, password } = body;

    // Validate input
    const validation = userSchema.safeParse({ username, email, password });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already Signup" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Save JWT as HttpOnly cookie
    const response = NextResponse.json(
  {
    message: "User signed up successfully",
    user: { id: newUser._id, username, email },
  },
  { status: 201 }
);


    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err) {
    console.error("Signup Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
