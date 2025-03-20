require('dotenv').config();  // بارگذاری متغیرهای محیطی از فایل .env
const { Sequelize, DataTypes } = require('sequelize');
const { ulid } = require('ulid');

// اتصال به دیتابیس با استفاده از متغیرهای محیطی
const sequelize = new Sequelize(
  process.env.DB_NAME,     // نام دیتابیس از فایل .env
  process.env.DB_USER,     // نام کاربری دیتابیس از فایل .env
  process.env.DB_PASSWORD, // پسورد دیتابیس از فایل .env
  {
    host: process.env.DB_HOST,   // هاست دیتابیس از فایل .env
    dialect: 'mysql',            // نوع دیتابیس
  }
);

// مدل User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(26), // ULID یک مقدار رشته‌ای است
    primaryKey: true,
    allowNull: false,
    defaultValue: () => ulid() // مقدار پیش‌فرض ULID
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.BIGINT,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// سینک کردن مدل با دیتابیس (ساخت جدول)
sequelize.sync()
  .then(() => console.log('Database and tables created!'))
  .catch((error) => console.log('Error creating database:', error));

module.exports = { sequelize, User };
