const express = require('express');
const router = express.Router();
const { registerUser, getAllStudents, getStudent, updateUser, deleteUser, loginUser, getCourse, getAllMajors } = require('../controllers/userController');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/course/:course_name', getCourse);
router.get('/majors', getAllMajors);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
