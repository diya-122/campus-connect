// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const User = require('../models/User');

// ---------- Auth helpers ----------
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) return res.status(401).json({ message: 'unauthenticated' });
  next();
}

async function requireAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.user) return res.status(401).json({ message: 'unauthenticated' });
    const u = await User.findById(req.session.user.id);
    if (!u) return res.status(404).json({ message: 'user not found' });
    if (!u.isAdmin) return res.status(403).json({ message: 'forbidden: admin required' });
    next();
  } catch (err) {
    console.error('requireAdmin error', err);
    res.status(500).json({ message: 'server error' });
  }
}

// ---------- Multer (file upload) setup ----------
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const fname = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fname);
  }
});
const upload = multer({ storage });

// ---------- Routes ----------

// GET /api/events - list all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).lean();
    res.json(events);
  } catch (err) {
    console.error('GET /events error', err);
    res.status(500).json({ message: 'server error' });
  }
});

// POST /api/events - create event (admin only)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
});

// POST /api/events/upload - upload image (admin only)
router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'no file uploaded' });
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (err) {
    console.error('POST /events/upload error', err);
    res.status(500).json({ message: 'server error' });
  }
});

// GET /api/events/mine - events registered by logged-in user
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('registeredEvents').lean();
    if (!user) return res.status(404).json({ message: 'user not found' });
    res.json({ registeredEvents: user.registeredEvents || [] });
  } catch (err) {
    console.error('GET /events/mine error', err);
    res.status(500).json({ message: 'server error' });
  }
});

// POST /api/events/:id/register - mark event as registered for the logged-in user
router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(404).json({ message: 'event not found' });
    }

    const user = await User.findById(req.session.user.id);
    if (!user) return res.status(404).json({ message: 'user not found' });

    const already = (user.registeredEvents || []).some(e => e.toString() === eventId.toString());
    if (already) return res.json({ message: 'already registered' });

    user.registeredEvents = user.registeredEvents || [];
    user.registeredEvents.push(eventId);
    await user.save();

    return res.json({ message: 'registered', eventId });
  } catch (err) {
    console.error('POST /events/:id/register error', err);
    res.status(500).json({ message: 'server error' });
  }
});

// PUT /api/events/:id — update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    console.error('Update event error:', err);
    res.status(500).json({ message: 'Error updating event', error: err.message });
  }
});


// DELETE /api/events/:id - delete event (admin only)
// DELETE /api/events/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete event error:', err);
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
});



// GET /api/events/:id - single event
router.get('/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let ev = null;

    if (mongoose.Types.ObjectId.isValid(param)) {
      ev = await Event.findById(param).lean();
    }

    if (!ev) {
      ev = await Event.findOne({
        $or: [
          { title: new RegExp(`^${param}$`, 'i') },
          { title: new RegExp(param, 'i') },
          { category: new RegExp(param, 'i') }
        ]
      }).lean();
    }

    if (!ev) return res.status(404).json({ message: 'Event not found on server yet.' });
    res.json(ev);
  } catch (err) {
    console.error('Error fetching event', err);
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = router;
