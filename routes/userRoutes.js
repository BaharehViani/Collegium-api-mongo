const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');

// روت‌ها
router.post('/register', registerUser);
router.get('/', getAllUsers);  // همه یوزرها
router.get('/:username', getUser);  // یک یوزر خاص با username
router.put('/:username', updateUser);  // ویرایش یوزر با username
router.delete('/:username', deleteUser);  // حذف یوزر با username

module.exports = router;
