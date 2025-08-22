// // app/api/admin/urls/[shortCode]/route.js
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Url from "@/lib/models/Url";
// import { verifyAdminAuth } from "@/lib/utils";

// export async function DELETE(req, { params }) {
//   console.log("DELETE request received for shortCode:", params.shortCode);
//   console.log("params:", params);

//   try {
//     // ✅ Verify auth like in GET
//     const authHeader = req.headers.get("authorization");
//     if (!verifyAdminAuth(authHeader)) {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { shortCode } = params;
//     console.log("shortCode param received:", shortCode);

//     if (!shortCode) {
//       return NextResponse.json(
//         { success: false, error: "Short code is required" },
//         { status: 400 }
//       );
//     }

//     await connectDB();
//     console.log("shortCode param received:", shortCode);
//     const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });
//     console.log("deletedUrl:", deletedUrl);

//     if (!deletedUrl) {
//       return NextResponse.json(
//         { success: false, error: "URL not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "URL deleted successfully",
//     });
//   }  catch (error) {
//   console.error("Error deleting URL:", error);
//   return NextResponse.json(
//     { success: false, error: "Internal server error", details: error.message },
//     { status: 500 }
//   );
// }
// }

// app/api/admin/urls/[shortCode]/route.js
// import { connectDB } from "@/lib/mongodb";
// import Url from "@/lib/models/Url";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "https://url-shorter-cyan.vercel.app", // your frontend
//   "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// // Handle preflight
// export async function OPTIONS() {
//   return new Response(null, {
//     status: 204,
//     headers: corsHeaders,
//   });
// }

// export async function DELETE(request, { params }) {
//   console.log("Delete route hit");
//   try {
//     const { shortCode } = params;
//     console.log("DELETE request received for shortCode:", shortCode);
//     console.log("Params received:", params);
//     if (!shortCode) {
//       return Response.json(
//         { success: false, error: "shortCode is required" },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // const authHeader = request.headers.get("authorization");
//     // if (!verifyAdminAuth(authHeader)) {
//     //   return Response.json(
//     //     { success: false, error: "Unauthorized" },
//     //     { status: 401, headers: corsHeaders }
//     //   );
//     // }

//     await connectDB();
//     const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });

//     if (!deletedUrl) {
//       return Response.json(
//         { success: false, error: "URL not found" },
//         { status: 404, headers: corsHeaders }
//       );
//     }

//     return Response.json(
//       { success: true, message: "URL deleted successfully" },
//       { status: 200, headers: corsHeaders }
//     );
//   } catch (err) {
//     console.error("DELETE error:", err);
//     return Response.json(
//       { success: false, error: "Internal Server Error" },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// app/api/admin/urls/[shortCode]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";
import { verifyAdminAuth } from "@/lib/utils";


const corsHeaders = {
  "Access-Control-Allow-Origin": "https://url-shorter-cyan.vercel.app, http://localhost:3000", 
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}


export async function DELETE(request, { params }) {
  console.log("🔥 DELETE route hit with params:", params);
  try {
    const authHeader = request.headers.get("authorization");
    if (!verifyAdminAuth(authHeader)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.log("Deleting short code:", params.shortCode);
    await connectDB();

    const { shortCode } = params; // ✅ must match folder name
    console.log("shortCode param received:", shortCode)
    if (!shortCode) {
      return NextResponse.json(
        { success: false, error: "Short code missing" },
        { status: 400 }
      );
    }

    const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });
    if (!deletedUrl) {
      return NextResponse.json(
        { success: false, error: "URL not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "URL deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/admin/urls:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
