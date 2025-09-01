"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const AnimatedSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

const AdminPage = () => {
  const { isAuthenticated, token, user, logout } = useAuth();
  const router = useRouter();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalVisits: 0,
    recentUrls: 0,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login');
    } else {
      fetchUrls();
    }
  }, [isAuthenticated, router]);

  const fetchUrls = async () => {
    if (!token) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/admin/urls', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        setUrls(result.data.urls);
        setStats(result.data.stats);
      } else {
        if (response.status === 401) {
          logout();
        } else {
          setError(result.error || "Failed to fetch URLs");
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  const deleteUrl = async (shortCode) => {
    if (!confirm(`Are you sure you want to delete the short URL "${shortCode}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/urls/${shortCode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchUrls(); // Refresh data
      } else {
        setError(result.error || "Failed to delete URL");
      }
    } catch (error) {
      console.error('Delete error:', error);
      setError("Failed to delete URL");
    }
  };

  const copyShortUrl = async (shortCode) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      // Show success feedback
      const button = event.target;
      const originalText = button.innerHTML;
      button.innerHTML = '✓ Copied!';
      button.className = button.className.replace('text-gray-400', 'text-green-500');
      setTimeout(() => {
        button.innerHTML = originalText;
        button.className = button.className.replace('text-green-500', 'text-gray-400');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy URL');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user?.email}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={fetchUrls}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </button>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Logout
              </button>
              <Link
                href="/shorten"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Create URL
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Error Message */}
        {error && (
          <AnimatedSection>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
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
            </div>
          </AnimatedSection>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total URLs", value: stats.totalUrls, color: "text-purple-600", icon: "🔗" },
            { label: "Total Visits", value: stats.totalVisits, color: "text-green-600", icon: "👁️" },
            { label: "Recent URLs (24h)", value: stats.recentUrls, color: "text-blue-600", icon: "⚡" },
          ].map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {stat.label}
                    </h3>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* URLs Table */}
        <AnimatedSection>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Shortened URLs
              </h2>
            </div>
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="mt-2 text-gray-600">Loading URLs...</p>
              </div>
            ) : urls.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first short URL!</p>
                <Link
                  href="/shorten"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
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
                    {urls.map((url, i) => (
                      <motion.tr
                        key={url._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <a
                              href={url.original_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 truncate block"
                              title={url.original_url}
                            >
                              {url.original_url}
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/${url.short_code}`}
                              target="_blank"
                              className="text-purple-600 hover:text-purple-800 font-mono text-sm"
                            >
                              {url.short_code}
                            </Link>
                            <button
                              onClick={() => copyShortUrl(url.short_code)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Copy short URL"
                            >
                              📋
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {url.visit_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(url.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteUrl(url.short_code)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default AdminPage;