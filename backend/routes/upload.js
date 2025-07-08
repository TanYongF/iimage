const express = require('express');
const router = express.Router();
const rateLimiter = require('../middlewares/rateLimiter');
const upload = require('../utils/multerConfig');
const { uploadToOSS } = require('../config/oss');

router.post('/', rateLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image to upload' });
    }
    const fileName = req.file.originalname || 'pasted-image.png';
    const result = await uploadToOSS(req.file);
    res.json({
      url: result.url,
      fileName: result.fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

module.exports = router; 