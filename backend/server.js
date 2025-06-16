const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { uploadToOSS } = require('./config/oss');

// 加载环境变量
dotenv.config();

const app = express();

// 限速配置
const RATE_LIMIT = {
  windowMs: 1000, // 1秒
  max: 5, // 每秒最多5个请求
  dailyLimit: 100 // 每天最多100个请求
};

// 存储每个IP的请求计数
const ipRequests = new Map();

// 限速中间件
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  // 初始化IP记录
  if (!ipRequests[ip]) {
    ipRequests[ip] = {
      requests: [],
      dailyCount: 0,
      lastReset: now
    };
  }
  
  // 重置每日计数
  if (now - ipRequests[ip].lastReset > 24 * 60 * 60 * 1000) {
    ipRequests[ip].dailyCount = 0;
    ipRequests[ip].lastReset = now;
  }
  
  // 检查每日限制
  if (ipRequests[ip].dailyCount >= RATE_LIMIT.dailyLimit) {
    return res.status(429).json({ error: '已达到每日上传限制' });
  }
  
  // 清理过期的请求记录
  ipRequests[ip].requests = ipRequests[ip].requests.filter(
    time => now - time < RATE_LIMIT.windowMs
  );
  
  // 检查每秒限制
  if (ipRequests[ip].requests.length >= RATE_LIMIT.max) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
  }
  
  // 记录新请求
  ipRequests[ip].requests.push(now);
  ipRequests[ip].dailyCount++;
  
  next();
};

// 中间件
app.use(cors());
app.use(express.json());

// 配置静态文件服务
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 配置 multer 内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // 限制 30MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件！'));
    }
  },
});

// 基础路由 - 服务前端页面
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// API 路由
app.get('/api/status', (req, res) => {
  res.json({ message: 'PhotoOmmit API is running' });
});

// 文件上传路由
app.post('/api/upload', rateLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' });
    }

    const result = await uploadToOSS(req.file);
    res.json({ 
      url: result.url,
      fileName: result.fileName
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || '上传失败' });
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小不能超过 30MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message || '服务器错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 