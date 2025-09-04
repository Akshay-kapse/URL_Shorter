import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import { generateShortCode, isValidUrl, normalizeUrl, validateShortCode } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  try {

    const authResult = requireAuth(request);
    if (authResult.error) {
      return Response.json({
        success: false,
        error: "Authentication required to create short URLs"
      }, { status: authResult.status });
    }

    const { originalUrl, shortCode } = await request.json();

    if (!originalUrl) {
      return Response.json({ success: false, error: "Original URL is required" }, { status: 400 });
    }

    const normalizedUrl = normalizeUrl(originalUrl);
    if (!isValidUrl(normalizedUrl)) {
      return Response.json({
        success: false,
        error: "Please enter a valid URL (must include http:// or https://)"
      }, { status: 400 });
    }

    if (shortCode && !validateShortCode(shortCode)) {
      return Response.json({
        success: false,
        error: "Short code must be 3-20 characters and contain only letters, numbers, hyphens, and underscores"
      }, { status: 400 });
    }

    await connectDB();

    const UserUrlModel = getUserUrlCollection(authResult.user.email);

    let finalShortCode = shortCode;
    if (!finalShortCode) {
      let attempts = 0;
      do {
        finalShortCode = generateShortCode();
        attempts++;
        if (attempts > 10) throw new Error("Unable to generate unique short code");
      } while (await UserUrlModel.findOne({ short_code: finalShortCode }));
    } else {
      const exists = await UserUrlModel.findOne({ short_code: finalShortCode });
      if (exists) {
        return Response.json({
          success: false,
          error: "Short code already exists. Choose another."
        }, { status: 409 });
      }
    }

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
        message: "URL already shortened"
      });
    }

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
      message: "URL shortened successfully"
    });

  } catch (error) {
    console.error("Error in /api/shorten:", error);
    return Response.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
