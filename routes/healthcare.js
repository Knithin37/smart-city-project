const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

const GBASE = 'https://maps.googleapis.com/maps/api';

async function geocode(city, key) {
  const r = await fetch(`${GBASE}/geocode/json?address=${encodeURIComponent(city)}&key=${key}`);
  const d = await r.json();
  if (!d.results?.length) return null;
  return d.results[0].geometry.location; // { lat, lng }
}

// GET /api/healthcare/search?city=Delhi   OR   ?lat=28.6&lng=77.2
router.get('/search', async (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === 'your_google_maps_api_key_here')
    return res.status(503).json({ error: 'Google Maps API key not configured. Add it to backend/.env' });

  try {
    let { city, lat, lng } = req.query;

    if (!lat || !lng) {
      if (!city) return res.status(400).json({ error: 'Provide city or lat/lng.' });
      const loc = await geocode(city, key);
      if (!loc) return res.status(404).json({ error: `City "${city}" not found.` });
      lat = loc.lat; lng = loc.lng;
    }

    const r = await fetch(
      `${GBASE}/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=hospital&key=${key}`
    );
    const d = await r.json();

    const hospitals = (d.results || []).slice(0, 12).map(h => ({
      id:            h.place_id,
      name:          h.name,
      address:       h.vicinity,
      rating:        h.rating ?? null,
      total_ratings: h.user_ratings_total ?? 0,
      open_now:      h.opening_hours?.open_now ?? null,
      lat:           h.geometry.location.lat,
      lng:           h.geometry.location.lng,
      photo: h.photos?.[0]?.photo_reference
        ? `${GBASE}/place/photo?maxwidth=400&photoreference=${h.photos[0].photo_reference}&key=${key}`
        : null,
    }));

    res.json({ lat: parseFloat(lat), lng: parseFloat(lng), hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch healthcare data.' });
  }
});

// GET /api/healthcare/details/:placeId
router.get('/details/:placeId', async (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === 'your_google_maps_api_key_here')
    return res.status(503).json({ error: 'Google Maps API key not configured.' });

  try {
    const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,reviews';
    const r = await fetch(
      `${GBASE}/place/details/json?place_id=${req.params.placeId}&fields=${fields}&key=${key}`
    );
    const d = await r.json();
    res.json(d.result || {});
  } catch {
    res.status(500).json({ error: 'Failed to fetch hospital details.' });
  }
});

module.exports = router;
