# Deployment Guide: Frontend (Vercel) + Backend (Render)

This guide will help you deploy your URL shortener with the frontend on Vercel and backend on Render.

## 🚀 Backend Deployment (Render)

### 1. Prepare Backend Repository
1. Create a new GitHub repository for the backend
2. Copy all files from the `backend/` folder to the root of this repository
3. Push to GitHub

### 2. Deploy on Render
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your backend GitHub repository
4. Configure the service:
   - **Name**: `urlshorter-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier is fine for testing

### 3. Set Environment Variables on Render
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshorter
NEXT_PUBLIC_FRONTEND_URL=https://your-frontend-app.vercel.app
ADMIN_PASSWORD=your_secure_admin_password_here
NEXT_PUBLIC_BACKEND_URL=https://your-backend-app.onrender.com
```

**Important**: Replace the URLs with your actual deployed URLs.

## 🌐 Frontend Deployment (Vercel)

### 1. Prepare Frontend Repository
1. Create a new GitHub repository for the frontend
2. Copy all files from the `frontend/` folder to the root of this repository
3. Push to GitHub

### 2. Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your frontend GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 3. Set Environment Variables on Vercel
Add these environment variables in Vercel dashboard:

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-app.onrender.com
FRONTEND_URL=https://your-frontend-app.vercel.app
```

## 📊 MongoDB Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database user
4. Whitelist IP addresses (or use 0.0.0.0/0 for all IPs)

### 2. Get Connection String
1. In Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Use this as your `MONGODB_URI`

## 🔧 Configuration Steps

### 1. Update Backend Environment Variables
After deploying both services, update the environment variables:

**On Render (Backend):**
- `NEXT_PUBLIC_FRONTEND_URL`: Your Vercel app URL
- `NEXT_PUBLIC_BACKEND_URL`: Your Render app URL

**On Vercel (Frontend):**
- `NEXT_PUBLIC_BACKEND_URL`: Your Render app URL
- `NEXT_PUBLIC_FRONTEND_URL`: Your Vercel app URL

### 2. Test the Deployment
1. Visit your Vercel frontend URL
2. Try shortening a URL
3. Test the admin dashboard
4. Verify redirects work from the backend URL

## 🛠️ Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `NEXT_PUBLIC_FRONTEND_URL` in backend matches your Vercel URL exactly
2. **API Connection Failed**: Verify `NEXT_PUBLIC_BACKEND_URL` points to your Render backend
3. **Database Connection**: Check MongoDB Atlas IP whitelist and connection string
4. **Environment Variables**: Ensure all required env vars are set on both platforms

### Health Check Endpoints:
- Backend health: `https://your-backend-app.onrender.com/health`
- Frontend: Your Vercel URL should load the homepage

## 📝 File Structure After Deployment

```
Project Root/
├── backend/                 # Deploy to Render
│   ├── server.js
│   ├── package.json
│   ├── models/
│   ├── routes/
│   └── lib/
└── frontend/               # Deploy to Vercel
    ├── app/
    ├── components/
    ├── lib/
    └── package.json
```

## 🔒 Security Notes

1. Use strong passwords for `ADMIN_PASSWORD`
2. Keep MongoDB credentials secure
3. Use HTTPS URLs for all environment variables
4. Consider adding rate limiting and additional security headers

## 📈 Monitoring

- **Render**: Check logs in Render dashboard
- **Vercel**: Monitor function logs in Vercel dashboard
- **MongoDB**: Use Atlas monitoring for database performance

Your URL shortener is now deployed with a scalable architecture!