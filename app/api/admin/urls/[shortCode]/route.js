import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";
import { requireAuth } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const { shortCode } = params;
    
    const authResult = requireAuth(request);
    
    if (authResult.error) {
      return Response.json({
        success: false,
        error: authResult.error
      }, { status: authResult.status });
    }

    await connectDB();

    // Find and delete URL only if it belongs to the authenticated user
    const deletedUrl = await Url.findOneAndDelete({ 
      short_code: shortCode,
      userId: authResult.user.id 
    });

    if (!deletedUrl) {
      return Response.json({
        success: false,
        error: "URL not found or you don't have permission to delete it"
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "URL deleted successfully",
      data: {
        deletedUrl: {
          _id: deletedUrl._id.toString(),
          original_url: deletedUrl.original_url,
          short_code: deletedUrl.short_code,
          visit_count: deletedUrl.visit_count
        }
      }
    });

  } catch (error) {
    console.error('Error in DELETE /api/admin/urls/[shortCode]:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}