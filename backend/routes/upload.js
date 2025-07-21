const express = require('express');
const router = express.Router();
const rateLimiter = require('../middlewares/rateLimiter');
const upload = require('../utils/multerConfig');
const { uploadToOSS } = require('../config/oss');
const userImageService = require('../services/userImageService');

router.post('/', rateLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image to upload' });
    }
    const userId = 1; // 假设用户ID
    // 直接调用 service，service 内部决定是否查重、是否上传
    const imageResult = await userImageService.uploadImageWithOss({
      userId,
      file: req.file,
      isPublic: 1,
      storageProvider: 'oss',
      tagId: null,
      remark: null,
      uploadToOSS
    });
    res.json({
      url: imageResult.url,
      fileName: imageResult.fileName,
      id: imageResult.id,
      duplicate: imageResult.duplicate
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

module.exports = router; 