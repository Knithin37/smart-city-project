# 🏙️ Smart City Assistant

A full-stack **React + Node.js** application for real-time Weather, Healthcare & City information.
Supports **UN SDG Goal 11** — Sustainable Cities and Communities.

## 🗂️ Project Structure

```
smart-city/
├── backend/
│   ├── server.js
│   ├── .env.example        ← Copy to .env and add your keys
│   ├── package.json
│   └── routes/
│       ├── weather.js      ← OpenWeatherMap API
│       ├── healthcare.js   ← Google Places API
│       └── admin.js
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/  (Navbar, Footer, CityBanner, UI)
        ├── hooks/       (weatherUtils.js)
        └── pages/       (Home, Weather, Healthcare, HealthTips,
                          Emergency, Aqi, Reports, Dashboard,
                          Notifications, Settings, Help)
```

## 🚀 Quick Start

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # then add your API keys
npm run dev                 # → http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev                 # → http://localhost:3000
```

## 🔑 API Keys (both free)

| Key | Where to get |
|-----|-------------|
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) — free 1,000 calls/day |
| `GOOGLE_MAPS_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) — enable Maps + Places + Geocoding |

> ⏱️ OpenWeather keys take up to 2 hours to activate after signup.

## 📄 Pages

| Page | Route |
|------|-------|
| Home / Dashboard | `/` |
| Weather | `/weather` |
| Hospitals | `/hospitals` |
| Health Tips | `/health-tips` |
| Emergency | `/emergency` |
| AQI | `/aqi` |
| Reports | `/reports` |
| Notifications | `/notifications` |
| Settings | `/settings` |
| Help | `/help` |
