const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  username: {
    type: Number, // یا String، هر چی که میخوای
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: null,
  },
  birth_date: {
    type: String,
    default: null,
  },
  phone_number: {
    type: String,
    default: null,
  },
  major: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // اگر دوست داری createdAt و updatedAt داشته باشی
});

const User = mongoose.model('User', userSchema);

module.exports = User;
