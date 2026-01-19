// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/eventRoutes');
const Admin = require('./models/Admin');

const app = express();
const PORT = process.env.PORT || 5000;

// --- basic middleware ---
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax',
    secure: false
  }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => res.send('Campus Connect backend running'));

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');

    // ✅ AUTO CREATE ADMIN WITH HASHED PASSWORD
    const existingAdmin = await Admin.findOne({});
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await Admin.create({
        adminId: "AD101",
        password: hashedPassword
      });

      console.log("✅ Default Admin Created:");
      console.log("   ID: AD101");
      console.log("   Password: admin123");
    } else {
      console.log("✅ Admin already exists, skipping auto-create.");
    }

    app.listen(PORT, () => console.log('Server running on port', PORT));
  })
  .catch(err => console.error('Mongo connection error:', err));
