const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

// GET /api/admin/status — test both API keys live
router.get('/status', async (req, res) => {
  const owmKey = process.env.OPENWEATHER_API_KEY;
  const gmKey  = process.env.GOOGLE_MAPS_API_KEY;

  const results = { server: 'ok', weather: 'unconfigured', google: 'unconfigured' };

  if (owmKey && owmKey !== 'your_openweathermap_api_key_here') {
    try {
      const r = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=${owmKey}&units=metric`);
      const d = await r.json();
      results.weather = d.cod === 200 ? 'ok' : 'invalid_key';
    } catch { results.weather = 'error'; }
  }

  if (gmKey && gmKey !== 'your_google_maps_api_key_here') {
    try {
      const r = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=London&key=${gmKey}`);
      const d = await r.json();
      results.google = d.status === 'OK' ? 'ok' : `error: ${d.status}`;
    } catch { results.google = 'error'; }
  }

  res.json(results);
});

// GET /api/admin/config — returns non-sensitive config
router.get('/config', (_req, res) => {
  res.json({
    weatherKeySet: !!(process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY !== 'your_openweathermap_api_key_here'),
    googleKeySet:  !!(process.env.GOOGLE_MAPS_API_KEY  && process.env.GOOGLE_MAPS_API_KEY  !== 'your_google_maps_api_key_here'),
    port:    process.env.PORT    || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  });
});

module.exports = router;
