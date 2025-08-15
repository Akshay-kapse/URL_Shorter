import { connectDB } from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { verifyAdminAuth } from '@/lib/utils';

export async function GET(request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!verifyAdminAuth(authHeader)) {
      return Response.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    await connectDB();

    // Get all URLs with stats
    const urls = await Url.find({}).sort({ createdAt: -1 }).lean();
    
    // Calculate stats
    const totalUrls = urls.length;
    const totalVisits = urls.reduce((sum, url) => sum + (url.visit_count || 0), 0);
    
    // URLs created in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urls.filter(url => new Date(url.createdAt) > oneDayAgo).length;

    // Format URLs for frontend
    const formattedUrls = urls.map(url => ({
      _id: url._id.toString(),
      original_url: url.original_url,
      short_code: url.short_code,
      visit_count: url.visit_count || 0,
      created_at: url.createdAt,
      updated_at: url.updatedAt
    }));

    return Response.json({
      success: true,
      data: {
        urls: formattedUrls,
        stats: {
          totalUrls,
          totalVisits,
          recentUrls
        }
      }
    });

  } catch (error) {
    console.error('Error in /api/admin/urls:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}