import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const { shortCode } = params;
    
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult.error) {
      return Response.json({
        success: false,
        error: authResult.error
      }, { status: authResult.status });
    }

    await connectDB();

    // Get user-specific collection
    const UserUrlModel = getUserUrlCollection(authResult.user.email);

    // Find and delete URL only if it belongs to the authenticated user
    const deletedUrl = await UserUrlModel.findOneAndDelete({ 
      short_code: shortCode,
      userId: authResult.user.id,
      userEmail: authResult.user.email
    });

    if (!deletedUrl) {
      return Response.json({
        success: false,
        error: "URL not found or you don't have permission to delete it"
      }, { status: 404 });
    }

    // Get updated statistics after deletion
    const remainingUrls = await UserUrlModel.find({ userEmail: authResult.user.email }).lean();
    const totalUrls = remainingUrls.length;
    const totalVisits = remainingUrls.reduce((sum, url) => sum + (url.visit_count || 0), 0);
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = remainingUrls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

    return Response.json({
      success: true,
      message: "URL deleted successfully",
      data: {
        deletedUrl: {
          _id: deletedUrl._id.toString(),
          original_url: deletedUrl.original_url,
          short_code: deletedUrl.short_code,
          visit_count: deletedUrl.visit_count
        },
        stats: {
          totalUrls,
          totalVisits,
          recentUrls
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