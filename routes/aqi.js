const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

// GET /api/aqi/:city  — uses OpenWeatherMap Air Pollution API
router.get('/:city', async (req, res) => {
  const key  = process.env.OPENWEATHER_API_KEY;
  const city = req.params.city;

  if (!key || key === 'your_openweathermap_api_key_here')
    return res.status(503).json({ error: 'OpenWeatherMap API key not configured.' });

  try {
    // First geocode the city
    const geoRes  = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key}`);
    const geoData = await geoRes.json();
    if (!geoData.length) return res.status(404).json({ error: `City "${city}" not found.` });

    const { lat, lon } = geoData[0];
    const aqiRes  = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`);
    const aqiData = await aqiRes.json();

    const comp = aqiData.list[0].components;
    const aqi  = aqiData.list[0].main.aqi; // 1=Good,2=Fair,3=Moderate,4=Poor,5=VeryPoor

    const labels = { 1:'Good', 2:'Fair', 3:'Moderate', 4:'Poor', 5:'Very Poor' };
    const scores = { 1: 25,    2: 60,    3: 100,       4: 150,   5: 200 };

    res.json({
      city: geoData[0].name,
      aqi:        scores[aqi] || 50,
      aqiIndex:   aqi,
      label:      labels[aqi] || 'Good',
      components: {
        'PM2.5': `${comp.pm2_5.toFixed(1)} µg/m³`,
        'PM10':  `${comp.pm10.toFixed(1)} µg/m³`,
        'O3':    `${comp.o3.toFixed(1)} µg/m³`,
        'NO2':   `${comp.no2.toFixed(1)} µg/m³`,
        'SO2':   `${comp.so2.toFixed(1)} µg/m³`,
        'CO':    `${(comp.co/1000).toFixed(2)} ppm`,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch AQI data.' });
  }
});

module.exports = router;
