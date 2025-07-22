require('dotenv').config();

const express = require('express');
const cors = require('cors');

const mongoose = require('./config/database');

const { User, Course, Form, Meal } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cors({
  origin: 'https://collegium.kojiberi.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello, welcome to the Collegium API!');
});

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connection established');
  app.listen(5000, () => {
    console.log(`✅ Server is running on http://localhost:5000`);
  });
});

mongoose.connection.on('error', err => {
  console.error('❌ MongoDB connection error:', err);
});
