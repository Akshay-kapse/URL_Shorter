import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "User logged out successfully" },
      { status: 200 }
    );

    // Clear JWT cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
