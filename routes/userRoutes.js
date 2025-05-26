const express = require('express');
const router = express.Router();
const { registerUser, getAllStudents, getStudent, updateUser, deleteUser, loginUser, getCourse, getAllMajors,
    submitForm, getFormsForUser, updateForm, deleteForm, getFormById} = require('../controllers/userController');


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/course/:course_name', getCourse);
router.get('/majors', getAllMajors);
router.get('/', getAllStudents);
router.get('/:id', getStudent);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/form', submitForm);
router.get('/forms/:user_id', getFormsForUser);
router.patch('/form/:id', updateForm);
router.delete('/form/:id', deleteForm);
router.get('/form/:id', getFormById);

module.exports = router;
