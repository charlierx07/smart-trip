# Smart Trip — Backend API

Express & Node.js REST API providing Geocoding (via OpenStreetMap Nominatim), Nearby Attractions discovery (via Overpass API), and Trip Planning & Budget calculations.

---

## 🛠 Tech Stack

- **Node.js** (v18+)
- **Express.js** (REST API framework)
- **CORS** (Cross-Origin Resource Sharing)
- **Dotenv** (Environment variable management)

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default variables:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Run Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs at: `http://localhost:5000`

---

## 📡 API Endpoints

### 🩺 System
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and overview |
| `GET` | `/api/health` | Healthcheck and server uptime |

### 📍 Places & Geocoding
| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| `GET` | `/api/places/geocode` | `q=<location_name>` | Geocodes a place name to coordinates (`lat`, `lon`) |
| `GET` | `/api/places/nearby` | `lat=<lat>&lon=<lon>&radius=<meters>` | Fetches tourist attractions, parks, museums within radius (default: 15km) |

### 🧳 Trips
| Method | Endpoint | Body | Description |
|---|---|---|---|
| `GET` | `/api/trips` | — | Retrieve all saved trips |
| `POST` | `/api/trips` | `{ destination, date, places, notes }` | Save a new trip with auto-calculated budget |
| `GET` | `/api/trips/:id` | — | Retrieve a specific trip |
| `DELETE` | `/api/trips/:id` | — | Delete a trip |
