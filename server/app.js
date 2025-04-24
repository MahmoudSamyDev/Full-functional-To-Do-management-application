// Basic server setup using Express.js
const express = require('express');

// Importing Middleware and Modules

// 1. Node.js core module for working with file paths.
const path = require('path');

// 2.Middleware to parse cookies from client requests.
const cookieParser = require('cookie-parser');

// 3. Logs HTTP requests in your terminal. Useful for debugging.
const logger = require('morgan');

// 4. Allows cross-origin requests (important for frontend-backend communication).
const cors = require('cors')

// Initialize Express App
const app = express();

// Middleware Setup

// CORS (Cross-Origin Resource Sharing): Needed if your frontend (React) runs on a different port (like localhost:5173) than your backend (like localhost:3000).
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Morgan logs requests like GET /api/tasks 200 12ms in development mode.
app.use(logger('dev'));

// Parses incoming requests with JSON payloads (for req.body).
app.use(express.json());

// Parses URL-encoded data (form submissions). extended: false uses the classic querystring library.
app.use(express.urlencoded({ extended: false }));

// Makes it easy to access cookies via req.cookies.
app.use(cookieParser());

// Serves static files like images, CSS, or frontend code from the public folder.
app.use(express.static(path.join(__dirname, 'public')));

// This line delegates any route that starts with /api/v1 to your routing module.
app.use('/api/v1', require('./src/v1/routes'));

// Export the app
// This allows you to import the app in other files (like server.js).
module.exports = app;
