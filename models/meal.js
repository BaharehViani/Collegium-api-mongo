const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  meal_name: {
    type: String,
    required: true,
  },
  meal_type: {
    type: String,
    required: true,
  },
  cafeteria_name: {
    type: String,
    required: true,
  },
  reservation_date: {
    type: Date,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,  
    required: true,
    ref: 'User',   
  },
}, {
  timestamps: true, 
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
