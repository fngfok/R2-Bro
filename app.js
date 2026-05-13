const express = require('express');
const ComlinkStub = require('@swgoh-utils/comlink');
const NodeCache = require('node-cache');
const path = require('path');
const Player = require('./models/player');

const app = express();
const port = process.env.PORT || 4200;

// Security: Disable X-Powered-By header to avoid revealing framework information
app.disable('x-powered-by');
// Security: Trust proxy for accurate IP-based rate limiting when behind a load balancer
app.set('trust proxy', 1);

// Security Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  // Modern browsers ignore X-XSS-Protection; disabling it prevents potential side-channel attacks
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; object-src 'none'; style-src 'self'; base-uri 'self'; form-action 'self';");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Optimization: Regexes hoisted for performance
const ALLY_CODE_CLEAN_REGEX = /\D/g;
const ALLY_CODE_VALIDATE_REGEX = /^\d{9}$/;

/**
 * Helper for ally code validation and cleaning.
 * Optimization: Uses a single pass to clean and validate.
 * Optimization: Hoisted regexes and fast-path for already cleaned codes.
 */
function getSanitizedAllyCode(allyCode) {
  if (typeof allyCode !== 'string') return null;
  // Security: Fail fast if input is excessively long to prevent processing-based DoS
  if (allyCode.length > 20) return null;

  // Optimization: Fast-path for already cleaned 9-digit ally codes
  if (ALLY_CODE_VALIDATE_REGEX.test(allyCode)) return allyCode;

  // Clean all non-digit characters for backward compatibility and flexibility
  const cleaned = allyCode.replace(ALLY_CODE_CLEAN_REGEX, '');
  return ALLY_CODE_VALIDATE_REGEX.test(cleaned) ? cleaned : null;
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

// Optimization/Security: Store pending API requests to prevent thundering herd (Concurrent Request Coalescing)
const pendingRequests = new Map();


/**
 * Simple Rate Limiting Middleware using node-cache
 * Security: Prevents DoS and automated scraping of player data.
 * Limit: 10 requests per 10 seconds per IP.
 */
const rateLimitCache = new NodeCache({ stdTTL: 10, checkperiod: 120 });
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const count = rateLimitCache.get(ip) || 0;

  if (count >= 10) {
    return res.status(429).render('error', { message: 'Too many requests. Please try again in a few seconds.' });
  }

  // Security Enhancement: Preserve remaining TTL to maintain a strict sliding window
  const ttl = rateLimitCache.getTtl(ip);
  const remainingSeconds = ttl ? Math.max(0, (ttl - Date.now()) / 1000) : 10;
  rateLimitCache.set(ip, count + 1, remainingSeconds);
  next();
};

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Optimization: Enable view caching to avoid repeated template parsing
app.set('view cache', true);

// Static files
// Performance Optimization: Cache static assets (CSS/JS) for 1 day in the browser
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'R2 Bro - Home' });
});

app.post('/player-search', rateLimiter, (req, res) => {
  const sanitizedAllyCode = getSanitizedAllyCode(req.body.allyCode);

  if (!sanitizedAllyCode) {
    return res.status(400).render('error', { message: 'Invalid Ally Code. Please enter a 9-digit number.' });
  }
  res.redirect(`/player/${sanitizedAllyCode}`);
});

app.get('/player/:allyCode', rateLimiter, async (req, res) => {
  const sanitizedAllyCode = getSanitizedAllyCode(req.params.allyCode);

  if (!sanitizedAllyCode) {
    return res.status(400).render('error', { message: 'Invalid Ally Code. Please enter a 9-digit number.' });
  }
  const cacheKey = `player_${sanitizedAllyCode}`;

  try {
    // Optimization: Cache the Player instance instead of raw data to avoid repeated instantiation overhead
    let player = cache.get(cacheKey);

    if (!player) {
      // Optimization/Security: Check for an existing pending request to coalesce concurrent calls (Thundering Herd Protection)
      // Single Map.get() lookup reduces hashing overhead compared to has() + get()
      // Using cacheKey for the Map key ensures consistency and prevents potential collisions
      const pendingPromise = pendingRequests.get(cacheKey);

      if (pendingPromise) {
        player = await pendingPromise;
      } else {
        const fetchPromise = comlink.getPlayer(sanitizedAllyCode)
          .then(playerData => {
            const newPlayer = new Player(playerData);
            cache.set(cacheKey, newPlayer);
            return newPlayer;
          })
          .finally(() => {
            // Optimization/Security: Remove the promise from the Map once complete to prevent stale pending states
            pendingRequests.delete(cacheKey);
          });

        // Optimization/Security: Store the promise synchronously before any await to prevent race conditions
        pendingRequests.set(cacheKey, fetchPromise);
        player = await fetchPromise;
      }
    }

    res.render('player', { title: `Player Profile - ${sanitizedAllyCode}`, player: player });
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
