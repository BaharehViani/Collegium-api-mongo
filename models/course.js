const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
  instructor_name: {
    type: String,
    required: true,
  },
  first_class: {
    type: String,
    required: true,
  },
  second_class: {
    type: String,
    required: false,
  }
}, {
  timestamps: true, 
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
