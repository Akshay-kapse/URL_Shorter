import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import { generateShortCode, isValidUrl, normalizeUrl, validateShortCode } from "@/lib/utils";
import { requireAuth } from "@/lib/auth";
import { withCors, handleOptions } from "@/lib/cors";

// Handle preflight
export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request) {
  try {
    // Authenticate user
    const authResult = requireAuth(request);
    if (authResult.error) {
      return withCors(
        new Response(JSON.stringify({
          success: false,
          error: "Authentication required to create short URLs"
        }), { status: authResult.status, headers: { "Content-Type": "application/json" } })
      );
    }

    const { originalUrl, shortCode } = await request.json();

    if (!originalUrl) {
      return withCors(
        new Response(JSON.stringify({ success: false, error: "Original URL is required" }), { status: 400, headers: { "Content-Type": "application/json" } })
      );
    }

    const normalizedUrl = normalizeUrl(originalUrl);
    if (!isValidUrl(normalizedUrl)) {
      return withCors(
        new Response(JSON.stringify({
          success: false,
          error: "Please enter a valid URL (must include http:// or https://)"
        }), { status: 400, headers: { "Content-Type": "application/json" } })
      );
    }

    if (shortCode && !validateShortCode(shortCode)) {
      return withCors(
        new Response(JSON.stringify({
          success: false,
          error: "Short code must be 3-20 characters and contain only letters, numbers, hyphens, and underscores"
        }), { status: 400, headers: { "Content-Type": "application/json" } })
      );
    }

    await connectDB();
    const UserUrlModel = getUserUrlCollection(authResult.user.email);

    // Generate or validate short code
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
        return withCors(
          new Response(JSON.stringify({
            success: false,
            error: "Short code already exists. Choose another."
          }), { status: 409, headers: { "Content-Type": "application/json" } })
        );
      }
    }

    // Avoid duplicate URLs for the same user
    const existingUrl = await UserUrlModel.findOne({
      original_url: normalizedUrl,
      userId: authResult.user.id
    });

    if (existingUrl) {
      return withCors(
        new Response(JSON.stringify({
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
        }), { status: 200, headers: { "Content-Type": "application/json" } })
      );
    }

    // Save new URL
    const newUrl = new UserUrlModel({
      userId: authResult.user.id,
      userEmail: authResult.user.email,
      original_url: normalizedUrl,
      short_code: finalShortCode
    });

    await newUrl.save();

    return withCors(
      new Response(JSON.stringify({
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
      }), { status: 201, headers: { "Content-Type": "application/json" } })
    );

  } catch (error) {
    console.error("Error in /api/shorten:", error);
    return withCors(
      new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } })
    );
  }
}
