const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth.routes');
const musicRoutes = require('./routes/music.routes');
const artistRoutes = require('./routes/artist.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const subscriptionController = require('./controller/subscription.controller');
const playlistRoutes = require('./routes/playlist.routes');
const libraryRoutes = require('./routes/library.routes');
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_URL || "http://localhost:5173").split(",").map(origin => origin.trim());

const app = express();
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true,
}));
app.post('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), subscriptionController.stripeWebhook);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/library', libraryRoutes);
module.exports = app;
   
