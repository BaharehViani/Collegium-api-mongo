require('dotenv').config(); // بارگذاری متغیرهای محیطی از فایل .env

const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models/user'); // اتصال به دیتابیس (sequelize)
const userRoutes = require('./routes/userRoutes'); // روت‌ها

const app = express();
app.use(express.json({ limit: "1mb" })); // افزایش حجم مجاز درخواست‌ها
app.use(express.urlencoded({ limit: "1mb", extended: true })); // برای فرم‌ها
app.use(cors());

// تعریف روت‌ها
app.use('/api/users', userRoutes);  

// بررسی اتصال به دیتابیس و راه‌اندازی سرور
sequelize.sync()
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