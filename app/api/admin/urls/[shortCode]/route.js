import { connectDB } from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { verifyAdminAuth } from '@/lib/utils';

export async function DELETE(request, { params }) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!verifyAdminAuth(authHeader)) {
      return Response.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { shortCode } = await params;
    
    if (!shortCode) {
      return Response.json({
        success: false,
        error: 'Short code is required'
      }, { status: 400 });
    }

    await connectDB();

    // Delete the URL
    const deletedUrl = await Url.findOneAndDelete({ short_code: shortCode });
  
    if (!deletedUrl) {
      return Response.json({
        success: false,
        error: 'URL not found'
      }, { status: 404 });
    }

    // Get updated stats
    const urls = await Url.find({}).lean();
    const totalUrls = urls.length;
    const totalVisits = urls.reduce((sum, url) => sum + (url.visit_count || 0), 0);
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

    return Response.json({
      success: true,
      message: 'URL deleted successfully',
      data: {
        deletedUrl: {
          short_code: deletedUrl.short_code,
          original_url: deletedUrl.original_url
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