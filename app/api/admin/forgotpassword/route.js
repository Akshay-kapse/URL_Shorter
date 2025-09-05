import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withCors, handleOptions } from "@/lib/cors";
import { sendEmail } from "@/lib/sendEmail"; // ✅ use your helper

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail) {
      return withCors(
        NextResponse.json({ message: "Email required" }, { status: 400 })
      );
    }

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return withCors(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Save into schema fields
    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    // ✅ Use helper to send email
    console.log("📧 Sending email to:", cleanEmail, "with code:", resetCode);
    await sendEmail(cleanEmail, resetCode);

    return withCors(
      NextResponse.json({ success: true, message: "Code sent successfully" })
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return withCors(
      NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500 }
      )
    );
  }
}
