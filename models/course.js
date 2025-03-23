require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const { ulid } = require('ulid');

// Connect to database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
  }
);

// Course Model
const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.STRING(26),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => ulid()
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_class: {
    type: DataTypes.STRING,
    allowNull: false
  },
  second_class: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

sequelize.sync()
  .then(() => console.log('Database and tables created!'))
  .catch((error) => console.log('Error creating database:', error));

module.exports = { sequelize, Course };
