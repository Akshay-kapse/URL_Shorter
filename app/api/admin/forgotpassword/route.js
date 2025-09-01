import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import User from "@/lib/models/User";
import {sendEmail} from "@/lib/sendEmail";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.code = code;
    user.expiresAt = expiresAt;
    await user.save();

    await sendEmail(email, code);

    return NextResponse.json({ message: "Code sent successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
