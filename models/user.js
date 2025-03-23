const { DataTypes } = require('sequelize');
const { ulid } = require('ulid');
const sequelize = require('../config/database');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(26),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => ulid() 
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
  },
  // فیلدهای جدید:
  photo: {
    type: DataTypes.TEXT,
    allowNull: true        
  },
  birth_date: {
    type: DataTypes.DATEONLY, 
    allowNull: true           
  },
  phone_number: {
    type: DataTypes.STRING, 
    allowNull: true         
  }
});

module.exports = User;
