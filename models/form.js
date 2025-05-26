const mongoose = require('mongoose');
const { Schema } = mongoose;

const formSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  tracking_code: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,  // نوع ObjectId برای رفرنس به User
    required: true,
    ref: 'User',   // رفرنس به مدل User
  }
}, {
  timestamps: true,  // اگر دوست داری createdAt و updatedAt داشته باشی
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
