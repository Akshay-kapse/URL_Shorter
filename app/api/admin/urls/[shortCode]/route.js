import { connectDB } from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { verifyAdminAuth } from '@/lib/utils';

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!verifyAdminAuth(authHeader)) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB(); // ✅ Only DB connect here

    const { shortCode } = params;
    console.log("🗑 Deleting shortCode:", shortCode);

    const deleted = await Url.findOneAndDelete({ shortCode });

    if (!deleted) {
      return Response.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return Response.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    return Response.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
