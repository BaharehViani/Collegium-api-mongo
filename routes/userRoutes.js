const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, getUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');


router.post('/register', registerUser);
router.get('/', getAllUsers);  // همه یوزرها
router.get('/:username', getUser);  // یک یوزر خاص با username
router.put('/:username', updateUser);  // ویرایش یوزر با username
router.delete('/:username', deleteUser);  // حذف یوزر با username
router.post('/login', loginUser);

module.exports = router;
