// backend/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  srn: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.model("User", userSchema);
