const { Resource } = require('../models');

exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({ order: [['name', 'ASC']] });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { name, type, total_quantity, description } = req.body;
    await Resource.create({ name, type, total_quantity, description });
    res.status(201).json({ message: 'Resource created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    const { name, type, total_quantity, description } = req.body;
    await resource.update({ name, type, total_quantity, description });
    res.json({ message: 'Resource updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    await resource.destroy();
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
