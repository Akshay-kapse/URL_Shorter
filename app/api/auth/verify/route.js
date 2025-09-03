import { requireAuth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET(request) {
  try {
    const authResult = requireAuth(request);
    
    if (authResult.error) {
      return Response.json({
        success: false,
        error: authResult.error
      }, { status: authResult.status });
    }

    await connectDB();
    
    const user = await User.findById(authResult.user.id).select('-password');
    
    if (!user) {
      return Response.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Error in /api/auth/verify:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}