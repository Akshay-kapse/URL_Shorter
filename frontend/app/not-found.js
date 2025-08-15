import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Short URL Not Found</h2>
          <p className="text-gray-600 mb-8">
            The short URL you requested does not exist or may have been deleted.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/shorten"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Create a Short URL
          </Link>
          <div>
            <Link 
              href="/"
              className="text-purple-600 hover:text-purple-800"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}