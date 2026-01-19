// backend/createOrResetAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Admin = require('./models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const adminId = 'AD101';
    const password = 'admin123'; // new known password

    let admin = await Admin.findOne({ adminId });
    const hash = await bcrypt.hash(password, 10);

    if (admin) {
      admin.password = hash;
      await admin.save();
      console.log('Admin password reset:', adminId);
    } else {
      admin = new Admin({ adminId, password: hash });
      await admin.save();
      console.log('Admin created:', adminId);
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
