import { NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/cors";

export async function OPTIONS() {
  return handleOptions();
}

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "User logged out successfully" },
      { status: 200 }
    );

    // Clear JWT cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return withCors(response);
  } catch (err) {
    console.error("Logout Error:", err);
    return withCors(
      NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    );
  }
}
