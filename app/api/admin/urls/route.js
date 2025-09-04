import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get("email");

    // Require authentication
    const authResult = requireAuth(request);
    if (authResult.error) {
      return withCors(
        NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status })
      );
    }

    await connectDB();
    const emailToQuery = targetEmail || authResult.user.email;
    const UserUrlModel = getUserUrlCollection(emailToQuery);

    const urls = await UserUrlModel.find({ userEmail: emailToQuery })
      .sort({ createdAt: -1 })
      .lean();

    const totalUrls = urls.length;
    const totalVisits = urls.reduce((sum, url) => sum + (url.visit_count || 0), 0);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

    const formattedUrls = urls.map(url => ({
      _id: url._id.toString(),
      original_url: url.original_url,
      short_code: url.short_code,
      short_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${url.userId}/${url.short_code}`,
      visit_count: url.visit_count || 0,
      created_at: url.createdAt,
      updated_at: url.updatedAt,
    }));

    return withCors(
      NextResponse.json({
        success: true,
        data: { urls: formattedUrls, stats: { totalUrls, totalVisits, recentUrls }, userEmail: emailToQuery },
      })
    );

  } catch (error) {
    console.error("Error in /api/admin/urls:", error);
    return withCors(
      NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
    );
  }
}
