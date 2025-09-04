"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color
          .replace("text-", "bg-")
          .replace("-600", "-100")}`}
      >
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  </motion.div>
);

const URLRow = ({ url, index, onDelete, onCopy }) => (
  <motion.tr
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="hover:bg-gray-50 transition-colors duration-200"
  >
    <td className="px-6 py-4">
      <div className="max-w-xs">
        <a
          href={url.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 truncate block font-medium"
          title={url.original_url}
        >
          {url.original_url}
        </a>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-2">
        <code className="text-purple-600 font-mono text-sm bg-purple-50 px-2 py-1 rounded">
          {url.short_code}
        </code>
        <button
          onClick={() => onCopy(url.short_url)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Copy short URL"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        {url.visit_count}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {new Date(url.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </td>
    <td className="px-6 py-4">
      <button
        onClick={() => onDelete(url.short_code)}
        className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-md"
      >
        Delete
      </button>
    </td>
  </motion.tr>
);

export default function AdminDashboard() {
  const [urls, setUrls] = useState([]);
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalVisits: 0,
    recentUrls: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("user_email"); // stored on login
    if (email) {
      setUserEmail(email);
      fetchUserUrls(email);
    }
  }, []);

  const fetchUserUrls = async (email) => {
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/urls?email=${encodeURIComponent(email)}`;
      const token = localStorage.getItem("admin_token"); // get token from login
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // <-- send token
        },
      });

      const result = await response.json();

      if (result.success) {
        setUrls(result.data.urls);
        setStats(result.data.stats);
        toast.success("URLs loaded successfully!");
      } else {
        toast.error(result.error || "Failed to fetch URLs");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };


  const deleteUrl = async (shortCode) => {
  toast((t) => (
    <div className="flex flex-col space-y-3">
      <p className="text-sm">
        Are you sure you want to delete the short URL:{" "}
        <span className="font-semibold text-red-600">{shortCode}</span>?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={async () => {
            toast.dismiss(t.id); // close confirm toast

            try {
              const token = localStorage.getItem("admin_token");
              const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/${shortCode}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });

              const result = await response.json();

              if (result.success) {
                setUrls((prev) =>
                  prev.filter((url) => url.short_code !== shortCode)
                );

                if (result.stats) {
                  setStats(result.stats);
                }

                setError(null);
                toast.success("URL deleted successfully ✅");
              } else {
                toast.error(result.error || "Failed to delete URL ❌");
              }
            } catch (error) {
              console.error("Delete error:", error);
              toast.error("Failed to delete URL ❌");
            }
          }}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
        >
          Yes, Delete
        </button>

        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  ), { duration: 5000 });
};


  const copyShortUrl = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("✓ Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {userEmail || "User"}
                </p>
              </div>
            </div>
            <button
              onClick={() => fetchUserUrls(userEmail)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{loading ? "Refreshing..." : "Refresh"}</span>
            </button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  {error}
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total URLs"
            value={stats.totalUrls}
            icon="🔗"
            color="text-blue-600"
          />
          <StatCard
            title="Total Visits"
            value={stats.totalVisits}
            icon="👁️"
            color="text-green-600"
          />
          <StatCard
            title="Recent URLs (24h)"
            value={stats.recentUrls}
            icon="⚡"
            color="text-purple-600"
          />
        </div>

        {/* URLs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Shortened URLs
              </h2>
              <div className="text-sm text-gray-600">
                {urls.length} {urls.length === 1 ? "URL" : "URLs"} total
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading URLs...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No URLs yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by creating your first short URL!
              </p>
              <Link
                href="/shorten"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Create Short URL
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {urls.map((url, index) => (
                      <URLRow
                        key={url._id}
                        url={url}
                        index={index}
                        onDelete={deleteUrl}
                        onCopy={copyShortUrl}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link
            href="/shorten"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Create New Short URL</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
