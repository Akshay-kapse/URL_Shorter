// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const connectDB = require('./lib/mongodb');
// const urlRoutes = require('./routes/urls');
// const adminRoutes = require('./routes/admin');

// const app = express();

// app.set('trust proxy', 1);

// const PORT = process.env.PORT || 5000;

// // Connect to MongoDB
// connectDB();

// // Security middleware
// app.use(helmet());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use(limiter);

// // CORS configuration
// app.use(cors({
//   origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     status: 'OK', 
//     message: 'Server is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // API routes
// app.use('/api', urlRoutes);
// app.use('/api/admin', adminRoutes);

// // Redirect route for short URLs
// app.get('/:shortCode', async (req, res) => {
//   try {
//     const { shortCode } = req.params;
    
//     if (!shortCode || shortCode === 'favicon.ico') {
//       return res.status(404).json({ error: 'Short code not found' });
//     }

//     const Url = require('./models/Url');
    
//     // Find and update visit count atomically
//     const urlDoc = await Url.findOneAndUpdate(
//       { short_code: shortCode },
//       {
//         $inc: { visit_count: 1 },
//         $set: { updatedAt: new Date() }
//       },
//       { new: true }
//     );

//     if (!urlDoc) {
//       return res.status(404).json({ error: 'Short URL not found' });
//     }

//     // Redirect to original URL
//     res.redirect(301, urlDoc.original_url);
    
//   } catch (error) {
//     console.error('Redirect error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   console.error('Server error:', error);
//   res.status(500).json({ 
//     error: 'Internal server error',
//     message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
//   });
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
// });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./lib/mongodb');
const urlRoutes = require('./routes/urls');
const adminRoutes = require('./routes/admin');

const app = express();

app.set('trust proxy', 1);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration using frontend URL from env
// app.use(
//   cors({
//     origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
const allowedOrigins = [
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  'http://localhost:3000',
  'http://192.168.31.150:3000'
];

app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api', urlRoutes);
app.use('/api/admin', adminRoutes);

// Redirect short URLs
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    if (!shortCode || shortCode === 'favicon.ico') {
      return res.status(404).json({ error: 'Short code not found' });
    }

    const Url = require('./models/Url');

    const urlDoc = await Url.findOneAndUpdate(
      { short_code: shortCode },
      {
        $inc: { visit_count: 1 },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!urlDoc) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    return res.redirect(301, urlDoc.original_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message:
      process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
