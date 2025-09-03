// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Url from "@/lib/models/Url";
// import { verifyAdminAuth } from "@/lib/utils";

// export async function DELETE(request, { params }) {
//   try {
//     const { shortCode } = params;

//     // Auth check
//     const authHeader = request.headers.get("authorization");
//     if (!verifyAdminAuth(authHeader)) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Connect to DB
//     await connectDB();

//     // Delete from MongoDB
//     const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });

//     if (!deletedUrl) {
//       return NextResponse.json(
//         { success: false, error: "URL not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "URL deleted successfully",
//       deleted: deletedUrl,
//     });
//   } catch (err) {
//     console.error("Delete Error:", err);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";
import { requireAuth } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const { shortCode } = params;

    // ✅ Check auth (user must be logged in)
    const authResult = requireAuth(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    await connectDB();

    // ✅ Delete only if URL belongs to the logged-in user
    const deletedUrl = await Url.findOneAndDelete({
      short_code: shortCode,
      userId: authResult.user.id,
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
