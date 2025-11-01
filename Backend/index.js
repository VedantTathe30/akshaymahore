const express = require('express');
const db = require('./config/db');
const connectToDB = require('./config/db');
const adminRoutes = require('./routes/admin.routes');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const galleryRoutes = require("./routes/gallery.routes");

require('dotenv').config();
const app = express();

connectToDB();

// Default CORS configurations
const allowedOrigins = [
  'http://localhost:5173',
  'http://www.localhost:5173',  // Vite default dev server
  'http://localhost:3000',  // In case frontend runs on 3000
  'http://127.0.0.1:5173', // Local IP variant
  'http://127.0.0.1:3000', // Local IP variant
  'https://akshaymahore.vercel.app', // Production URL
  'https://akshaymahore-backend.vercel.app' // Backend URL
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/', adminRoutes);
console.log("✅ Loading gallery routes...");

app.use("/gallery", galleryRoutes);
console.log("✅ Loading gallery routes...");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
})


module.exports = app;