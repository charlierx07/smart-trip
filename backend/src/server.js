const express = require('express');
const cors = require('cors');
require('dotenv').config();

const placesRoutes = require('./routes/placesRoutes');
const tripsRoutes = require('./routes/tripsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// ── Middlewares ──────────────────────────────────────────────
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ── Root & Health Check ───────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Trip API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      geocode: 'GET /api/places/geocode?q=:location',
      nearby: 'GET /api/places/nearby?lat=:lat&lon=:lon&radius=:radius',
      trips: 'GET /api/trips, POST /api/trips',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/places', placesRoutes);
app.use('/api/trips', tripsRoutes);

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// ── Start Server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Smart Trip Backend is running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});
