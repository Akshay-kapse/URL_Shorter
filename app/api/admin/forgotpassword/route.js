import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withCors, handleOptions } from "@/lib/cors";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email via Resend
    console.log("📧 Sending email to:", cleanEmail, "with code:", resetCode);

    await resend.emails.send({
      from: "noreply@yourdomain.com", // ⚠️ Replace with a verified sender in Resend
      to: cleanEmail,
      subject: "Your Password Reset Code",
      html: `<p>Your reset code is <strong>${resetCode}</strong>. It will expire in 10 minutes.</p>`,
    });

    console.log("✅ Email sent successfully");

    return withCors(
      NextResponse.json({ success: true, message: "Code sent successfully" })
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return withCors(
      NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
    );
  }
}
