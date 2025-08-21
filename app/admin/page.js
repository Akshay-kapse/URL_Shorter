"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalVisits: 0,
    recentUrls: 0,
  });

  // Check for existing session on component mount
  useEffect(() => {
    const savedPassword = localStorage.getItem("admin_session");
    if (savedPassword) {
      setPassword(savedPassword);
      verifyAndFetchData(savedPassword);
    }
  }, []);

  const verifyAndFetchData = async (pwd) => {
    try {
      const response = await fetch("/api/admin/urls", {
        headers: {
          Authorization: `Bearer ${pwd}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setIsAuthenticated(true);
        setUrls(result.data.urls);
        setStats(result.data.stats);
        setError("");
      } else {
        // Clear invalid session
        localStorage.removeItem("admin_session");
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
      }
    } catch (error) {
      localStorage.removeItem("admin_session");
      setIsAuthenticated(false);
      setError("Failed to verify session");
    }
  };

  const authenticate = async () => {
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }

    setAuthLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        // Save session
        localStorage.setItem("admin_session", password);
        setIsAuthenticated(true);
        setError("");
        fetchUrls();
      } else {
        setError(result.error || "Invalid password");
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const sessionPassword = localStorage.getItem("admin_session") || password;
      const response = await fetch("/api/admin/urls", {
        headers: {
          Authorization: `Bearer ${sessionPassword}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setUrls(result.data.urls);
        setStats(result.data.stats);
        setError("");
      } else {
        if (response.status === 401) {
          // Session expired
          logout();
        } else {
          setError(result.error || "Failed to fetch URLs");
        }
      }
    } catch (error) {
      setError("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

// async function deleteUrl(shortCode) {
//   try {
//     const res = await fetch(`/api/admin/urls/${shortCode}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.ADMIN_PASSWORD}`, // or however you handle admin auth
//       },
//     });

//     const data = await res.json();
//     console.log("Delete response:", data);

//     if (!res.ok) throw new Error(data.error || "Delete failed");
//     return data;
//   } catch (error) {
//     console.error("Delete failed:", error);
//     throw error;
//   }
// }FF

const deleteUrl = async (shortCode) => {
  try {
     const sessionPassword = localStorage.getItem("admin_session") || password
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/urls/${shortCode}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionPassword}`, // or however you handle admin auth
        },
      });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to delete URL");
    }

    const data = await res.json(); // ✅ only once
    console.log("Deleted:", data);
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  const logout = () => {
    localStorage.removeItem("admin_session");
    setIsAuthenticated(false);
    setPassword("");
    setUrls([]);
    setStats({ totalUrls: 0, totalVisits: 0, recentUrls: 0 });
    setError("");
  };

  const copyShortUrl = (shortCode) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    alert("Short URL copied to clipboard!");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">
              Enter your admin password to access the dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) =>
                e.key === "Enter" && !authLoading && authenticate()
              }
              disabled={authLoading}
            />
            <button
              onClick={authenticate}
              disabled={authLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold py-3 px-4 rounded-md transition-colors"
            >
              {authLoading ? "Authenticating..." : "Login"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-purple-600 hover:text-purple-800">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={fetchUrls}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-md transition-colors"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Logout
            </button>
            <Link
              href="/"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total URLs
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalUrls}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Total Visits
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalVisits}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Recent URLs (24h)
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {stats.recentUrls}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* URLs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Shortened URLs
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600">Loading URLs...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original URL
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
                  {urls.map((url) => (
                    <tr key={url._id} className="hover:bg-gray-50">
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
                    </tr>
                  ))}
                </tbody>
              </table>

              {urls.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-lg">No URLs found</p>
                  <p className="text-sm mt-2">
                    Start by creating some short URLs!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
