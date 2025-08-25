
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Url from "@/lib/models/Url";
// import { verifyAdminAuth } from "@/lib/utils";


// const allowedOrigins = [
//   "https://url-shorter-cyan.vercel.app",
//   "http://localhost:"
// ];

// function getCorsHeaders(origin) {
//   return {
//     "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
//     "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   };
// }

// export async function OPTIONS(request) {
//   const origin = request.headers.get("origin");
//   return new Response(null, {
//     status: 204,
//     headers: getCorsHeaders(origin),
//   });
// }

// export async function DELETE(request, { params }) {
//   const origin = request.headers.get("origin");
//   console.log("🔥 DELETE route hit with params:", params);
//   try {
//     const authHeader = request.headers.get("authorization");
//     if (!verifyAdminAuth(authHeader)) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }
//     console.log("Deleting short code:", params.shortCode);
//     await connectDB();

//     const { shortCode } = params; // ✅ must match folder name
//     console.log("shortCode param received:", shortCode)
//     if (!shortCode) {
//       return NextResponse.json(
//         { success: false, error: "Short code missing" },
//         { status: 400 }
//       );
//     }

//     const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });
//     if (!deletedUrl) {
//       return NextResponse.json(
//         { success: false, error: "URL not found" },
//         { status: 404 }
//       );
//     }

//    return NextResponse.json(
//       { success: true, message: "URL deleted" },
//       { headers: getCorsHeaders(origin) }
//     );
//   } catch (err) {
//     console.error("Error in DELETE:", err);
//     return NextResponse.json(
//       { success: false, error: err.message },
//       { status: 500, headers: getCorsHeaders(origin) }
//     );
//   }
// }


// import { connectDB } from "@/lib/mongodb";
// import Url from "@/lib/models/Url";
// import { verifyAdminAuth } from "@/lib/utils";
// import { NextResponse } from "next/server";

// export async function DELETE(request) {
//   console.log("DELETE request received");
//   try {
//     const authHeader = request.headers.get("authorization");

//     if (!verifyAdminAuth(authHeader)) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Get shortCode from request body
//     const { shortCode } = await request.json();

//     if (!shortCode) {
//       return NextResponse.json(
//         { success: false, error: "Missing shortCode" },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     const deletedUrl = await Url.findOneAndDelete({ shortCode });

//     if (!deletedUrl) {
//       return NextResponse.json(
//         { success: false, error: "URL not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, message: "URL deleted" });
//   } catch (error) {
//     console.error("DELETE /api/delete error:", error);
//     return NextResponse.json(
//       { success: false, error: "Server error" },
//       { status: 500 }
//     );
//   }
// }



// import { connectDB } from "@/lib/mongodb";
// import Url from "@/lib/models/Url";
// import { verifyAdminAuth } from "@/lib/utils";
// import { NextResponse } from "next/server";

// export async function DELETE(request, { params }) {
//   console.log("🔥 DELETE route hit with params:", params);
//   return NextResponse.json({ success: true, params });
// }



import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";
import { verifyAdminAuth } from "@/lib/utils";

export async function DELETE(request, { params }) {
  try {
    const { shortCode } = params;

    // Auth check
    const authHeader = request.headers.get("authorization");
    if (!verifyAdminAuth(authHeader)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to DB
    await connectDB();

    // Delete from MongoDB
    const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });

    if (!deletedUrl) {
      return NextResponse.json(
        { success: false, error: "URL not found" },
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
