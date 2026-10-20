# 🧳 Smart Trip

> **AI-powered day-trip planner** — enter any location or use GPS, discover nearby attractions, build your itinerary, and get a smart budget breakdown. Built with React 19 and OpenStreetMap.

---

## ✨ Features

- 📍 **Location Search** — type any city/place or use your GPS
- 🗺️ **Nearby Places** — pulls real data from OpenStreetMap via the Overpass API (parks, museums, temples, historic sites, and more within 15 km)
- 🔍 **Filter by Type & Date** — narrow results to exactly what you want
- ➕ **Trip Planner Sidebar** — add/remove places and build your day
- 📅 **Auto Itinerary** — generates optimised time slots sorted by distance
- 💰 **Smart Budget** — calculates entry fees, food, and transport estimates
- 🔐 **Google Login** *(coming soon)* — save and share trips via Firebase

---

## 🗂️ Project Structure

```
smart-trip/
├── public/
│   ├── index.html          # App shell
│   ├── manifest.json       # PWA metadata
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   └── bg.jpg          # Hero background image
│   │
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.js / .css
│   │   ├── HeroSection.js / .css
│   │   ├── FilterBar.js / .css
│   │   ├── LocationCard.js / .css
│   │   ├── LocationInput.js / .css
│   │   ├── PlaceDetailsModal.js
│   │   └── TripSidebar.js / .css
│   │
│   ├── pages/              # Route-level page components
│   │   ├── Home.js / .css          → /
│   │   ├── TripPlanner.js          → /trip
│   │   └── TripSummary.js / .css   → /trip-summary
│   │
│   ├── utils/              # Pure helper functions
│   │   ├── locationFetcher.js  # Overpass API integration
│   │   └── distanceUtils.js    # Haversine distance formula
│   │
│   ├── App.js              # Route definitions
│   ├── App.css             # Global styles & shared classes
│   ├── index.js            # React root entry point
│   └── index.css           # Base font & body styles
│
├── .env.example            # ✅ Safe env template (commit this)
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/smart-trip.git
cd smart-trip
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
# Then fill in your Firebase credentials in .env.local
```

### 4. Run the app
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Copy `.env.example` → `.env.local` and fill in your values.

| Variable | Description |
|---|---|
| `REACT_APP_FIREBASE_API_KEY` | Firebase project API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |
| `REACT_APP_SEARCH_RADIUS` | Search radius in metres (default: `15000`) |

> ⚠️ **Never commit `.env` or `.env.local` to GitHub.** They are already listed in `.gitignore`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7 |
| Styling | Plain CSS (component-scoped) |
| Location | Nominatim (OpenStreetMap geocoding) |
| Places Data | Overpass API (OpenStreetMap) |
| Auth *(planned)* | Firebase Authentication |
| Icons | react-icons |

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run in development mode |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run eject` | Eject CRA config (irreversible) |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © Smart Trip
