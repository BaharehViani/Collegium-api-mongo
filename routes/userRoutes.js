const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, getUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');


router.post('/register', registerUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);

module.exports = router;
