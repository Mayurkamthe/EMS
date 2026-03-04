const express = require('express');
const router = express.Router();
const { auth, role } = require('../middleware/auth');
const {
  getEvents, getEvent, createEvent, updateEvent,
  approveRejectEvent, registerForEvent, getMyRegistrations,
  checkInStudent
} = require('../controllers/eventController');

router.get('/', auth, getEvents);
router.get('/my-registrations', auth, role('student'), getMyRegistrations);
router.get('/:id', auth, getEvent);
router.post('/', auth, role('faculty'), createEvent);
router.put('/:id', auth, role('faculty'), updateEvent);
router.patch('/:id/status', auth, role('admin'), approveRejectEvent);
router.post('/:id/register', auth, role('student'), registerForEvent);
router.post('/:id/checkin', auth, role('faculty', 'admin'), checkInStudent);

module.exports = router;
