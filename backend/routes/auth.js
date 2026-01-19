const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Admin = require('../models/Admin');

// STUDENT LOGIN -> POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    let { srn, studentId, password } = req.body;

    // Normalize input (frontend may send srn OR studentId)
    srn = srn || studentId;
    if (!srn || !password)
      return res.status(400).json({ message: 'srn and password required' });

    const user = await User.findOne({ srn }).lean();
    if (!user)
      return res.status(401).json({ message: 'invalid credentials' });

    const hashed = user.passwordHash || user.password || '';
    const ok = await bcrypt.compare(password, hashed);
    if (!ok)
      return res.status(401).json({ message: 'invalid credentials' });

    req.session.user = {
      id: user._id.toString(),
      srn: user.srn,
      name: user.name || '',
      role: 'student'
    };

    return res.json({ user: req.session.user, message: 'ok' });

  } catch (err) {
    console.error('POST /auth/login error', err);
    return res.status(500).json({ message: 'server error' });
  }
});


    

// ADMIN LOGIN -> POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { adminId, password } = req.body;
    if (!adminId || !password) {
      return res.status(400).json({ message: 'adminId and password required' });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(401).json({ message: 'invalid admin credentials' });
    }

    // Admin password comparison
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return res.status(401).json({ message: 'invalid admin credentials' });
    }

    req.session.user = {
      id: admin._id.toString(),
      adminId: admin.adminId,
      name: admin.name || '',
      role: 'admin'
    };

    return res.json({ user: req.session.user, message: 'ok' });
  } catch (err) {
    console.error('POST /auth/admin-login error', err);
    return res.status(500).json({ message: 'server error' });
  }
});

// WHOAMI
router.get('/me', (req, res) => {
  try {
    if (!req.session || !req.session.user) {
      return res.json({ user: null });
    }
    return res.json({ user: req.session.user });
  } catch (err) {
    console.error('GET /auth/me error', err);
    return res.status(500).json({ message: 'server error' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'logout failed' });
    res.json({ message: 'logged out' });
  });
});

module.exports = router;
