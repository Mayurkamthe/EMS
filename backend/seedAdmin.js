const bcrypt = require('bcryptjs');
require('dotenv').config();
const sequelize = require('./config/db');
const { User } = require('./models');

async function seedAdmin() {
  try {
    await sequelize.authenticate();

    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error('❌ Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env');
      process.exit(1);
    }

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: 'admin' });
    console.log(`✅ Admin created: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedAdmin();
