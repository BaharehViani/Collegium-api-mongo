const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, getUser, updateUser, deleteUser, loginUser, getCourse } = require('../controllers/userController');


router.post('/register', registerUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);
router.get('/course/:course_name', getCourse);

module.exports = router;
