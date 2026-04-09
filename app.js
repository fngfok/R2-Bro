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
  res.setHeader('X-XSS-Protection', '0'); // Defer to CSP
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:;");
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

// Helper for ally code sanitization and validation
function getSanitizedAllyCode(allyCode) {
  if (typeof allyCode !== 'string') return '';
  // Remove any non-digit characters (like dashes or spaces)
  return allyCode.replace(/\D/g, '');
}

function isValidAllyCode(allyCode) {
  const sanitized = getSanitizedAllyCode(allyCode);
  return /^\d{9}$/.test(sanitized);
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

// Static files
app.use(express.static(path.join(__dirname, 'public')));
// Hardened body parsers with limits to mitigate DoS risks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'R2 Bro - Home' });
});

app.post('/player-search', (req, res) => {
  const { allyCode } = req.body;
  if (!isValidAllyCode(allyCode)) {
    return res.status(400).render('error', { message: 'Invalid Ally Code. Please enter a 9-digit number.' });
  }
  const sanitizedAllyCode = getSanitizedAllyCode(allyCode);
  res.redirect(`/player/${sanitizedAllyCode}`);
});

app.get('/player/:allyCode', async (req, res) => {
  const { allyCode } = req.params;

  if (!isValidAllyCode(allyCode)) {
    return res.status(400).render('error', { message: 'Invalid Ally Code. Please enter a 9-digit number.' });
  }

  const sanitizedAllyCode = getSanitizedAllyCode(allyCode);
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
