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

sequelize.sync()
  .then(() => console.log('Database and tables created!'))
  .catch((error) => console.log('Error creating database:', error));

module.exports = { sequelize, User };
