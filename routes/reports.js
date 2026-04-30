const express = require('express');
const router  = express.Router();

// In-memory store (resets on restart — fine for demo)
let reports = [
  { id:1, name:'April Weather Report',      type:'Weather',   date:'2024-04-30', status:'Generated', city:'New York' },
  { id:2, name:'March Weather Report',      type:'Weather',   date:'2024-03-31', status:'Generated', city:'New York' },
  { id:3, name:'Health Advisory Report',    type:'Health',    date:'2024-03-15', status:'Generated', city:'New York' },
  { id:4, name:'Emergency Services Report', type:'Emergency', date:'2024-02-28', status:'Generated', city:'New York' },
];
let nextId = 5;

// GET /api/reports
router.get('/', (req, res) => {
  const { city } = req.query;
  if (city) return res.json(reports.filter(r => r.city.toLowerCase() === city.toLowerCase()));
  res.json(reports);
});

// POST /api/reports  { name, type, city }
router.post('/', (req, res) => {
  const { name, type, city } = req.body;
  if (!name || !type) return res.status(400).json({ error: 'name and type required' });
  const report = {
    id: nextId++,
    name,
    type,
    city: city || 'Unknown',
    date: new Date().toISOString().split('T')[0],
    status: 'Generated',
  };
  reports.unshift(report);
  res.status(201).json(report);
});

// DELETE /api/reports/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  reports = reports.filter(r => r.id !== id);
  res.json({ ok: true });
});

module.exports = router;
