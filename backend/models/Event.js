const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  club: { type: String, default: 'General' },
  description: { type: String },
  date: { type: Date, required: true },
  deadline: { type: Date },
  registrationLink: { type: String },   // existing (external or google forms)
  googleForm: { type: String },         // optional explicit google form link
  image: { type: String },              // poster image url (optional)
  category: { type: String, default: 'Other' }, // e.g. Hackathon, Workshop, Other
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
