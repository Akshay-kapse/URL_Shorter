"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
    className="hover:bg-blue-50 transition-colors duration-200 group"
  >
    <td className="px-6 py-4">
      <div className="max-w-xs lg:max-w-sm">
        <a
          href={url.original_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 truncate block font-medium transition-colors"
          title={url.original_url}
        >
          {url.original_url}
        </a>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-2">
        <code className="text-purple-600 font-mono text-sm bg-purple-50 px-2 py-1 rounded-md">
          {url.short_code}
        </code>
        <motion.button
          onClick={() => onCopy(url.short_url)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-100"
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
        </motion.button>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
        {url.visit_count}
      </span>
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      <div className="text-xs lg:text-sm">
        {new Date(url.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </td>
    <td className="px-6 py-4">
      <motion.button
        onClick={() => onDelete(url.short_code)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="text-red-600 hover:text-red-800 font-medium transition-all duration-200 hover:bg-red-50 px-3 py-2 rounded-lg flex items-center space-x-1 group-hover:shadow-md"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span className="hidden sm:inline">Delete</span>
      </motion.button>
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("user_email"); // stored on login
    if (email) {
      setUserEmail(email);
      fetchUserUrls(email);
    }
  }, []);

  const recalcStats = (urlsArray) => {
    const totalUrls = urlsArray.length;
    const totalVisits = urlsArray.reduce(
      (sum, url) => sum + (url.visit_count || 0),
      0
    );
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentUrls = urlsArray.filter(
      (url) => new Date(url.created_at) > oneDayAgo
    ).length;

    setStats({ totalUrls, totalVisits, recentUrls });
  };

  const fetchUserUrls = async (email) => {
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const url = `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/api/admin/urls?email=${encodeURIComponent(email)}`;
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserUrls(userEmail);
    setRefreshing(false);
  };
  const deleteUrl = async (shortCode) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-3 p-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm font-medium">Confirm Deletion</p>
          </div>
          <p className="text-sm text-gray-600">
            Delete short URL:{" "}
            <code className="bg-gray-100 px-1 rounded text-red-600 font-mono">
              {shortCode}
            </code>
            ?
          </p>
          <div className="flex justify-end space-x-2">
            <motion.button
              onClick={async () => {
                toast.dismiss(t.id); // close confirm toast

                try {
                  const token = localStorage.getItem("admin_token");
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete/${shortCode}`,
                    {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );

                  const result = await response.json();

                  if (result.success) {
                    setUrls((prev) => {
                      const updatedUrls = prev.filter(
                        (url) => url.short_code !== shortCode
                      );
                      recalcStats(updatedUrls); // recalc stats
                      return updatedUrls;
                    });

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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors font-medium"
            >
              Yes, Delete
            </motion.button>

            <motion.button
              onClick={() => toast.dismiss(t.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ),
      {
        duration: 8000,
        style: {
          background: "white",
          color: "#374151",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }
    );
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🔗</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Dashboard
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Welcome back, {userEmail || "User"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Refresh Button */}
              <motion.button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <svg
                  className={`w-5 h-5 ${
                    loading || refreshing ? "animate-spin" : ""
                  }`}
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
                <span className="hidden sm:inline">
                  {loading || refreshing ? "Refreshing..." : "Refresh"}
                </span>
              </motion.button>

              {/* New URL Button */}
              <Link
                href="/shorten"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
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
                <span className="hidden sm:inline">New URL</span>
              </Link>

              {/* Home Button */}
              <Link
                href="/"
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M19 21H5C4.4477 21 4 20.5523 4 20V11L1 11L12 1L23 11H20V20C20 20.5523 19.5523 21 19 21ZM6 19H18V9.15745L12 3.7029L6 9.15745V19Z" />
                </svg>
                <span className="hidden sm:inline">Home</span>
              </Link>

              {/* Logout Button */}
              <Link
                href="/signup"
                className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-blue-800 hover:to-red-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 sm:hidden" 
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
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
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        >
          <div className="px-4 lg:px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <span>📊</span>
                <span>Your URLs</span>
              </h2>
              <div className="text-xs lg:text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                {urls.length} {urls.length === 1 ? "URL" : "URLs"} total
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-8 lg:p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your URLs...</p>
            </div>
          ) : urls.length === 0 ? (
            <div className="p-8 lg:p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No URLs yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start by creating your first short URL!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/shorten"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl space-x-2"
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
                  <span>Create Your First URL</span>
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Visits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
          className="mt-6 lg:mt-8 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/shorten"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 space-x-3"
            >
              <svg
                className="w-6 h-6"
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
        </motion.div>
      </div>
    </div>
  );
}
