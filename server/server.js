/**
 * server/server.js
 * 
 * Express Application Entry Point for Smart Parking System (DAA Academic Project)
 */

const express = require('express');
const cors = require('cors');
const parkingRoutes = require('./routes/parkingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing for Vite frontend (http://localhost:5173)
app.use(cors({
  origin: '*', // Allow all origins for local academic demonstration
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Express built-in JSON body parser
app.use(express.json());

// API Request Logger for console visibility during demonstration
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Mount Parking System REST Routes
app.use('/api/parking', parkingRoutes);

// Health check / API Index
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    project: 'Smart Parking System (DAA Academic Project)',
    algorithm: 'Greedy Algorithm (O(n) Linear Scan)',
    storage: 'Server-side In-Memory JavaScript Objects & Maps (No Database)',
    endpoints: [
      'GET /api/parking',
      'GET /api/parking/stats',
      'GET /api/parking/vehicles',
      'POST /api/parking/assign',
      'POST /api/parking/exit',
      'POST /api/parking/reset'
    ]
  });
});

// Centralized 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} does not exist.`
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: err.message
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚗 Smart Parking System Backend running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api/parking`);
  console.log(`🧠 In-Memory Storage Active: No MongoDB / No SQL Database`);
  console.log('========================================================');
});

module.exports = { app, server };
