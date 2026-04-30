const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

const BASE = 'https://api.openweathermap.org/data/2.5';

// GET /api/weather/:city
router.get('/:city', async (req, res) => {
  const key  = process.env.OPENWEATHER_API_KEY;
  const city = req.params.city;

  if (!key || key === 'your_openweathermap_api_key_here')
    return res.status(503).json({ error: 'OpenWeatherMap API key not configured. Add it to backend/.env' });

  try {
    const [curRaw, fcRaw] = await Promise.all([
      fetch(`${BASE}/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`),
      fetch(`${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${key}&units=metric`),
    ]);

    const cur = await curRaw.json();
    if (cur.cod !== 200) return res.status(404).json({ error: `City "${city}" not found.` });

    const fc = await fcRaw.json();

    // Build daily forecast: pick entry closest to noon per day
    const dailyMap = {};
    for (const item of fc.list) {
      const day = item.dt_txt.split(' ')[0];
      if (!dailyMap[day] || item.dt_txt.includes('12:00:00')) dailyMap[day] = item;
    }

    const forecast = Object.entries(dailyMap).slice(0, 7).map(([date, d]) => ({
      date,
      temp_max:    Math.round(d.main.temp_max),
      temp_min:    Math.round(d.main.temp_min),
      description: d.weather[0].description,
      icon:        d.weather[0].icon,
      humidity:    d.main.humidity,
      wind_speed:  d.wind.speed,
    }));

    const fmt = ts =>
      new Date(ts * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false,
      });

    res.json({
      city:        cur.name,
      country:     cur.sys.country,
      lat:         cur.coord.lat,
      lon:         cur.coord.lon,
      temp:        Math.round(cur.main.temp),
      feels_like:  Math.round(cur.main.feels_like),
      temp_min:    Math.round(cur.main.temp_min),
      temp_max:    Math.round(cur.main.temp_max),
      description: cur.weather[0].description,
      icon:        cur.weather[0].icon,
      humidity:    cur.main.humidity,
      wind_speed:  cur.wind.speed,
      wind_deg:    cur.wind.deg,
      pressure:    cur.main.pressure,
      visibility:  cur.visibility,
      sunrise:     fmt(cur.sys.sunrise),
      sunset:      fmt(cur.sys.sunset),
      forecast,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

module.exports = router;
