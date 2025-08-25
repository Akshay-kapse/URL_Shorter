import { connectDB } from '@/lib/mongodb';
import Url from '@/lib/models/Url';
import { generateShortCode, isValidUrl, normalizeUrl } from '@/lib/utils';

export async function POST(request) {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      return Response.json({
        success: false,
        error: 'Database configuration error'
      }, { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_FRONTEND_URL) {
      return Response.json({
        success: false,
        error: 'Host configuration error'
      }, { status: 500 });
    }

    const body = await request.json();
    const { url: originalUrl, shortCode: customShortCode } = body;

    // Validate input
    if (!originalUrl) {
      return Response.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 });
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(originalUrl);
    if (!isValidUrl(normalizedUrl)) {
      return Response.json({
        success: false,
        error: 'Please enter a valid URL'
      }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Generate or use custom short code
    let shortCode = customShortCode;
    if (!shortCode) {
      // Generate unique short code
      do {
        shortCode = generateShortCode();
      } while (await Url.findOne({ short_code: shortCode }));
    } else {
      // Validate custom short code
      if (!/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
        return Response.json({
          success: false,
          error: 'Short code can only contain letters, numbers, hyphens, and underscores'
        }, { status: 400 });
      }

      // Check if custom short code already exists
      const existingUrl = await Url.findOne({ short_code: shortCode });
      if (existingUrl) {
        return Response.json({
          success: false,
          error: 'Short code already exists. Please choose a different one.'
        }, { status: 409 });
      }
    }

    
    // Check if URL already exists
    const existingUrl = await Url.findOne({ original_url: normalizedUrl });
    if (existingUrl) {
      return Response.json({
        success: true,
        data: {
          original_url: existingUrl.original_url,
          short_code: existingUrl.short_code,
          short_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${existingUrl.short_code}`,
          visit_count: existingUrl.visit_count,
          created_at: existingUrl.createdAt
        },
        message: 'URL already shortened'
      });
    }

    // Create new URL entry
    const newUrl = new Url({
      original_url: normalizedUrl,
      short_code: shortCode
    });

    await newUrl.save();

    return Response.json({
      success: true,
      data: {
        original_url: newUrl.original_url,
        short_code: newUrl.short_code,
        short_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${newUrl.short_code}`,
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