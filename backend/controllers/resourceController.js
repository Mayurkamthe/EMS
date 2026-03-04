const db = require('../config/db');

exports.getResources = async (req, res) => {
  try {
    const [resources] = await db.query('SELECT * FROM resources ORDER BY name');
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { name, type, total_quantity, description } = req.body;
    await db.query('INSERT INTO resources (name, type, total_quantity, description) VALUES (?,?,?,?)',
      [name, type, total_quantity, description]);
    res.status(201).json({ message: 'Resource created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const { name, type, total_quantity, description } = req.body;
    await db.query('UPDATE resources SET name=?, type=?, total_quantity=?, description=? WHERE id=?',
      [name, type, total_quantity, description, req.params.id]);
    res.json({ message: 'Resource updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    await db.query('DELETE FROM resources WHERE id=?', [req.params.id]);
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
