import { redirect, notFound } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { shorturl } = await params;

  if (!shorturl) {
    notFound();
  }

  // Redirect to backend for URL resolution
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  redirect(`${backendUrl}/${shorturl}`);
}