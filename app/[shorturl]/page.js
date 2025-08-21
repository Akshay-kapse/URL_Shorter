import { redirect, notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Url from "@/lib/models/Url";

export default async function RedirectPage({ params }) {
  const { shorturl } = await params;

  if (!shorturl) {
    notFound();
  }

  // Connect to MongoDB
  await connectDB();

  // Find and update visit count atomically
  const urlDoc = await Url.findOneAndUpdate(
    { short_code: shorturl },
    {
      $inc: { visit_count: 1 },
      $set: { updatedAt: new Date() },
    },
    { new: true }
  );

  // No matching short code
  if (!urlDoc) {
    notFound();
  }

  // Log in development only
  if (process.env.NODE_ENV === "development") {
    console.log(`Redirecting ${shorturl} to: ${urlDoc.original_url}`);
  }

  // Let Next.js handle redirect
  redirect(urlDoc.original_url);

  // (No try/catch around redirect!)
}
