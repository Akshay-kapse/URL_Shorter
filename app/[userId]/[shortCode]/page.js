import { redirect, notFound } from "next/navigation";
import { connectDB, getUserUrlCollection } from "@/lib/mongodb";
import User from "@/lib/models/User";
// Optional: only if you keep a try/catch
import { isRedirectError } from "next/dist/client/components/redirect";

export default async function RedirectPage({ params }) {
  const { userId, shortCode } = await params; // ✅ keep this

  if (!userId || !shortCode) notFound();

  // Do work without try/catch, or don’t catch redirects
  await connectDB();

  const user = await User.findById(userId);
  if (!user) notFound();

  const UserUrlModel = getUserUrlCollection(user.email);
  const urlDoc = await UserUrlModel.findOneAndUpdate(
    { short_code: shortCode, userEmail: user.email },
    { $inc: { visit_count: 1 }, $set: { updatedAt: new Date() } },
    { new: true }
  );

  if (!urlDoc?.original_url) notFound();

  // ✅ This will throw internally and Next will handle it as a redirect
  redirect(urlDoc.original_url);
}
