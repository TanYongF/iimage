const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { uploadToOSS, getOSSFileStream, deleteOSSFile, getOSSFileInfo } = require('../config/oss');

// GET /mcp 工具发现接口
router.get('/', (req, res) => {
  res.json({
    name: 'image-uploader',
    description: 'Image upload and management tools',
    tools: [
      {
        name: 'upload',
        description: 'Upload an image file',
        method: 'POST',
        path: '/mcp/upload',
        args: [
          { name: 'file', type: 'file', required: true, description: 'The image file to upload' }
        ]
      },
      {
        name: 'download',
        description: 'Download an image file by id',
        method: 'GET',
        path: '/mcp/download/:id',
        args: [
          { name: 'id', type: 'string', required: true, description: 'The file id' }
        ]
      },
      {
        name: 'delete',
        description: 'Delete an image file by id',
        method: 'DELETE',
        path: '/mcp/delete/:id',
        args: [
          { name: 'id', type: 'string', required: true, description: 'The file id' }
        ]
      },
      {
        name: 'info',
        description: 'Get info of an image file by id',
        method: 'GET',
        path: '/mcp/info/:id',
        args: [
          { name: 'id', type: 'string', required: true, description: 'The file id' }
        ]
      }
    ]
  });
});

// POST /mcp/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ code: 1, msg: 'No file uploaded' });
    }
    const fileName = req.file.originalname || 'uploaded-image.png';
    const result = await uploadToOSS(req.file);
    res.json({
      code: 0,
      msg: 'Upload successful',
      data: {
        url: result.url,
        id: result.fileName,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('MCP Upload error:', error);
    res.status(500).json({ code: 1, msg: error.message || 'Upload failed' });
  }
});

// GET /mcp/download/:id
router.get('/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const fileStream = await getOSSFileStream(fileId);
    if (!fileStream) {
      return res.status(404).json({ code: 1, msg: 'File not found' });
    }
    res.setHeader('Content-Disposition', `attachment; filename="${fileId}"`);
    fileStream.pipe(res);
  } catch (error) {
    console.error('MCP Download error:', error);
    res.status(500).json({ code: 1, msg: error.message || 'Download failed' });
  }
});

// DELETE /mcp/delete/:id
router.delete('/delete/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const result = await deleteOSSFile(fileId);
    if (result && result.success) {
      res.json({ code: 0, msg: 'Delete successful' });
    } else if (result && result.notFound) {
      res.status(404).json({ code: 1, msg: 'File not found' });
    } else {
      res.status(500).json({ code: 1, msg: 'Delete failed' });
    }
  } catch (error) {
    console.error('MCP Delete error:', error);
    res.status(500).json({ code: 1, msg: error.message || 'Delete failed' });
  }
});

// GET /mcp/info/:id
router.get('/info/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    const info = await getOSSFileInfo(fileId);
    if (!info) {
      return res.status(404).json({ code: 1, msg: 'File not found' });
    }
    res.json({
      code: 0,
      msg: 'Query successful',
      data: info
    });
  } catch (error) {
    console.error('MCP Info error:', error);
    res.status(500).json({ code: 1, msg: error.message || 'Query failed' });
  }
});

module.exports = router; 