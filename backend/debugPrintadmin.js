// backend/debugPrintAdmin.js
const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const a = await Admin.findOne({}).lean();
    console.log('ADMIN RECORD:', a);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
