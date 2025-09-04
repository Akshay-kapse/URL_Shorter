import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

// Handle preflight requests
export async function OPTIONS() {
  return handleOptions();
}

export async function DELETE(request, { params }) {
  try {
    const { shortCode } = await params;

    // Authenticate user
    const authResult = requireAuth(request);
    if (authResult.error) {
      return withCors(
        new Response(
          JSON.stringify({ success: false, error: authResult.error }),
          {
            status: authResult.status,
            headers: { "Content-Type": "application/json" },
          }
        )
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
      return withCors(
        new Response(
          JSON.stringify({
            success: false,
            error: "URL not found or not yours",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        )
      );
    }

    return withCors(
      new Response(
        JSON.stringify({
          success: true,
          message: "URL deleted successfully",
          deleted: deletedUrl,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
  } catch (err) {
    console.error("Delete Error:", err);
    return withCors(
      new Response(
        JSON.stringify({ success: false, error: "Internal server error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    );
  }
}
