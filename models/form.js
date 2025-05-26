const { DataTypes } = require('sequelize');
const { ulid } = require('ulid');
const sequelize = require('../config/database');

// User Model
const Form = sequelize.define('Form', {
  id: {
    type: DataTypes.STRING(26),
    primaryKey: true,
    allowNull: false,
    defaultValue: () => ulid() 
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tracking_code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
});

Form.associate = (models) => {
  Form.belongsTo(models.User, { 
    foreignKey: 'user_id',
    as: 'user'
  });
};

module.exports = Form;
