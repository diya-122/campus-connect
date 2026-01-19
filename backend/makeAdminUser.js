// backend/makeAdminUser.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin"); // ✅ correct now
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ adminId: "AD101" });
  if (existing) {
    console.log("Admin already exists");
    process.exit(0);
  }

  const hashed = await bcrypt.hash("admin123", 10);
  const admin = new Admin({ adminId: "AD101", password: hashed });
  await admin.save();

  console.log("✅ Admin created with ID: AD101, Password: admin123");
  process.exit(0);
}

createAdmin();
