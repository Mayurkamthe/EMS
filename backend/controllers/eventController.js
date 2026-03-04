const db = require('../config/db');

// Get all events (filtered by role)
exports.getEvents = async (req, res) => {
  try {
    const { role, id } = req.user;
    let query, params = [];

    if (role === 'admin') {
      query = `SELECT e.*, u.name as creator_name FROM events e 
               JOIN users u ON e.created_by = u.id ORDER BY e.date DESC`;
    } else if (role === 'faculty') {
      query = `SELECT e.*, u.name as creator_name FROM events e 
               JOIN users u ON e.created_by = u.id WHERE e.created_by = ? ORDER BY e.date DESC`;
      params = [id];
    } else {
      query = `SELECT e.*, u.name as creator_name FROM events e 
               JOIN users u ON e.created_by = u.id WHERE e.status = 'approved' ORDER BY e.date DESC`;
    }

    const [events] = await db.query(query, params);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const [events] = await db.query(
      `SELECT e.*, u.name as creator_name FROM events e 
       JOIN users u ON e.created_by = u.id WHERE e.id = ?`,
      [req.params.id]
    );
    if (!events.length) return res.status(404).json({ message: 'Event not found' });

    const [resources] = await db.query(
      `SELECT r.*, er.quantity FROM event_resources er JOIN resources r ON er.resource_id = r.id WHERE er.event_id = ?`,
      [req.params.id]
    );

    res.json({ ...events[0], resources });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create event (faculty)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, time, end_time, venue, total_seats, is_paid, fee, resources } = req.body;
    const created_by = req.user.id;

    const eventIsPaid = Boolean(is_paid);
    const eventFee = eventIsPaid ? parseFloat(fee) : 0.00;

    // Check resource conflicts
    if (resources && resources.length > 0) {
      for (const res_item of resources) {
        const [conflicts] = await db.query(
          `SELECT er.id FROM event_resources er 
           JOIN events e ON er.event_id = e.id
           WHERE er.resource_id = ? AND e.date = ? AND e.status != 'rejected'
           AND ((e.time <= ? AND e.end_time >= ?) OR (e.time <= ? AND e.end_time >= ?))`,
          [res_item.resource_id, date, time, time, end_time, end_time]
        );

        if (conflicts.length > 0) {
          const [resourceInfo] = await db.query('SELECT name FROM resources WHERE id = ?', [res_item.resource_id]);
          return res.status(409).json({
            message: `Availability Conflict Alert: "${resourceInfo[0].name}" is already booked for this time slot.`
          });
        }
      }
    }

    const [result] = await db.query(
      'INSERT INTO events (title, description, date, time, end_time, venue, total_seats, is_paid, fee, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, time, end_time, venue, total_seats, eventIsPaid, eventFee, created_by]
    );

    const eventId = result.insertId;

    if (resources && resources.length > 0) {
      for (const res_item of resources) {
        await db.query(
          'INSERT INTO event_resources (event_id, resource_id, quantity) VALUES (?, ?, ?)',
          [eventId, res_item.resource_id, res_item.quantity || 1]
        );
      }
    }

    res.status(201).json({ message: 'Event created successfully, pending admin approval', eventId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update event (faculty - only before approval)
exports.updateEvent = async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events WHERE id = ? AND created_by = ?', [req.params.id, req.user.id]);
    if (!events.length) return res.status(404).json({ message: 'Event not found or unauthorized' });
    if (events[0].status !== 'pending') return res.status(400).json({ message: 'Cannot modify approved/rejected events' });

    const { title, description, date, time, end_time, venue, total_seats, is_paid, fee } = req.body;

    const eventIsPaid = Boolean(is_paid);
    const eventFee = eventIsPaid ? parseFloat(fee) : 0.00;

    await db.query(
      'UPDATE events SET title=?, description=?, date=?, time=?, end_time=?, venue=?, total_seats=?, is_paid=?, fee=? WHERE id=?',
      [title, description, date, time, end_time, venue, total_seats, eventIsPaid, eventFee, req.params.id]
    );
    res.json({ message: 'Event updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin approve/reject
exports.approveRejectEvent = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    await db.query('UPDATE events SET status=?, rejection_reason=? WHERE id=?',
      [status, rejection_reason || null, req.params.id]);

    res.json({ message: `Event ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Student register for event
exports.registerForEvent = async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events WHERE id = ? AND status = "approved"', [req.params.id]);
    if (!events.length) return res.status(404).json({ message: 'Event not found or not approved' });

    const event = events[0];
    if (event.registered_seats >= event.total_seats) {
      return res.status(400).json({ message: 'No seats available' });
    }

    await db.query('INSERT INTO registrations (event_id, student_id) VALUES (?, ?)', [req.params.id, req.user.id]);
    await db.query('UPDATE events SET registered_seats = registered_seats + 1 WHERE id = ?', [req.params.id]);

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Already registered' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get student's registrations
exports.getMyRegistrations = async (req, res) => {
  try {
    const [regs] = await db.query(
      `SELECT e.*, r.id as registration_id, r.registered_at, r.attended FROM registrations r 
       JOIN events e ON r.event_id = e.id WHERE r.student_id = ? ORDER BY e.date DESC`,
      [req.user.id]
    );
    res.json(regs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Check in student via QR
exports.checkInStudent = async (req, res) => {
  try {
    const { eventId, studentId } = req.body;

    // Check if event exists and belongs to faculty (or admin)
    const [events] = await db.query('SELECT * FROM events WHERE id = ?', [eventId]);
    if (!events.length) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role === 'faculty' && events[0].created_by !== req.user.id) {
      return res.status(403).json({ message: 'You can only check in students for your own events' });
    }

    const [registration] = await db.query('SELECT * FROM registrations WHERE event_id = ? AND student_id = ?', [eventId, studentId]);
    if (!registration.length) {
      return res.status(404).json({ message: 'Student is not registered for this event' });
    }

    if (registration[0].attended) {
      return res.status(400).json({ message: 'Student is already checked in' });
    }

    await db.query('UPDATE registrations SET attended = TRUE WHERE event_id = ? AND student_id = ?', [eventId, studentId]);

    // Fetch student info for success message
    const [studentInfo] = await db.query('SELECT name FROM users WHERE id = ?', [studentId]);

    res.json({ message: `Successfully checked in ${studentInfo[0].name}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
