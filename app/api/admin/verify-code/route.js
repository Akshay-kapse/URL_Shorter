import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    const record = await User.findOne({ email });
    if (!record) {
      return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    // Check if reset request exists
    if (!record.resetCode || !record.resetCodeExpires) {
      return NextResponse.json({ message: "No reset request found" }, { status: 400 });
    }

    // Check expiry
    if (record.resetCodeExpires < new Date()) {
      return NextResponse.json({ message: "Code expired" }, { status: 400 });
    }

    // Compare codes safely
    if (String(record.resetCode) === String(code)) {
      return NextResponse.json({
        success: true,
        message: "Code verified successfully",
      });
    }

    return NextResponse.json({ message: "Invalid code" }, { status: 400 });
  } catch (err) {
    console.error("VerifyCode error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
