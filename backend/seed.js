require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Event = require('./models/Event');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing collections
  await User.deleteMany({});
  await Event.deleteMany({});
  console.log('🧹 Cleared old users and events');

  const now = new Date();

  // --- EVENTS DATA ---
  const events = [
    {
      title: 'Orientation',
      club: 'Student Affairs',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10),
      description: 'Welcome to a new academic year! Get to know your campus, clubs, and peers.',
    },
    {
      title: 'Hackathon',
      club: 'Code Club',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
      deadline: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
      description: 'A thrilling 24-hour coding marathon with exciting problem statements!',
      registrationLink: '',
    },
    {
      title: 'Cultural Night',
      club: 'Cultural Club',
      date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30),
      description: 'An evening of vibrant performances, music, and dance celebrating diversity.',
    },
    // 🎃 Hack-O-Ween Hackathon — Past Event
    {
      title: 'Hack-O-Ween',
      type: 'hackathon',
      club: 'ARCH (Dept. of CSE AI & ML, PES University)',
      date: new Date('2024-10-25'),
      endDate: new Date('2024-10-26'),
      venue: 'PESU52',
      teamSize: '3-4',
      image: 'https://your-server.com/uploads/hackoween.jpg', // replace with your actual uploaded image URL
      description: `Trick, Treat, Code, Repeat! 👻

ARCH presents HACK-O-WEEN 🎃 — a 24-hour hackathon of thrills, chills, and code skills!

Choose your haunted domain:
🩸 Cursed Care (Healthcare)
🔮 Phantom Predictions (AI for Good & Predictions)
🤖 Ghost in the Machine (Chatbots)
🪞 Hall of Illusions (AR & VR)
⚡ Hacknstein’s Playground (Open Innovation)

Because this Halloween, the real magic is in your code! 🧙‍♂💻`,
      registrationLink: 'https://forms.gle/pSB1yqESmhbndWJP7',
      instagram: 'https://www.instagram.com/arch_pesu/',
      isPast: true,
    },
  ];

  const createdEvents = await Event.insertMany(events);
  console.log(`🎟️ Created ${createdEvents.length} events`);

  // --- USERS DATA ---
  const users = [
    { srn: 'PES1UG21CS001', name: 'Alice', password: 'PES1UG21CS001', isAdmin: false },
    { srn: 'PES1UG21CS002', name: 'Bob', password: 'PES1UG21CS002', isAdmin: false },
    { srn: 'ADMIN01', name: 'Admin User', password: 'Admin01Pass', isAdmin: true },
  ];

  for (const u of users) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(u.password, salt);

    await User.create({
      srn: u.srn,
      name: u.name,
      passwordHash: hash,
      registeredEvents: [],
      isAdmin: u.isAdmin || false,
    });

    console.log(`👤 Created user ${u.srn} (Admin: ${u.isAdmin})`);
  }

  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
