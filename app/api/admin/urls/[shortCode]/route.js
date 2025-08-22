// app/api/admin/urls/[shortCode]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";
import { verifyAdminAuth } from "@/lib/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!verifyAdminAuth(authHeader)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { shortCode } = params;
    if (!shortCode) {
      return NextResponse.json({ success: false, error: "Short code missing" }, { status: 400 });
    }

    await connectDB();

    const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });
    if (!deletedUrl) {
      return NextResponse.json({ success: false, error: "URL not found" }, { status: 404 });
    }

    // Optionally return updated stats for UI convenience
    const totalUrls = await Url.countDocuments();
    const aggregate = await Url.aggregate([{ $group: { _id: null, totalVisits: { $sum: "$visit_count" } } }]);
    const totalVisits = aggregate[0]?.totalVisits || 0;

    return NextResponse.json({
      success: true,
      message: "URL deleted successfully",
      data: { stats: { totalUrls, totalVisits } },
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/urls/[shortCode]", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
