// backend/createTestStudent.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const srn = 'PES1UG21CS001';
    const password = 'student123';

    let u = await User.findOne({ srn });
    const hash = await bcrypt.hash(password, 10);
    if (u) {
      u.password = hash;
      await u.save();
      console.log('Student password reset:', srn);
    } else {
      u = new User({ srn, name: 'Test Student', password: hash });
      await u.save();
      console.log('Student created:', srn);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
