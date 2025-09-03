import { redirect, notFound } from "next/navigation";
import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function RedirectPage({ params }) {
  const { userId, shortCode } = params;

  if (!shortCode || !userId) {
    notFound();
  }

  try {
    await connectDB();

    // First, find the user to get their email
    const user = await User.findById(userId);
    if (!user) {
      notFound();
    }

    // Get user-specific collection
    const UserUrlModel = getUserUrlCollection(user.email);

    // Find and update the URL document
    const urlDoc = await UserUrlModel.findOneAndUpdate(
      { 
        short_code: shortCode,
        userId: userId,
        userEmail: user.email
      },
      {
        $inc: { visit_count: 1 },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!urlDoc) {
      notFound();
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`Redirecting user ${userId}'s ${shortCode} → ${urlDoc.original_url}`);
    }

    redirect(urlDoc.original_url);

  } catch (error) {
    console.error('Redirect error:', error);
    notFound();
  }
}