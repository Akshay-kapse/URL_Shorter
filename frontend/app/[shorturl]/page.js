import { redirect, notFound } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { shorturl } = params;
  if (!shorturl) notFound();
  // Always redirect to backend, and backend handles DB lookup and 301 redirect
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  redirect(`${backendUrl}/${shorturl}`);
}