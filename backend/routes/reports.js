const express = require('express');
const router = express.Router();
const { auth, role } = require('../middleware/auth');
const { getDashboardStats, generateReport, getUsers } = require('../controllers/reportController');

router.get('/stats', auth, role('admin'), getDashboardStats);
router.get('/pdf', auth, role('admin'), generateReport);
router.get('/users', auth, role('admin'), getUsers);

module.exports = router;
