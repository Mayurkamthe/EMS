const { Op } = require('sequelize');
const { Event, User, Resource, EventResource, Registration } = require('../models');

exports.getEvents = async (req, res) => {
  try {
    const { role, id } = req.user;
    const where = role === 'faculty' ? { created_by: id } : role === 'student' ? { status: 'approved' } : {};
    const events = await Event.findAll({
      where,
      include: [{ model: User, as: 'creator', attributes: ['name'] }],
      order: [['date', 'DESC']],
    });
    res.json(events.map(e => ({ ...e.toJSON(), creator_name: e.creator?.name })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creator', attributes: ['name'] },
        { model: Resource, as: 'resources', through: { attributes: ['quantity'] } },
      ],
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ ...event.toJSON(), creator_name: event.creator?.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, end_time, venue, total_seats, is_paid, fee, resources } = req.body;
    const created_by = req.user.id;

    if (resources && resources.length > 0) {
      for (const item of resources) {
        const conflict = await EventResource.findOne({
          include: [{
            model: Event,
            where: {
              date,
              status: { [Op.ne]: 'rejected' },
              [Op.or]: [
                { time: { [Op.lte]: time }, end_time: { [Op.gte]: time } },
                { time: { [Op.lte]: end_time }, end_time: { [Op.gte]: end_time } },
              ],
            },
          }],
          where: { resource_id: item.resource_id },
        });
        if (conflict) {
          const resource = await Resource.findByPk(item.resource_id, { attributes: ['name'] });
          return res.status(409).json({
            message: `Availability Conflict: "${resource.name}" is already booked for this time slot.`,
          });
        }
      }
    }

    const event = await Event.create({
      title, description, date, time, end_time, venue, total_seats,
      is_paid: Boolean(is_paid),
      fee: is_paid ? parseFloat(fee) : 0,
      created_by,
    });

    if (resources && resources.length > 0) {
      await EventResource.bulkCreate(
        resources.map(r => ({ event_id: event.id, resource_id: r.resource_id, quantity: r.quantity || 1 }))
      );
    }

    res.status(201).json({ message: 'Event created successfully, pending admin approval', eventId: event.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!event) return res.status(404).json({ message: 'Event not found or unauthorized' });
    if (event.status !== 'pending') return res.status(400).json({ message: 'Cannot modify approved/rejected events' });

    const { title, description, date, time, end_time, venue, total_seats, is_paid, fee } = req.body;
    await event.update({ title, description, date, time, end_time, venue, total_seats,
      is_paid: Boolean(is_paid), fee: is_paid ? parseFloat(fee) : 0 });
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.approveRejectEvent = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.update({ status, rejection_reason: rejection_reason || null });
    res.json({ message: `Event ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ where: { id: req.params.id, status: 'approved' } });
    if (!event) return res.status(404).json({ message: 'Event not found or not approved' });
    if (event.registered_seats >= event.total_seats) return res.status(400).json({ message: 'No seats available' });

    await Registration.create({ event_id: event.id, student_id: req.user.id });
    await event.increment('registered_seats');
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') return res.status(400).json({ message: 'Already registered' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      where: { student_id: req.user.id },
      include: [{ model: Event }],
      order: [[Event, 'date', 'DESC']],
    });
    res.json(registrations.map(r => ({ ...r.Event.toJSON(), registration_id: r.id, registered_at: r.registered_at, attended: r.attended })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.checkInStudent = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (req.user.role === 'faculty' && event.created_by !== req.user.id) {
      return res.status(403).json({ message: 'You can only check in students for your own events' });
    }

    const registration = await Registration.findOne({ where: { event_id: eventId, student_id: studentId } });
    if (!registration) return res.status(404).json({ message: 'Student is not registered for this event' });
    if (registration.attended) return res.status(400).json({ message: 'Student is already checked in' });

    await registration.update({ attended: true });
    const student = await User.findByPk(studentId, { attributes: ['name'] });
    res.json({ message: `Successfully checked in ${student.name}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
