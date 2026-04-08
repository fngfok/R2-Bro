const express = require('express');
const ComlinkStub = require('@swgoh-utils/comlink');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const port = process.env.PORT || 4200;

// Security Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

/**
 * Helper for ally code validation and cleaning.
 * Optimization: Uses a single pass to clean and validate.
 */
function getSanitizedAllyCode(allyCode) {
  if (typeof allyCode !== 'string') return null;
  // Clean all non-digit characters for backward compatibility and flexibility
  const cleaned = allyCode.replace(/\D/g, '');
  return /^\d{9}$/.test(cleaned) ? cleaned : null;
}

// Backward compatible helper
function isValidAllyCode(allyCode) {
  return !!getSanitizedAllyCode(allyCode);
}

// Initialize Comlink Stub
const comlink = new ComlinkStub({
  url: process.env.COMLINK_URL || 'http://localhost:3000',
  statsUrl: process.env.STATS_URL || 'http://localhost:3223',
  accessKey: process.env.COMLINK_ACCESS_KEY || '',
  secretKey: process.env.COMLINK_SECRET_KEY || ''
});

// Cache initialization (TTL: 1 hour)
// Optimization: disabled cloning for better performance since cached objects are not mutated
const cache = new NodeCache({ stdTTL: 3600, useClones: false });

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Enable template caching in production to reduce parsing overhead
if (process.env.NODE_ENV === 'production') {
  app.set('view cache', true);
}

// Static files with 1-day browser cache for performance
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

// Global middleware optimizations:
// 1. Set limit to prevent large payload DoS and reduce memory usage
// 2. Use extended: false for faster parsing of simple form data (reduces CPU overhead)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'R2 Bro - Home' });
});

app.post('/player-search', (req, res) => {
  const sanitizedAllyCode = getSanitizedAllyCode(req.body.allyCode);

  if (!sanitizedAllyCode) {
    return res.status(400).render('error', { message: 'Invalid Ally Code. Please enter a 9-digit number.' });
  }
  res.redirect(`/player/${sanitizedAllyCode}`);
});

app.get('/player/:allyCode', async (req, res) => {
  const sanitizedAllyCode = getSanitizedAllyCode(req.params.allyCode);

  if (!sanitizedAllyCode) {
    return res.status(400).render('error', { message: 'Invalid Ally Code. Please enter a 9-digit number.' });
  }
  const cacheKey = `player_${sanitizedAllyCode}`;

  try {
    let playerData = cache.get(cacheKey);
    if (!playerData) {
      playerData = await comlink.getPlayer(sanitizedAllyCode);
      cache.set(cacheKey, playerData);
    }
    res.render('player', { title: `Player Profile - ${sanitizedAllyCode}`, player: playerData });
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).render('error', { message: 'Failed to fetch player data' });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`R2 Bro listening at http://localhost:${port}`);
  });
}

module.exports = app;
