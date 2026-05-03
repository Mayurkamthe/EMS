const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const sequelize = require('./config/db');

// Import models to register them with Sequelize
require('./models');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/reports', require('./routes/reports'));

app.get('/', (req, res) => res.json({ message: 'Smart College EMS API Running' }));

const PORT = process.env.PORT || 5000;

// Test DB connection then start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connected successfully');
    // sync: false — use existing schema (database.sql), don't auto-alter tables
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.error('➡  Check your .env file: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  });
