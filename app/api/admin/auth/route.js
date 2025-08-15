import { verifyAdminAuth } from '@/lib/utils';

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return Response.json({
        success: false,
        error: 'Authorization header required'
      }, { status: 401 });
    }

    const isValid = verifyAdminAuth(authHeader);
    
    if (isValid) {
      return Response.json({
        success: true,
        message: 'Authentication successful'
      });
    } else {
      return Response.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Error in /api/admin/auth:', error);
    return Response.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
}