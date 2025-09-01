// import { connectDB } from '@/lib/mongodb';
// import Url from '@/lib/models/Url';
// import { verifyAdminAuth } from '@/lib/utils';

// export async function GET(request) {
//   try {
//     const authHeader = request.headers.get('authorization');
//     if (!verifyAdminAuth(authHeader)) {
//       return Response.json({
//         success: false,
//         error: 'Unauthorized'
//       }, { status: 401 });
//     }

//     await connectDB();

//     const urls = await Url.find({}).sort({ createdAt: -1 }).lean();

//     const totalUrls = urls.length;
//     const totalVisits = urls.reduce((sum, url) => sum + (url.visit_count || 0), 0);

//     const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
//     const recentUrls = urls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

//     const formattedUrls = urls.map(url => ({
//       _id: url._id.toString(),
//       original_url: url.original_url,
//       short_code: url.short_code,
//       visit_count: url.visit_count || 0,
//       created_at: url.createdAt,
//       updated_at: url.updatedAt
//     }));

//     return Response.json({
//       success: true,
//       data: {
//         urls: formattedUrls,
//         stats: {
//           totalUrls,
//           totalVisits,
//           recentUrls
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Error in /api/admin/urls:', error);
//     return Response.json({
//       success: false,
//       error: 'Internal server error'
//     }, { status: 500 });
//   }
// }

import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { success: false, error: "Unauthorized - Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return Response.json(
        { success: false, error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch only URLs created by this user
    const urls = await Url.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    const totalUrls = urls.length;
    const totalVisits = urls.reduce(
      (sum, url) => sum + (url.visit_count || 0),
      0
    );

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urls.filter(
      (url) => new Date(url.createdAt) > oneDayAgo
    ).length;

    const formattedUrls = urls.map((url) => ({
      _id: url._id.toString(),
      original_url: url.original_url,
      short_code: url.short_code,
      visit_count: url.visit_count || 0,
      created_at: url.createdAt,
      updated_at: url.updatedAt,
    }));

    return Response.json({
      success: true,
      data: {
        urls: formattedUrls,
        stats: {
          totalUrls,
          totalVisits,
          recentUrls,
        },
      },
    });
  } catch (error) {
    console.error("Error in /api/urls:", error);
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
