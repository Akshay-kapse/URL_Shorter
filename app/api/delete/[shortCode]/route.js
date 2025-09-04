import { NextResponse } from "next/server";
import { connectDB, getUserUrlCollection } from "@/lib/mongodb"; 
import { requireAuth } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const { shortCode } = await params;

    const authResult = requireAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    const userEmail = authResult.user.email;

    const UserUrlModel = getUserUrlCollection(userEmail);

    const deletedUrl = await UserUrlModel.findOneAndDelete({
      short_code: shortCode,
      userEmail: userEmail,
    });

    if (!deletedUrl) {
      return NextResponse.json(
        { success: false, error: "URL not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "URL deleted successfully",
      deleted: deletedUrl,
    });
  } catch (err) {
    console.error("Delete Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
