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

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Url from "@/lib/models/Url";

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { shortCode } = params;

    const deleted = await Url.findOneAndDelete({ short_code: shortCode });

    if (!deleted) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "URL deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
