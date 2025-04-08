require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const paymentRoutes = require('./routes/PaymentRoutes');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// Database connection
connectDB();

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Get allowed origins from .env and split into array
    const allowedOrigins = [
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
      process.env.CLIENT_URL
    ].filter(Boolean); // Remove any empty values

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.some(allowedOrigin => {
      try {
        return origin.startsWith(allowedOrigin) || 
               new URL(allowedOrigin).origin === origin;
      } catch (e) {
        console.warn(`Invalid CORS origin: ${allowedOrigin}`);
        return false;
      }
    })) {
      return callback(null, true);
    }
    
    // Origin not allowed
    callback(new Error(`CORS Policy: Origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/payments', paymentRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || []
  });
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  // Handle CORS errors
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'Forbidden',
      message: err.message,
      allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
      docs: process.env.API_DOCS_URL || undefined
    });
  }
  
  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }

  // Generic error response
  res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Server startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  ⚡ Listening on port ${PORT}
  🌍 Allowed Origins: ${process.env.ALLOWED_ORIGINS || 'Not configured'}
  📎 Client URL: ${process.env.CLIENT_URL || 'Not configured'}
  `);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});
