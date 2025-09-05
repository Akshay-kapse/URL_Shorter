import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import User from "@/lib/models/User"; 
import { connectDB } from "@/lib/mongodb";
import { withCors, handleOptions } from "@/lib/cors"; 

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { username, email, password } = body;

    const validation = userSchema.safeParse({ username, email, password });
    if (!validation.success) {
      return withCors(
        NextResponse.json({ error: validation.error.issues.map((e) => e.message) }, { status: 400 })
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return withCors(
        NextResponse.json({ error: "User already signed up" }, { status: 400 })
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const response = NextResponse.json(
      { message: "User signed up successfully", user: { id: newUser._id, username, email } },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return withCors(response);

  } catch (err) {
    console.error("Signup Error:", err);
    return withCors(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    );
  }
}
