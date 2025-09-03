import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import { generateShortCode, isValidUrl, normalizeUrl, validateShortCode } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult.error) {
      return Response.json({
        success: false,
        error: 'Authentication required to create short URLs'
      }, { status: authResult.status });
    }

    const { originalUrl, shortCode } = await request.json();

    // Validate required fields
    if (!originalUrl) {
      return Response.json({
        success: false,
        error: 'Original URL is required'
      }, { status: 400 });
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(originalUrl);
    if (!isValidUrl(normalizedUrl)) {
      return Response.json({
        success: false,
        error: 'Please enter a valid URL (must include http:// or https://)'
      }, { status: 400 });
    }

    // Validate custom short code if provided
    if (shortCode && !validateShortCode(shortCode)) {
      return Response.json({
        success: false,
        error: 'Short code must be 3-20 characters and contain only letters, numbers, hyphens, and underscores'
      }, { status: 400 });
    }

    await connectDB();

    // Get user-specific collection
    const UserUrlModel = getUserUrlCollection(authResult.user.email);

    // Generate or use custom short code
    let finalShortCode = shortCode;
    if (!finalShortCode) {
      // Generate unique short code for this user
      let attempts = 0;
      do {
        finalShortCode = generateShortCode();
        attempts++;
        if (attempts > 10) {
          throw new Error('Unable to generate unique short code');
        }
      } while (await UserUrlModel.findOne({ short_code: finalShortCode }));
    } else {
      // Check if custom short code already exists for this user
      const existingUrl = await UserUrlModel.findOne({ short_code: finalShortCode });
      if (existingUrl) {
        return Response.json({
          success: false,
          error: 'Short code already exists in your collection. Please choose a different one.'
        }, { status: 409 });
      }
    }

    // Check if URL already exists for this user
    const existingUrl = await UserUrlModel.findOne({
      original_url: normalizedUrl,
      userId: authResult.user.id
    });

    if (existingUrl) {
      return Response.json({
        success: true,
        data: {
          _id: existingUrl._id.toString(),
          original_url: existingUrl.original_url,
          short_code: existingUrl.short_code,
          short_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${authResult.user.id}/${existingUrl.short_code}`,
          visit_count: existingUrl.visit_count,
          created_at: existingUrl.createdAt
        },
        message: 'URL already shortened'
      });
    }

    // Create new URL entry in user's collection
    const newUrl = new UserUrlModel({
      userId: authResult.user.id,
      userEmail: authResult.user.email,
      original_url: normalizedUrl,
      short_code: finalShortCode
    });

    await newUrl.save();

    return Response.json({
      success: true,
      data: {
        _id: newUrl._id.toString(),
        original_url: newUrl.original_url,
        short_code: newUrl.short_code,
        short_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${authResult.user.id}/${newUrl.short_code}`,
        visit_count: newUrl.visit_count,
        created_at: newUrl.createdAt
      },
      message: 'URL shortened successfully'
    });

  } catch (error) {
    console.error('Error in /api/shorten:', error);
    return Response.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}