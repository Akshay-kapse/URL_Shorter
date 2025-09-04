import { requireAuth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { withCors, handleOptions } from '@/lib/cors';

// Handle preflight requests
export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request) {
  try {
    // Authenticate user
    const authResult = requireAuth(request);
    if (authResult.error) {
      return withCors(Response.json({
        success: false,
        error: authResult.error
      }, { status: authResult.status }));
    }

    await connectDB();

    // Find user by ID and exclude password
    const user = await User.findById(authResult.user.id).select('-password');
    if (!user) {
      return withCors(Response.json({
        success: false,
        error: 'User not found'
      }, { status: 404 }));
    }

    return withCors(Response.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username
      }
    }));

  } catch (error) {
    console.error('Error in /api/auth/verify:', error);
    return withCors(Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 }));
  }
}
