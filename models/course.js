const { DataTypes } = require('sequelize');
const { ulid } = require('ulid');
const sequelize = require('../config/database');

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

module.exports = Course;
