const db = require('../config/db');
const PDFDocument = require('pdfkit');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[totalEvents]] = await db.query('SELECT COUNT(*) as count FROM events');
    const [[totalResources]] = await db.query('SELECT COUNT(*) as count FROM resources');
    const [[pendingApprovals]] = await db.query('SELECT COUNT(*) as count FROM events WHERE status = "pending"');
    const [upcomingEvents] = await db.query(
      'SELECT * FROM events WHERE status = "approved" AND date >= CURDATE() ORDER BY date LIMIT 5'
    );
    const [monthlyCount] = await db.query(
      `SELECT MONTHNAME(date) as month, COUNT(*) as count 
       FROM events WHERE YEAR(date) = YEAR(CURDATE()) GROUP BY MONTH(date), MONTHNAME(date) ORDER BY MONTH(date)`
    );
    const [mostUsedResources] = await db.query(
      `SELECT r.name, COUNT(er.id) as usage_count FROM event_resources er 
       JOIN resources r ON er.resource_id = r.id GROUP BY r.id ORDER BY usage_count DESC LIMIT 5`
    );
    const [[totalStudents]] = await db.query('SELECT COUNT(*) as count FROM users WHERE role="student"');

    res.json({
      totalEvents: totalEvents.count,
      totalResources: totalResources.count,
      pendingApprovals: pendingApprovals.count,
      upcomingEvents,
      monthlyCount,
      mostUsedResources,
      totalStudents: totalStudents.count
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const [events] = await db.query(
      `SELECT e.*, u.name as creator_name, 
       (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id) as reg_count
       FROM events e JOIN users u ON e.created_by = u.id ORDER BY e.date DESC`
    );

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=events-report.pdf');
    doc.pipe(res);

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text('Smart College EMS - Events Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);

    // Summary
    const approved = events.filter(e => e.status === 'approved').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const rejected = events.filter(e => e.status === 'rejected').length;

    doc.fontSize(12).font('Helvetica-Bold').text('Summary');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total Events: ${events.length}`);
    doc.text(`Approved: ${approved}  |  Pending: ${pending}  |  Rejected: ${rejected}`);
    doc.moveDown(1);

    // Events table
    doc.fontSize(12).font('Helvetica-Bold').text('Events List');
    doc.moveDown(0.5);

    events.forEach((event, i) => {
      const statusColor = event.status === 'approved' ? 'green' : event.status === 'rejected' ? 'red' : 'orange';
      doc.fontSize(10).font('Helvetica-Bold').text(`${i + 1}. ${event.title}`);
      doc.font('Helvetica').fontSize(9)
        .text(`   Date: ${new Date(event.date).toLocaleDateString()} | Time: ${event.time} - ${event.end_time}`)
        .text(`   Created by: ${event.creator_name} | Status: ${event.status.toUpperCase()}`)
        .text(`   Registrations: ${event.reg_count} / ${event.total_seats} seats`);
      doc.moveDown(0.3);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY role, name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
