# UrlShorter - Next.js URL Shortener with Admin Dashboard

A complete, production-ready URL shortener built with Next.js 15, MongoDB, and a secure admin dashboard. Features Bearer token authentication, persistent data storage, and comprehensive admin management.

## 🚀 Features

### Core URL Shortening
- **URL Shortening**: Convert long URLs into short, memorable links
- **Custom Short Codes**: Optional custom short codes with validation
- **Automatic Redirects**: Server-side redirects with visit tracking
- **URL Validation**: Comprehensive URL validation and normalization
- **Visit Analytics**: Track click counts for each shortened URL

### Secure Admin Dashboard
- **Bearer Token Authentication**: Secure admin access using environment-based passwords
- **Session Persistence**: Login sessions persist across page reloads using localStorage
- **Real-time Statistics**: Live dashboard with total URLs, visits, and recent activity
- **URL Management**: View, monitor, and delete shortened URLs
- **Protected API Routes**: All admin endpoints require Bearer token authentication

### Technical Features
- **MongoDB Persistence**: All data stored in MongoDB (no in-memory state)
- **Next.js App Router**: Modern Next.js 15 with App Router architecture
- **Responsive Design**: Mobile-first responsive design
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimized**: Database indexing and efficient queries

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Bearer token with environment variables
- **Deployment**: Ready for Vercel, Netlify, Railway, Render

## 📋 API Endpoints

### Public Endpoints

#### `POST /api/shorten`
Create a shortened URL.

**Request Body:**
```json
{
  "url": "https://example.com/very/long/url",
  "shortCode": "custom123" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "original_url": "https://example.com/very/long/url",
    "short_code": "custom123",
    "short_url": "http://localhost:3000/custom123",
    "visit_count": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "message": "URL shortened successfully"
}
```

#### `GET /:shortcode`
Redirect to original URL and increment visit count.

### Protected Admin Endpoints

All admin endpoints require `Authorization: Bearer <password>` header.

#### `POST /api/admin/auth`
Authenticate admin user.

**Headers:**
```
Authorization: Bearer your_admin_password
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

#### `GET /api/admin/urls`
Get all URLs with statistics.

**Headers:**
```
Authorization: Bearer your_admin_password
```

**Response:**
```json
{
  "success": true,
  "data": {
    "urls": [...],
    "stats": {
      "totalUrls": 10,
      "totalVisits": 150,
      "recentUrls": 3
    }
  }
}
```

#### `DELETE /api/admin/urls/[shortCode]`
Delete a URL by short code.

**Headers:**
```
Authorization: Bearer your_admin_password
```

**Response:**
```json
{
  "success": true,
  "message": "URL deleted successfully",
  "data": {
    "deletedUrl": {...},
    "stats": {...}
  }
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance like MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd UrlShorter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/url_shortener
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
   ADMIN_PASSWORD=your_secure_admin_password
   ```

   **Environment Variables Explained:**
   - `MONGODB_URI`: MongoDB connection string
   - `NEXT_PUBLIC_FRONTEND_URL`: Your domain (used for generating short URLs)
   - `ADMIN_PASSWORD`: Secure password for admin dashboard access

4. **Start MongoDB**
   Make sure MongoDB is running locally or use a cloud service like MongoDB Atlas.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Database Schema

The application uses a single MongoDB collection with the following schema:

```javascript
{
  original_url: String (required),
  short_code: String (required, unique, indexed),
  visit_count: Number (default: 0),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## 🔒 Security Features

### Admin Authentication
- **Bearer Token**: All admin routes require `Authorization: Bearer <password>` header
- **Environment-based**: Admin password stored securely in `.env.local`
- **Session Persistence**: Login sessions persist using localStorage
- **Route Protection**: All admin API routes verify authentication

### Input Validation
- **URL Validation**: Comprehensive URL format validation
- **Short Code Validation**: Alphanumeric characters, hyphens, and underscores only
- **SQL Injection Prevention**: Mongoose ODM provides built-in protection
- **XSS Prevention**: Input sanitization and validation

## 🧪 Testing

### Manual Testing Checklist

#### Basic Functionality
- [x] URL shortening with valid URLs
- [x] URL shortening with invalid URLs (should show error)
- [x] Custom short code creation
- [x] Duplicate short code handling
- [x] URL redirection and visit counting
- [x] 404 handling for non-existent short codes

#### Admin Dashboard
- [x] Admin login with correct password
- [x] Admin login with incorrect password (should fail)
- [x] Session persistence across page reloads
- [x] Statistics display (total URLs, visits, recent URLs)
- [x] URL listing with all details
- [x] URL deletion functionality
- [x] Logout functionality

#### API Endpoints
- [x] POST /api/shorten with valid data
- [x] POST /api/shorten with invalid data
- [x] POST /api/admin/auth with valid password
- [x] POST /api/admin/auth with invalid password
- [x] GET /api/admin/urls with valid token
- [x] GET /api/admin/urls with invalid token
- [x] DELETE /api/admin/urls/[shortCode] with valid token

### Test URLs
- **Valid URLs**: `https://google.com`, `http://example.com`, `facebook.com`
- **Invalid URLs**: `not-a-url`, `ftp://example.com`, `javascript:alert(1)`

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXT_PUBLIC_FRONTEND_URL` (your Vercel domain)
   - `ADMIN_PASSWORD`
4. Deploy!

### Other Platforms
The app is compatible with:
- **Railway**: Add environment variables and deploy
- **Render**: Configure environment variables and build settings
- **Netlify**: Use Netlify Functions for API routes
- **Any Node.js hosting**: Ensure environment variables are set

### MongoDB Atlas Setup
For production, use MongoDB Atlas:
1. Create a free cluster at [mongodb.com](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in your environment variables

## 📊 Performance Optimizations

- **Database Indexing**: Indexed queries on `short_code` and `createdAt`
- **Connection Pooling**: Mongoose connection reuse
- **Efficient Queries**: Optimized MongoDB queries with `.lean()`
- **Client-side Caching**: Session persistence reduces API calls

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env.local`
   - Verify network connectivity for cloud databases

2. **Admin Login Not Working**
   - Check `ADMIN_PASSWORD` in `.env.local`
   - Clear localStorage and try again
   - Verify password in browser network tab

3. **Short URLs Not Redirecting**
   - Check if URL exists in database
   - Verify `NEXT_PUBLIC_FRONTEND_URL` is correct
   - Check browser console for errors

## 📝 Requirements Completion Checklist

### ✅ Completed Requirements

#### Basic Features
- [x] Allow users to input long URLs and get shortened links
- [x] Redirect short links to original URLs
- [x] POST /api/shorten endpoint
- [x] GET /:shortcode redirect endpoint

#### Database Schema
- [x] MongoDB schema with original_url, short_code, created_at, updated_at
- [x] Added visit_count tracking
- [x] All data persisted in MongoDB (no in-memory state)
- [x] connectDB() utility for all database interactions

#### Admin Authentication & Protection
- [x] Admin password stored in .env as ADMIN_PASSWORD
- [x] Bearer token authentication for all /api/admin/* routes
- [x] Login form at /admin with password submission to /api/admin/auth
- [x] Session persistence across page reloads using localStorage
- [x] Access restriction to admin dashboard when not authenticated

#### Backend API Endpoints
- [x] POST /api/admin/auth with Bearer token verification
- [x] GET /api/admin/urls with protected access and full stats
- [x] DELETE /api/admin/urls/[shortCode] with authentication
- [x] All endpoints return proper success/error responses

#### Admin Dashboard UX
- [x] Total URLs count display
- [x] Total visits across all URLs
- [x] Recent URLs (24h) count
- [x] Data table with short code (clickable), original URL, visit count, created date
- [x] Delete functionality for each URL
- [x] Bearer token sent in Authorization header for all requests
- [x] Session persistence and logout functionality

#### General Requirements
- [x] All data stored/retrieved from MongoDB via Mongoose
- [x] connectDB() utility used for all database interactions
- [x] Error messages for failed login, invalid URLs, backend errors
- [x] Well-organized, modular code structure
- [x] Complete documentation and setup instructions

#### Testing & Validation
- [x] All features work after page reload
- [x] URLs and stats persist in database
- [x] Admin endpoints fully protected
- [x] Invalid/valid password handling
- [x] Edge case handling (non-existent URLs, etc.)

### 🎯 Additional Enhancements Implemented
- [x] Custom short code support with validation
- [x] URL normalization and comprehensive validation
- [x] Copy to clipboard functionality
- [x] Responsive mobile design
- [x] Loading states and user feedback
- [x] Professional UI/UX design
- [x] Database indexing for performance
- [x] Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Next.js 15, MongoDB, and modern web technologies.**

For questions or support, please open an issue on GitHub.