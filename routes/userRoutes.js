const express = require('express');
const router = express.Router();
const { registerUser, getAllStudents, getStudent, updateUser, deleteUser, loginUser, getCourse } = require('../controllers/userController');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.get('/course/:course_name', getCourse);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
