const express = require('express');
const router  = express.Router();

// In-memory user profile
let profile = {
  name:   'David Carter',
  email:  'david@example.com',
  city:   '',
  avatar: 'D',
  notifications: { weather: true, health: true, emergency: true },
};

router.get('/',    (_req, res) => res.json(profile));
router.put('/',    (req, res)  => { profile = { ...profile, ...req.body }; res.json(profile); });

module.exports = router;
