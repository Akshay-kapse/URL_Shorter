import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";  // ✅ import footer
import ToastProvider from "@/components/ToastProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "UrlShorter - Professional URL Shortener",
  description:
    "Transform your long URLs into short, shareable links. Fast, secure, and completely free with detailed analytics.",
  keywords:
    "URL shortener, link shortener, short links, bitly alternative, free URL shortener",
  authors: [{ name: "UrlShorter Team" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"
  ),
  robots: "index, follow",
  openGraph: {
    title: "UrlShorter - Professional URL Shortener",
    description:
      "Transform your long URLs into short, shareable links. Fast, secure, and completely free.",
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrlShorter - Professional URL Shortener",
    description:
      "Transform your long URLs into short, shareable links. Fast, secure, and completely free.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900`}
      >
        {/* ✅ Navbar hidden on auth pages */}
        <Navbar />

        <main className="min-h-screen">{children}</main>

        <ToastProvider />

        {/* ✅ Footer hidden on auth pages */}
        <Footer />
      </body>
    </html>
  );
}
