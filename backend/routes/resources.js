const express = require('express');
const router = express.Router();
const { auth, role } = require('../middleware/auth');
const { getResources, createResource, updateResource, deleteResource } = require('../controllers/resourceController');

router.get('/', auth, getResources);
router.post('/', auth, role('admin'), createResource);
router.put('/:id', auth, role('admin'), updateResource);
router.delete('/:id', auth, role('admin'), deleteResource);

module.exports = router;
