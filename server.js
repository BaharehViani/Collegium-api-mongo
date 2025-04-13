require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { User, Course } = require('./models');
const userRoutes = require('./routes/userRoutes');

// create express app
const app = express();
app.use(express.json({ limit: "1mb" })); // increase request body limit
app.use(express.urlencoded({ limit: "1mb", extended: true })); 
app.use(cors());

// define routes
app.use('/api/users', userRoutes);  

// check database connection and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on http://${process.env.DB_HOST}:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ Database connection failed:', err));

app.get('/', (req, res) => {
  res.send('Hello, welcome to the Collegium API!');
});