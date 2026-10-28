# 🧳 Smart Trip

> **AI-Powered Travel & Day-Trip Planner** — Enter any location or use GPS, discover nearby attractions, build an optimized itinerary, calculate smart budgets, and save trip plans. Organized into clean, scalable **Frontend** and **Backend** tiers.

---

## 🏗️ Architecture & Systematic File Structure

The project is structured into a clean decoupled architecture with a dedicated **React Frontend** and an **Express Backend API**:

```
smart-trip/
├── frontend/                        # React Client Application
│   ├── public/                      # Static assets & HTML shell
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                  # Images & static media
│   │   │   └── bg.jpg
│   │   ├── components/              # Reusable UI components
│   │   │   ├── FilterBar.js / .css
│   │   │   ├── HeroSection.js / .css
│   │   │   ├── LocationCard.js / .css
│   │   │   ├── LocationInput.js / .css
│   │   │   ├── Navbar.js / .css
│   │   │   ├── PlaceDetailsModal.js
│   │   │   └── TripSidebar.js / .css
│   │   ├── pages/                   # Application pages & routes
│   │   │   ├── Home.js / .css            → /
│   │   │   ├── TripPlanner.js            → /trip
│   │   │   └── TripSummary.js / .css     → /trip-summary
│   │   ├── services/                # API layer & network communication
│   │   │   └── api.js               # Connects to backend with OSM fallback
│   │   ├── utils/                   # Helper functions
│   │   │   ├── distanceUtils.js     # Haversine distance calculations
│   │   │   └── locationFetcher.js   # Places discovery helper
│   │   ├── App.js                   # Route definitions
│   │   ├── App.css                  # Global layouts & themes
│   │   ├── index.js                 # Entry point
│   │   └── index.css
│   ├── .env.example                 # Frontend env configuration
│   └── package.json                 # React 19 dependencies & scripts
│
├── backend/                         # Node.js & Express REST API
│   ├── src/
│   │   ├── controllers/             # Business logic & request handlers
│   │   │   ├── placesController.js  # Geocoding & nearby places search
│   │   │   └── tripsController.js   # Trip creation, budget & itinerary
│   │   ├── routes/                  # Express route definitions
│   │   │   ├── placesRoutes.js      # /api/places/*
│   │   │   └── tripsRoutes.js       # /api/trips/*
│   │   ├── services/                # External API integrations
│   │   │   └── osmService.js        # OpenStreetMap & Overpass integration
│   │   └── server.js                # Express app entry & CORS config
│   ├── .env.example                 # Backend env configuration
│   ├── README.md                    # Backend API documentation
│   └── package.json                 # Express, CORS, Dotenv
│
├── .gitignore                       # Multi-tier gitignore (secrets, node_modules)
├── README.md                        # Project documentation
└── package.json                     # Monorepo scripts (run both frontend & backend)
```

---

## ✨ Features

- 📍 **Smart Geocoding** — Search by city/landmark or tap GPS to detect coordinates.
- 🗺️ **Attractions Discovery** — Discovers museums, historic monuments, theme parks, gardens, and temples within 15 km via OpenStreetMap.
- 🎯 **Interactive Trip Builder** — Filter by category, inspect place details, and add stops to your live trip sidebar.
- ⏱️ **Auto-Scheduled Itinerary** — Calculates optimal travel routes and generates timed itineraries with visit and transit buffers.
- 💰 **Automated Budget Estimator** — Estimates category-based entry fees, transportation fares, and food allowances.
- 💾 **Trip Persistence API** — Save finalized trip itineraries to the Express backend.
- 🛡️ **Resilient Architecture** — Frontend automatically connects to backend, with built-in graceful fallback to direct OpenStreetMap if backend is offline.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or later recommended)
- **npm** (v9.0.0 or later)

---

### Running the Entire Project

#### Option 1: Run Frontend & Backend Independently

**Terminal 1 — Backend (Port 5000):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 — Frontend (Port 3000):**
```bash
cd frontend
npm start
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

#### Option 2: Run via Root Scripts

From the project root:

```bash
# Start backend server
npm run start:backend

# In another terminal, start frontend
npm run start:frontend

# Build frontend for production
npm run build
```

---

## 📡 Backend API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Query / Body | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Health check and server status |
| `GET` | `/api/places/geocode` | `?q=<query>` | Geocode text to coordinates |
| `GET` | `/api/places/nearby` | `?lat=<lat>&lon=<lon>&radius=<m>` | Fetch nearby attractions (15km) |
| `GET` | `/api/trips` | — | Retrieve all saved trip plans |
| `POST` | `/api/trips` | `{ destination, date, places, notes }` | Create and save a new trip plan |
| `GET` | `/api/trips/:id` | — | Retrieve single trip by ID |
| `DELETE` | `/api/trips/:id` | — | Delete a saved trip plan |

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.example`)
```env
# Optional: Point to custom backend URL (defaults to http://localhost:5000/api)
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (`backend/.env.example`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

---

## 🔒 Security & Git Hygiene

All sensitive configuration, environment variables, credentials, logs, and `node_modules` in both frontend and backend are comprehensively ignored by `.gitignore`.

---

## 📄 License

MIT License. Open source and free to customize.
