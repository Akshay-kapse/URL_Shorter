import { redirect, notFound } from "next/navigation";
import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import User from "@/lib/models/User";

export default async function RedirectPage({ params: { userId, shortCode } }) {
  if (!userId || !shortCode) notFound();

  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) notFound();

    const UserUrlModel = getUserUrlCollection(user.email);

    const urlDoc = await UserUrlModel.findOneAndUpdate(
      { short_code: shortCode, userEmail: user.email },
      { $inc: { visit_count: 1 }, $set: { updatedAt: new Date() } },
      { new: true }
    );

    if (!urlDoc || !urlDoc.original_url) {
      console.warn("No URL found for redirect", shortCode);
      notFound();
    }

    if (process.env.NODE_ENV === "development") {
      console.log(`Redirecting ${shortCode} → ${urlDoc.original_url}`);
    }

    redirect(urlDoc.original_url);

  } catch (err) {
    console.error("Redirect error:", err);
    notFound();
  }
}
