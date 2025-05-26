require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 1. Import and connect MongoDB via Mongoose
const mongoose = require('./config/database'); // database.js now sets up mongoose.connect()

// 2. Import Mongoose models (no Sequelize here)
const { User, Course, Form } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();

// 3. Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cors());

// 4. Mount your API routes
app.use('/api/users', userRoutes);

// 5. Health check or root endpoint
app.get('/', (req, res) => {
  res.send('Hello, welcome to the Collegium API!');
});

// 6. Start the server once Mongoose connection is ready
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connection established');
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server is running on http://localhost:${process.env.PORT}`);
  });
});

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err);
});
