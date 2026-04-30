require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// 📊 Request logging (to debug Route not found)
app.use((req, res, next) => {
  console.log(`🚀 ${new Date().toISOString()} [${req.method}] ${req.originalUrl}`);
  next();
});

// ✅ Import routes
const authRoutes = require('./routes/auth');

// ✅ Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/weather', require('./routes/weather'));
app.use('/api/healthcare', require('./routes/healthcare'));
app.use('/api/aqi', require('./routes/aqi'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/tourism', require('./routes/tourism'));
app.use('/api/admin', require('./routes/admin'));

// ✅ Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    server: 'Smart City Assistant',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    apis: {
      weather: !!(process.env.OPENWEATHER_API_KEY &&
        process.env.OPENWEATHER_API_KEY !== 'your_openweathermap_api_key_here'),
      google: !!(process.env.GOOGLE_MAPS_API_KEY &&
        process.env.GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here'),
    },
  });
});

// ❌ 404 handler (important)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ❌ Global error handler (important for cybersecurity)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// ✅ Start server
app.listen(PORT, () => {
  const wOk = process.env.OPENWEATHER_API_KEY &&
              process.env.OPENWEATHER_API_KEY !== 'your_openweathermap_api_key_here';

  const gOk = process.env.GOOGLE_MAPS_API_KEY &&
              process.env.GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here';

  console.log(`\n🏙️ Smart City Assistant v3 — http://localhost:${PORT}`);
  console.log(`   Weather API : ${wOk ? '✅' : '⚠️ Add OPENWEATHER_API_KEY to .env'}`);
  console.log(`   Google API  : ${gOk ? '✅' : '⚠️ Add GOOGLE_MAPS_API_KEY to .env'}\n`);
});