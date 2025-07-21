const express = require('express');
const router = express.Router();
const noteModel = require('../db/models/note');

// 创建/更新笔记
router.post('/', async (req, res) => {
  const { key, value } = req.body;
  if (!key) {
    return res.status(400).json({ code: 1, message: 'key is required', data: null });
  }
  try {
    const success = await noteModel.setNote(key, value);
    if (success) {
      res.json({ code: 0, message: 'Note saved successfully', data: null });
    } else {
      res.status(500).json({ code: 1, message: 'Failed to save note', data: null });
    }
  } catch (err) {
    res.status(500).json({ code: 1, message: err.message || 'Internal server error', data: null });
  }
});

// 查询笔记
router.get('/:key', async (req, res) => {
  const { key } = req.params;
  if (!key) {
    return res.status(400).json({ code: 1, message: 'key is required', data: null });
  }
  try {
    const value = await noteModel.getNote(key);
    if (value !== undefined) {
      res.json({ code: 0, message: 'success', data: { key, value } });
    } else {
      res.status(404).json({ code: 1, message: 'Note not found', data: null });
    }
  } catch (err) {
    res.status(500).json({ code: 1, message: err.message || 'Internal server error', data: null });
  }
});

module.exports = router; 