require('dotenv').config(); // بارگذاری متغیرهای محیطی از فایل .env

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models/user'); // اتصال به دیتابیس (sequelize)
const userRoutes = require('./routes/userRoutes'); // روت‌ها

// ساخت یک اپلیکیشن Express
const app = express();

// استفاده از middleware‌ها
app.use(cors());  // برای درخواست‌های CORS
app.use(bodyParser.json());  // برای خواندن داده‌های JSON

// تعریف روت‌ها
app.use('/api/users', userRoutes);  // روت مربوط به کاربران

// بررسی اتصال به دیتابیس و راه‌اندازی سرور
sequelize.sync() // اتصال به دیتابیس
  .then(() => {
    // استفاده از متغیرهای محیطی برای پیکربندی سرور و اتصال به دیتابیس
    console.log("✅ Database connected!");
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server is running on http://${process.env.DB_HOST}:${process.env.PORT}`);
    });
  })
  .catch(err => console.error('❌ Database connection failed:', err));


app.get('/', (req, res) => {
  res.send('Hello, welcome to the Collegium API!');
});  