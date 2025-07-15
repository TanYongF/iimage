const express = require('express');
const router = express.Router();

const statusRouter = require('./status');
const uploadRouter = require('./upload');

router.use('/api/status', statusRouter);
router.use('/api/upload', uploadRouter);

// Serve frontend
const path = require('path');
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

module.exports = router; 