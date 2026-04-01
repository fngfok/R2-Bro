const express = require('express');
const ComlinkStub = require('@swgoh-utils/comlink');
const NodeCache = require('node-cache');
const path = require('path');

const app = express();
const port = process.env.PORT || 4200;

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'R2 Bro - Home' });
});

app.post('/player-search', (req, res) => {
  const { allyCode } = req.body;
  if (!allyCode) {
    return res.redirect('/');
  }
  res.redirect(`/player/${allyCode}`);
});

app.get('/player/:allyCode', async (req, res) => {
  const { allyCode } = req.params;
  const cacheKey = `player_${allyCode}`;

  try {
    let playerData = cache.get(cacheKey);
    if (!playerData) {
      playerData = await comlink.getPlayer(allyCode);
      cache.set(cacheKey, playerData);
    }
    res.render('player', { title: `Player Profile - ${allyCode}`, player: playerData });
  } catch (error) {
    console.error('Error fetching player data:', error);
    res.status(500).render('error', { message: 'Failed to fetch player data' });
  }
});

app.listen(port, () => {
  console.log(`R2 Bro listening at http://localhost:${port}`);
});
