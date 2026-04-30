const express = require('express');
const fetch   = require('node-fetch');
const router  = express.Router();

const GBASE = 'https://maps.googleapis.com/maps/api';

async function geocode(city, key) {
  const r = await fetch(`${GBASE}/geocode/json?address=${encodeURIComponent(city)}&key=${key}`);
  const d = await r.json();
  if (!d.results?.length) return null;
  return d.results[0].geometry.location;
}

// GET /api/tourism/search?city=Paris
router.get('/search', async (req, res) => {
  const key  = process.env.GOOGLE_MAPS_API_KEY;
  const { city, type = 'tourist_attraction' } = req.query;

  if (!key || key === 'your_google_maps_api_key_here')
    return res.status(503).json({ error: 'Google Maps API key not configured.' });
  if (!city) return res.status(400).json({ error: 'city param required' });

  try {
    const loc = await geocode(city, key);
    if (!loc) return res.status(404).json({ error: `City "${city}" not found.` });

    const r = await fetch(
      `${GBASE}/place/nearbysearch/json?location=${loc.lat},${loc.lng}&radius=10000&type=${type}&key=${key}`
    );
    const d = await r.json();

    const places = (d.results || []).slice(0, 15).map(p => ({
      id:      p.place_id,
      name:    p.name,
      address: p.vicinity,
      rating:  p.rating ?? null,
      total_ratings: p.user_ratings_total ?? 0,
      open_now: p.opening_hours?.open_now ?? null,
      types:   p.types || [],
      lat:     p.geometry.location.lat,
      lng:     p.geometry.location.lng,
      photo: p.photos?.[0]?.photo_reference
        ? `${GBASE}/place/photo?maxwidth=400&photoreference=${p.photos[0].photo_reference}&key=${key}`
        : null,
    }));

    res.json({ city, lat: loc.lat, lng: loc.lng, places });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tourism data.' });
  }
});

// GET /api/tourism/details/:placeId
router.get('/details/:placeId', async (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key || key === 'your_google_maps_api_key_here')
    return res.status(503).json({ error: 'Google Maps API key not configured.' });
  try {
    const fields = 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,reviews,photos,editorial_summary';
    const r = await fetch(`${GBASE}/place/details/json?place_id=${req.params.placeId}&fields=${fields}&key=${key}`);
    const d = await r.json();
    res.json(d.result || {});
  } catch {
    res.status(500).json({ error: 'Failed to fetch place details.' });
  }
});

module.exports = router;
