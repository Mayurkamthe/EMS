const { Op, fn, col, literal } = require('sequelize');
const { Event, User, Resource, EventResource, Registration } = require('../models');
const PDFDocument = require('pdfkit');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalEvents, totalResources, pendingApprovals, upcomingEvents, monthlyCount, mostUsedResources, totalStudents] = await Promise.all([
      Event.count(),
      Resource.count(),
      Event.count({ where: { status: 'pending' } }),
      Event.findAll({ where: { status: 'approved', date: { [Op.gte]: new Date() } }, order: [['date', 'ASC']], limit: 5 }),
      Event.findAll({
        attributes: [[fn('MONTHNAME', col('date')), 'month'], [fn('COUNT', col('id')), 'count']],
        where: literal('YEAR(date) = YEAR(CURDATE())'),
        group: [fn('MONTH', col('date')), fn('MONTHNAME', col('date'))],
        order: [[fn('MONTH', col('date')), 'ASC']],
        raw: true,
      }),
      EventResource.findAll({
        attributes: [[fn('COUNT', col('EventResource.id')), 'usage_count']],
        include: [{ model: Resource, attributes: ['name'] }],
        group: ['resource_id', 'Resource.id'],
        order: [[literal('usage_count'), 'DESC']],
        limit: 5,
        raw: true,
      }),
      User.count({ where: { role: 'student' } }),
    ]);

    res.json({ totalEvents, totalResources, pendingApprovals, upcomingEvents, monthlyCount, mostUsedResources, totalStudents });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: User, as: 'creator', attributes: ['name'] },
        { model: Registration, attributes: [] },
      ],
      attributes: { include: [[fn('COUNT', col('Registrations.id')), 'reg_count']] },
      group: ['Event.id', 'creator.id'],
      order: [['date', 'DESC']],
      raw: true,
    });

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=events-report.pdf');
    doc.pipe(res);

    doc.fontSize(20).font('Helvetica-Bold').text('Smart College EMS - Events Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);

    const approved = events.filter(e => e.status === 'approved').length;
    const pending = events.filter(e => e.status === 'pending').length;
    const rejected = events.filter(e => e.status === 'rejected').length;

    doc.fontSize(12).font('Helvetica-Bold').text('Summary');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Total Events: ${events.length}`);
    doc.text(`Approved: ${approved}  |  Pending: ${pending}  |  Rejected: ${rejected}`);
    doc.moveDown(1);
    doc.fontSize(12).font('Helvetica-Bold').text('Events List');
    doc.moveDown(0.5);

    events.forEach((event, i) => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${i + 1}. ${event.title}`);
      doc.font('Helvetica').fontSize(9)
        .text(`   Date: ${new Date(event.date).toLocaleDateString()} | Time: ${event.time} - ${event.end_time}`)
        .text(`   Created by: ${event['creator.name']} | Status: ${event.status.toUpperCase()}`)
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
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'created_at'],
      order: [['role', 'ASC'], ['name', 'ASC']],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
