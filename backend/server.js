const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Custom middlewares
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

// Routes
const routes = require('./routes');
app.use('/', routes);

// Error handler
app.use(errorHandler);

// SPA 路由兜底：非 API/静态资源的请求都返回 index.html
app.get('*', (req, res) => {
  // 如果请求以 /api/ 开头，直接返回 404（如有其他 API 路径请自行补充判断）
  if (req.path.startsWith('/api/')) return res.status(404).end();
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 