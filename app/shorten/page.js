"use client";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import toast from "react-hot-toast";

// Reusable Animated Section
function AnimatedSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.25,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 80 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeOut" },
        },
      }}
      className="transform-gpu will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export default function ShortenPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urlData, setUrlData] = useState(null);

  const generate = async () => {
    if (!originalUrl.trim()) {
      toast.error("Please enter a URL ❌"); 
      return;
    }

    setLoading(true);
    setError("");
    setGenerated("");
    setUrlData(null);
    const token = localStorage.getItem("admin_token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({
          originalUrl: originalUrl.trim(),
          shortCode: shortCode?.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGenerated(result.data.short_url);
        setUrlData(result.data);
        setOriginalUrl("");
        setShortCode("");
         toast.success("Short URL generated 🎉");
     } else {
        toast.error(result.error || "An error occurred ❌");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Network error. Please try again ⚠️");
    } finally {
      setLoading(false);
    }
  }

   const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      toast.success("Link copied to clipboard ✅"); 
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link ❌");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      generate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="mx-auto max-w-2xl bg-white my-16 p-8 rounded-xl shadow-xl border border-gray-100">
        <AnimatedSection>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">🔗</span>
            </div>
            <h1 className="font-bold text-3xl text-gray-900 mb-2">
              Create Short URL
            </h1>
            <p className="text-gray-600">
              Transform your long URLs into short, shareable links
            </p>
            <div className="mt-4 flex justify-center space-x-4">
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Dashboard
              </Link>
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {error && (
          <AnimatedSection>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {error}
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="originalUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Original URL *
              </label>
              <input
                id="originalUrl"
                type="text"
                value={originalUrl}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-colors"
                placeholder="Enter your URL (e.g., https://example.com/very/long/path)"
                onChange={(e) => setOriginalUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="shortCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Custom Short Code (optional)
              </label>
              <input
                id="shortCode"
                type="text"
                value={shortCode}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg transition-colors"
                placeholder="Custom code (3-20 characters)"
                onChange={(e) => setShortCode(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                maxLength={20}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to generate automatically using nanoid
              </p>
            </div>

            <button
              onClick={generate}
              disabled={loading || !originalUrl.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed rounded-lg shadow-lg p-4 font-bold text-white transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Generate Short URL
                </>
              )}
            </button>
          </div>
        </AnimatedSection>

        {generated && urlData && (
          <AnimatedSection>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 rounded-xl mt-8"
            >
              <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                Success! Your short URL is ready
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-green-200 px-4 py-3 rounded-lg flex-1 shadow-sm">
                    <Link
                      target="_blank"
                      href={generated}
                      className="text-blue-600 hover:text-blue-800 font-mono break-all text-lg font-semibold"
                    >
                      {generated}
                    </Link>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
                  >
                    📋 Copy
                  </button>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <strong className="text-gray-800">Original URL:</strong>{" "}
                      <span className="break-all">{urlData.original_url}</span>
                    </p>
                    <p>
                      <strong className="text-gray-800">Short Code:</strong>{" "}
                      <code className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-mono">
                        {urlData.short_code}
                      </code>
                    </p>
                    <p>
                      <strong className="text-gray-800">Visits:</strong>{" "}
                      {urlData.visit_count}
                    </p>
                    <p>
                      <strong className="text-gray-800">Created:</strong>{" "}
                      {new Date(urlData.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/admin"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    View All URLs →
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
