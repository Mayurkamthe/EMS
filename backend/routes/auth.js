const express = require('express');
const router = express.Router();
const { register, login, createUser, deleteUser } = require('../controllers/authController');
const { auth, role } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/create-user', auth, role('admin'), createUser);
router.delete('/users/:id', auth, role('admin'), deleteUser);

module.exports = router;
